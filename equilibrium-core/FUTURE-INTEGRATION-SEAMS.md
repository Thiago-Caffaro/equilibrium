# Future Core integration seams

These seams deliberately do not implement division selection, mastery,
insignias, shards, roster calculations, or a final UI. They keep the current
experimental Merchant contract working without KubeJS while making a later
implementation explicit about the conceptual decision it needs.

## Decision gate

Before implementing an adapter, data field, persistent payload, packet, or
KubeJS authoring API for a seam below, the proposal must name its relevant
baseline section, the active `AB-*` decision IDs, and the decision-record entry
that closes them. If an `AB-*` item remains open, add only an inert contract or
documentation; do not select behavior in Java.

| Seam | Neutral contract | Conceptual gate | Explicitly deferred |
| --- | --- | --- | --- |
| Division identity | `DivisionIdentity` | Baseline 02; AB-020, AB-021 to AB-023, AB-027, AB-028 | Final names, selection, respecialization, roster effects |
| Authority and mastery | `AuthorityRequirement`, `AuthorityLookup` | Baseline 03; AB-030, AB-031, AB-034, AB-040 to AB-048 | Tier count, formulas, lending, insignia and shard behavior |
| Offer prerequisites | `OfferPrerequisite`, `OfferPrerequisiteEvaluator` | Baseline 03/05; AB-031, AB-034, AB-048, AB-062, AB-063, AB-113, AB-114 | Gate categories, cross-division costs and shard consumption |
| Persistent player state | `VersionedState`, `PlayerStateStore` | Baseline 03; AB-021 to AB-023, AB-047, AB-080 to AB-082 | Stored fields, recovery, admin policy and roster timing |
| Client synchronization | `ClientViewSnapshot`, `ClientViewSynchronizer` | Baseline 09; AB-005, AB-120 to AB-126, AB-153 | HUD layout, colors, terminology, visibility and tooltips |

## Schema and migration policy

- Merchant offer data is currently schema version 1. A future version must be
  parsed by an explicit versioned parser; an unknown newer version is rejected
  with a reload error rather than silently interpreted as version 1.
- A new field that changes transaction meaning requires a new schema version or
  a documented backwards-compatible default. It must not be silently ignored.
- Persistent player/world state is not introduced by a datapack reload. It gets
  its own positive `VersionedState.schemaVersion`, an idempotent migration, a
  backup/rollback plan, and automated migration fixtures before release.
- A failed migration must leave the previous persisted data intact and prevent
  use of a partially migrated state. No migration may invent a division,
  mastery tier, ownership, or balance value from an open decision.

## KubeJS boundary

KubeJS may later author pack balance data only after the data loader and
server-side transaction invariants are stable. It will adapt to the validated
offer/prerequisite schema; it will not become a second authority, persistence,
or client-sync engine. The current Core remains functional when KubeJS is
absent.
