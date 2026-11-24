# UI-001: Presentation workspace for the sample grant

- Author/developer: Codex, Dev C shared frontend lane
- Date: 2026-11-24
- Status: accepted-maintainer for direction and ownership
- Decided by: project owner, who confirmed ownership of the redesign and requested a presentation for interested viewers before the staff pilot
- Engineering baseline: [v1.1](../engineering/StrongStart_Engineering_Plan.md), sections 8, 15, 18 and 21
- Feature spec: [UI-001 revision 1.0](../specs/UI-001-presentation-workspace.md)
- Branch: `dev-c/ui-001-presentation-workspace`

## Original requirement

`AGENTS.md` and decision 0005 assign presentation to Sawaab in the integration work. The existing `design.md` describes a locked layout system with a product landing page and a workflow console above the feature pages.

## Decision and rationale

The project owner leads and reviews UI-001. The homepage introduces one clearly labeled sample grant and leads into the real draft and review screens. A compact persistent navigation rail replaces the repeated workflow console. The Dribbble reference informs layout and visual hierarchy. The work uses Strong Start's own name, content and visual assets. The staff pilot and its cross-session resume requirement remain follow-on work.

## Impact and coordination

The presentation changes the shared shell and Dev C application and review surfaces. Keep the current module routes, server authorization, exact approval hashes and versioned claim bindings. Sample navigation selects the existing fixture workspace explicitly. Evidence locators remain text, with in-page navigation from a claim to its displayed evidence. Checks implicated by the presentation are APP-03, APP-04, POL-05, SEC-07 and SEC-14.

## Validation and rollback

Rehearse the fixture flow from a fresh browser using the existing API. Verify the sample label, exact saved version in Review and claim-to-evidence link. The frontend change can be reverted as one PR and requires no data migration.
