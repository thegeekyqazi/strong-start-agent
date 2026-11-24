# UI-002: Run the local presentation

- Lane: Dev C shared frontend and presentation integration
- Consumer: project owner and presenter
- Task: [UI-002 revision 1.0](../../specs/UI-002-live-presentation.md)
- Branch: `dev-c/ui-002-live-presentation` from `c21f47f`. The PR records the implementation refs.
- Engineering v1.1 sections 4, 6, 8, 15, 16 and 18. Boundaries APP-03, APP-04, POL-05, SEC-01, SEC-07, SEC-14 and AUTO2-16.

## Start

Run from the repository root with its installed dependencies and local Docker service. The private environment file must provide the Gemini key and model, Tavily key, and Firecrawl key.

```sh
.venv/bin/python -m scripts.demo.start_presentation --provider-env /path/to/live-providers.env
```

The launcher defaults to the root `.env` when no file is specified. It creates or reuses `strongstart_live_presentation`, applies the repository migrations there, and creates the representative question set and prepared answer through the API. Later launches retain saved answers and approvals. It starts the same-origin web app at [127.0.0.1:15290](http://127.0.0.1:15290/). To restart an existing run, stop its web and API processes with `bash scripts/demo/stop_live.sh web api`, then run the start command again.

## Present

1. Open **Find Funding**. Search a public topic with Tavily, then capture an appropriate page with Firecrawl. The captured page is public and awaits source and eligibility review. The earlier capture is also available in the saved captures library.
2. From **Overview**, click **Open application**. The regular Applications screen opens the prepared project-summary draft. Click the linked figure to see the reporting period, scope and verification status. **Edit draft** exposes the editor and **Request a draft** runs Gemini. The prepared answer describes historical reach from the labeled synthetic evidence and leaves proposed reach open.
3. Click **Open in Review** to review the exact saved answer. After reading and acknowledging the findings, approve it if appropriate. Select **Current question only** under **Answers to export** to download that approved answer without completing unrelated questions. The export includes the synthetic provenance and local reviewer labels.
4. Use **Use approved answer in Automation**, prepare the selected-field plan, inspect its intended values, then run **Fill these approved fields** on the representative portal. The receipt shows the values matched on read-back. Signing and submission remain staff actions.

**Knowledge** can import and retrieve sources independently. **Skills** can generate and screen a scoped writing practice with Gemini. The practice preview uses its own review and activation gates.

## Local verification and boundaries

- Tavily returned five live candidates. Firecrawl stored a complete capture from a public source. Gemini returned a live draft with a linked fact and also generated a practice candidate with a complete screening signal. The fixture identity was labeled throughout.
- Chromium drove the prepared draft, evidence focus, Review, scoped working DOCX and a new Gemini suggestion against the live local stack. It also checked desktop and phone layouts. The separately isolated fixture rehearsal verified reviewed DOCX bytes and representative prefill, with `selected_fields_verified` and `all_match`.
- Local checks passed 105 Vitest tests, 344 focused Python tests, and 10 Chromium regressions including a durable database restart. The web build, formatting, lint and focused mypy checks passed.
- The local database supports durable drafts, reviews, exports, knowledge and skills. Funding captures and saved definitions use their existing local file stores. Drafting still reads the labeled evidence bundle. The local fixture identity and representative portal do not confer staff sign-in or authority on a funder website.
