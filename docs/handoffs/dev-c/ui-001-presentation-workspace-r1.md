# UI-001: Present the sample grant from draft to review

- Lane: Dev C shared frontend
- Intended consumer: project owner and presentation operator
- Status: ready for review
- Task spec: [UI-001 revision 1.0](../../specs/UI-001-presentation-workspace.md)
- Baseline: engineering v1.1 sections 8, 15, 18 and 21. Boundary checks APP-03, APP-04, POL-05, SEC-07 and SEC-14.
- Branch: `dev-c/ui-001-presentation-workspace` from `a5eb7af`. The PR identifies the exact implementation commit.

## Presentation setup

Start the existing [fixture rehearsal stack](../../demo/e2e-demo-guide.md#0-prepare-about-1-minute) with `scripts/demo/start_stack.sh` after its local database prerequisites are satisfied. Open `http://127.0.0.1:15190/` or the web port printed by the script. The local fixture uses synthetic questions and evidence, a deterministic drafting adapter, and a labeled fixture identity.

1. Click **Open sample application**. To prepare a saved draft before the showing, select the initial mission question, click **Request a draft**, then **Save version**. Return to **Overview**.
2. For viewers, open the sample again. Click the linked figure in **Saved draft** to focus its evidence card. Point out the reporting period, original source reference and staff verification status.
3. Click **Open in Review**. Show the exact saved text and explain the review checks. The figures, checks and approval state come from the existing API.

## Contract and dependencies

`#/sample` and `#/sample/review` explicitly select the existing default fixture workspace. The optional `question` hash parameter matches only a question from the returned workspace. It carries an ID and uses the existing organization-scoped API. When the API reports that fixture mode is off, Overview links to the ordinary Applications route. No schema or migration changes are required.

Claim links focus a local evidence card for the matching pack version. All locators remain inert text and responses remain same-origin. The existing exact-version save and review controls own all state changes.

## Verification

The web build, lint and formatting checks passed. Vitest passed 104 tests. Nine Chromium tests covered the sample walkthrough, Funding, B bundle and C review integration. The sample test uses the real API with its isolated fixture store. It confirms that the evidence link focuses the source card and that a fresh browser can open the correct saved services answer in Review. The local visual pass covered Overview, Draft and Review on desktop and mobile.

## Decisions and follow-up

The project owner leads UI-001 under the [presentation decision](../../decisions/UI-001-presentation-workspace.md). The PR covers the presentation overview, shared navigation, Applications and Review. Staff pilot features such as cross-session application selection have a separate scope. Review the sample flow before merging.
