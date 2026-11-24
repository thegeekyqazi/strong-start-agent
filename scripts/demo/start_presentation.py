"""Start the loopback presentation with live providers and one prepared draft."""

from __future__ import annotations

import argparse
import os
import subprocess
from pathlib import Path
from urllib.parse import quote

from dotenv import dotenv_values

from .e2e_demo import Api, fail, prepare, published

ROOT = Path(__file__).resolve().parents[2]
DATABASE = "strongstart_live_presentation"
PROVIDER_SETTINGS = (
    "STRONGSTART_GEMINI_API_KEY",
    "STRONGSTART_GEMINI_MODEL",
    "STRONGSTART_TAVILY_API_KEY",
    "STRONGSTART_FIRECRAWL_API_KEY",
)


def local_environment(provider_env: Path) -> dict[str, str]:
    settings = dotenv_values(provider_env)
    env = os.environ.copy()
    env.pop("DEMO_ALLOWED_HOST", None)
    for name in PROVIDER_SETTINGS:
        value = env.get(name) or settings.get(name)
        if not value:
            fail(f"configure {name} in the private provider environment")
        env[name] = value

    local = dotenv_values(ROOT / ".env")
    password = quote(
        env.get("STRONGSTART_LOCAL_DB_PASSWORD")
        or local.get("STRONGSTART_LOCAL_DB_PASSWORD")
        or "strongstart_local_dev",
        safe="",
    )
    port = int(
        env.get("STRONGSTART_LOCAL_DB_PORT") or local.get("STRONGSTART_LOCAL_DB_PORT") or "55432"
    )
    url = f"postgresql+psycopg://strongstart:{password}@127.0.0.1:{port}/{DATABASE}"
    env.update(
        STRONGSTART_ENVIRONMENT="local",
        STRONGSTART_AUTH_MODE="fixture",
        STRONGSTART_MODEL_PROVIDER="gemini",
        STRONGSTART_FUNDING_SEARCH_MODE="live",
        STRONGSTART_FUNDING_CAPTURE_MODE="live",
        STRONGSTART_ANSWER_STORE_BACKEND="postgres",
        STRONGSTART_DATABASE_PROFILE="local",
        STRONGSTART_DATABASE_URL=url,
        STRONGSTART_KNOWLEDGE_ARTIFACT_STORE_DIR=str(
            ROOT / ".local-data/demo-live/state/knowledge-artifacts"
        ),
        DEMO_DB="local-fallback",
        DEMO_LOCAL_DATABASE_URL=url,
    )
    return env


def prepare_draft(api: Api) -> tuple[str, str]:
    prepared = prepare(api, "ui002-presentation-v1", "prefill", run_search=False)
    question_set_id = str(prepared["definition"]["question_set_id"])
    question_id = published(prepared, "pf-summary")
    workspace = api.get("/api/applications/workspace", {"question_set_id": question_set_id})
    question = next(
        q for q in workspace["question_set"]["questions"] if q["question_id"] == question_id
    )
    fact = next(
        (
            f
            for f in workspace["evidence_bundle"]["facts"]
            if f["fact_id"] == "demo-fact-children-served"
        ),
        None,
    )
    if fact is None or not fact["provenance"]["is_simulated"]:
        fail("the expected synthetic source for the prepared answer is unavailable")
    history = api.get(
        f"/api/applications/answers/{quote(question_id, safe='')}",
        {"question_set_id": question_set_id},
    )
    if not history["versions"]:
        api.post(
            "/api/applications/answers/versions",
            {
                "question_id": question_id,
                "question_version": question["question_version"],
                "question_set_id": question_set_id,
                "evidence_bundle_id": workspace["evidence_bundle"]["bundle_id"],
                "expected_answer_version": None,
                "text": (
                    "During the reporting period, the organization served "
                    f"{{{{fact:{fact['fact_id']}}}}} across its programs. "
                    "The proposed project's reach still needs to be confirmed."
                ),
            },
        )
    return question_set_id, question_id


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--provider-env", type=Path, default=ROOT / ".env")
    args = parser.parse_args()
    env = local_environment(args.provider_env)
    compose = ["docker", "compose", "-f", "infra/compose.yaml"]

    def run(*command: str, input_text: str | None = None) -> None:
        subprocess.run(  # noqa: S603 - fixed local commands
            command, cwd=ROOT, env=env, input=input_text, text=True, check=True
        )

    run(*compose, "up", "-d", "--wait", "postgres")
    run(
        *compose,
        "exec",
        "-T",
        "postgres",
        "psql",
        "-X",
        "-U",
        "strongstart",
        "-d",
        "postgres",
        "-v",
        "ON_ERROR_STOP=1",
        "-v",
        f"database_name={DATABASE}",
        input_text=(
            "SELECT format('CREATE DATABASE %I', :'database_name') "
            "WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = :'database_name')\\gexec\n"
        ),
    )
    run(".venv/bin/alembic", "upgrade", "head")
    run(".venv/bin/strongstart-seed-demo")
    run("bash", "scripts/demo/start_live.sh", "--api-only")
    api = Api(f"http://127.0.0.1:{env.get('DEMO_API_PORT', '18220')}")
    try:
        question_set_id, question_id = prepare_draft(api)
        env["VITE_PRESENTATION_QUESTION_SET_ID"] = question_set_id
        env["VITE_PRESENTATION_QUESTION_ID"] = question_id
        run("bash", "scripts/demo/start_live.sh", "--web-only")
    except (Exception, SystemExit):
        run("bash", "scripts/demo/stop_live.sh", "web", "api")
        raise
    finally:
        api.c.close()


if __name__ == "__main__":
    main()
