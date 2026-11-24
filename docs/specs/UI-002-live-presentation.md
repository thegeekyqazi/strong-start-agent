# UI-002: Local presentation with live providers

- Revision: 1.0
- Lane: Dev C presentation, using the existing Dev A and Dev B service contracts
- Base: `origin/main` at `c21f47f`
- Owner direction: run the core workflows locally with live providers and a clean interface for the showing

The presenter opens a saved representative application through the regular Applications and Review screens. The saved draft reads as a document. Editing controls and technical source details are available on demand. Visible copy identifies synthetic evidence and the local preview session. The review page describes the actual approval state and offers transfer only for a current approved version with a saved question set.

Use the existing live Tavily, Firecrawl and Gemini adapters, isolated local PostgreSQL, and the configured knowledge storage. Stage a durable draft through the existing API while leaving approval to the presenter. Preserve organization scoping, exact-version approval, evidence provenance and representative-only prefill.

Acceptance covers provider calls using public or synthetic inputs, a real saved application and review handoff, working and reviewed exports, representative prefill read-back, and the knowledge and Skills routes under the local runtime. Production identity and arbitrary funder portal execution retain their current availability.

Engineering v1.1 sections 4, 6, 8, 15, 16 and 18. Boundaries APP-03, APP-04, POL-05, SEC-01, SEC-07, SEC-14 and AUTO2-16.
