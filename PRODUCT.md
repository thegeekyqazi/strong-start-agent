# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Strong Start staff who prepare and review grant applications. They need to identify opportunities worth pursuing, gather evidence from organizational records, write within funder requirements and decide which answers are ready to use.

## Product Purpose

Strong Start Agent gives staff one workspace to find funding, capture official requirements, gather evidence, draft answers, review changes and prepare approved content for transfer. A successful workflow leaves staff with an answer they can trace to its sources, a clear view of what still needs attention and control over the decision to use it.

## Positioning

The workspace carries evidence and review decisions from the source through the application. Facts retain their source version, locator, reporting period, units and scope. Approval binds the exact answer to the dependencies staff reviewed. The workspace checks whether that approval is current before using it for a gated action. [Engineering plan](docs/engineering/StrongStart_Engineering_Plan.md#15-workflow-states-concurrency-and-invalidation)

## Operating Context

Staff work from funder pages and forms, organizational reports, past applications and writing guidance. An application can span multiple questions and review rounds. Staff need the original wording and limits alongside each answer, along with any conflicts, missing evidence and unresolved eligibility conditions. [Staff interface requirements](docs/engineering/StrongStart_Engineering_Plan.md#18-staff-interface-and-understandable-explanations)

## Capabilities and Constraints

- Drafting proposes text. Deterministic checks and staff review govern whether an exact answer version is ready for use. Edits and relevant source, requirement or policy changes can stale prior approvals.
- Keep working and reviewed exports distinguishable. Assisted form entry uses approved values and compares them with the values read back. Staff retain control of final submission and signing. [Browser automation and exports](docs/engineering/StrongStart_Engineering_Plan.md#16-browser-automation-and-exports)
- Practice rules come from reviewed writing guidance and retain links to the supporting passages. Staff review and activate the exact version. The current practice integration is a working draft preview. [Practice preview guide](docs/handoffs/dev-c/c4-skl-001-demo-guide.md)

## Evidence on Hand

The repository records representative workflows with a fixture identity, synthetic application evidence and a representative portal. A walkthrough can use live search, capture and drafting providers while application evidence and identity remain simulated. Keep those labels visible in the workspace and its outputs. [Recorded walkthrough](docs/handoffs/integration/demo-live-launch-r1.md)

## Product Principles

1. Keep the original source and its qualifiers close to the claim they support.
2. Make missing evidence, conflicting requirements and stale decisions visible where staff act on them.
3. Give reviewers the affected text, supporting passage, finding and next action in plain language.
4. Keep approval, final submission and signing under staff control.
