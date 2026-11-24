# UI-001: Presentation workspace

- Revision: 1.0
- Lane: Dev C shared frontend, with the project owner leading the redesign
- Base: `origin/main` at `a5eb7af`
- Decision: [UI-001](../decisions/UI-001-presentation-workspace.md)

Interested viewers should be able to open one sample application and see what makes a draft reviewable. The walkthrough starts at the home screen, opens the GOS-style sample, shows a draft and the source behind a linked claim, then opens the saved answer in Review.

- Use a compact navigation rail, a light reading surface and one prominent sample entry point. Keep the existing Funding, Intake & Prefill, Knowledge, Applications, Review and Skills routes available.
- Select the existing synthetic application and evidence explicitly for the walkthrough. Show clear loading and error states and use the existing draft and save actions.
- Present the funder's question, edited answer, checks and evidence in a readable order. Keep sample, source and staff-review labels visible. Only the existing server review flow can approve an exact saved answer.
- Rehearse with Chromium using the real fixture API and check desktop and narrow layouts. Keep all application resources same-origin.

References: engineering v1.1 sections 8, 15, 18 and 21. Existing contracts: C1 r1.1, C2 r1.3 and C3 exact-version review. Boundary checks: APP-03, APP-04, POL-05, SEC-07, SEC-14.
