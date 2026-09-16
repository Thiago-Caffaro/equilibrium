---
name: equilibrium-github-planning
description: Plan Equilibrium work in its GitHub Project, issues, and milestones, especially when separating agent work from human-owned review or decisions. Use for Project status, issue authoring, or assigning work to Thiago Caffaro; do not use for ordinary code or pack-balance changes alone.
---

# Equilibrium GitHub planning

Use the GitHub Project **Equilibrium Core — Technical Delivery** as a concise delivery map, not as a transcript of every research step. Preserve the established milestones and map work to their existing scope. Do not create an issue for a small implementation step.

## Decide ownership before creating an issue

Keep an action with the agent when the available Baseline, matrix, source evidence, and previous decisions are enough to:

- reconcile an inconsistency;
- research versions, dependencies, risks, or overlap;
- produce a bounded recommendation;
- update a planning artifact after a decision is already explicit; or
- prepare a focused test with a falsifiable question.

Create a human-owned issue only when the outcome truly needs one of these inputs:

- preference about the intended player experience or project identity;
- first-hand gameplay, multiplayer, accessibility, or performance observation unavailable in the records;
- an explicit approval of a high-impact conceptual rule that the Baseline requires to close; or
- authority to choose between materially different product directions.

Do not turn a recommendation into a human task merely because it has a choice. When the documented context clearly favors a safe option, take that option or present it as the recommendation and reserve human input for a meaningful objection.

## Human-issue standard

One human issue should produce one coherent outcome. Before opening or assigning it:

1. State the exact unresolved point and why the record cannot resolve it.
2. Summarize the decisive known facts and link the relevant Baseline IDs or planning artifacts.
3. Give a recommended default and concrete consequences of ratifying or changing it.
4. Request the smallest possible human input: a verdict, a first-hand observation, or a bounded priority choice.
5. Make the completion criteria observable. Explicitly say what is out of scope.

For first-hand evidence, ask for the scenario, profile/mod version if known, observed player/group behavior, and any performance or accessibility concern. “No direct experience” is a valid result; do not ask the owner to invent metadata that can be established from a JAR or official source.

## Project operations

- Use the GitHub CLI and verify the resulting issue assignment, milestone, Project membership, status, area, and priority.
- Assign human-owned Equilibrium work to `Thiago-Caffaro` only when the user authorizes the assignment.
- Keep agent-owned Gate A work on its existing broad Project card unless it has genuinely become a separate, substantial outcome.
- Reflect a completed human decision in the Baseline, matrix, and Project status only after it is explicit. Never infer approval from inactivity.
- Keep project text compact but self-contained enough that its owner does not need to reconstruct the decision from chat history.
