# CC Phase 4 Matrix — Document B: Deferred Items (DEFER — To Do Later)

**Scope covered:** Categories 50–64

---

### Category 53 — Synchronization, Conflicts & Multiple Interfaces

- P4-R682 — Explicit synchronization-conflict UI.
- P4-R683 — Detailed competing-version conflict records.
- P4-R685 — Independent low-risk changes may eventually support automatic merging where safely determinable — future capability.

(Synchronization itself is explicitly not a Phase 4 implementation concern; the architectural boundary that permits it later is retained in Document A.)

### Category 54 — Backup, Recovery & Disaster Recovery

- Backup frequency.
- Retention policy.
- Backup locations.
- Encryption strategy.
- Automated backup mechanism.
- Disaster-recovery testing.
- Exact restore procedure.

(None of these are yet architectural decisions — the requirement that CC be recoverable is established; the mechanics are deferred.)

### Category 55 — Security, Privacy & Trust Boundaries

- P4-R705 — User-facing permission inspection UI — future capability.

### Category 56 — External Integrations & Connectors

- P4-R715 — Connector status should eventually be visible to the user — future capability.

### Category 57 — Platform Independence & the Eventual Standalone Command Center

- Building the standalone CC application.
- Independent validation tooling for the portable data layer (implementation of P4-R723's underlying requirement).
- Actual export/import or direct-consumption migration mechanisms.

### Category 58 — Versioning & Evolution of the CC Core

- Actual Core versioning implementation.
- Migration tooling.
- Compatibility matrices between future Core versions and interfaces.

### Category 59 — Human Authority, AI Advice & Agent Action

- Detailed permission implementation.
- Detailed Agent capability configuration.
- Detailed approval workflows for external actions.

### Category 60 — Audit Trail & Provenance

- Full provenance implementation.
- Detailed epistemic-state UI.
- Sophisticated reconstruction views.

### Category 61 — Notifications, Signals & Attention

- P4-R764 — User-configurable Attention/Notification sensitivity may eventually be supported — future capability.
- Configurable notification sensitivity.
- Complex notification preference systems.
- Detailed escalation configuration.

### Category 62 — Project Re-entry & Context Recovery

- Automatic adjustment of re-entry depth based on elapsed time.
- AI-generated re-entry briefing implementation.
- Sophisticated handover-chain visualization.

### Category 63 — Project Dashboard vs. Project Workspace

- Detailed Workspace implementations for different Project types.
- Full "Edit Using" application-selection mechanism.
- Sophisticated scratch-space behavior.

### Category 64 — The Project List

- Automatic Project sorting.
- Advanced Project List filtering.
- Full implementation of alternate New Project entry paths.
