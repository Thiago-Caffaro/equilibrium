# Official source index — Pack balance laboratory

This index covers integrations explicitly named in the current Core handoff. Add a row before making another mod an active integration; do not infer compatibility from a generic mod-list entry.

| Integration | Primary reference | Use it for |
| --- | --- | --- |
| KubeJS overview and reload boundaries | [KubeJS official site](https://kubejs.com/) | Folder generation, `/reload`, and `startup_scripts` versus `server_scripts` reload behavior. |
| KubeJS event placement | [KubeJS events](https://kubejs.com/wiki/events) | Selecting startup, server, and client event scopes. |
| KubeJS recipes | [Editing recipes](https://kubejs.com/wiki/tutorials/recipes) | Recipe removal/addition/modification in server scripts. |
| KubeJS API surface | [KubeJS wiki index](https://kubejs.com/wiki/index) | Current event, tag, component, and folder documentation. |
| Create | [Create developer documentation](https://wiki.createmod.net/developers/) | NeoForge 1.21.1 dependency, integration and tag references. |
| Create through KubeJS | [KubeJS Create addon guide](https://kubejs.com/wiki/addons/create) | Recipe integration when the installed addon/version supports it. |
| Farmer's Delight | [FarmersDelight source repository](https://github.com/vectorwing/FarmersDelight) | Canonical data and version branch before changing its recipes/tags/configuration. |
| Some Assembly Required | [Some Assembly Required source repository](https://github.com/ochotonida/some-assembly-required) | Its version-specific datapack format and Create/Farmer's Delight interaction. |
| Cross-mod tag semantics | [NeoForge tags — 1.21.1](https://docs.neoforged.net/docs/1.21.1/resources/server/tags/) | `c:` conventions, optional entries, and additive tag data. |

## Local configuration source of truth

For an individual mod configuration, inspect the generated config schema/comments from the exact installed JAR first, then its release notes or official repository. Configuration keys are version-specific; never transfer a key from another Minecraft line without a test reload.
