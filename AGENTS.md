# AGENTS.md

## What this repo is

`cyber-jira` is an agent plugin for Jira, published to npm as `cyber-jira`. It ships skills only.
The skills drive the [`jira` CLI](https://github.com/ankitpokhrel/jira-cli) by ankitpokhrel; this
repo writes no CLI, API client, or MCP server of its own.

| Skill | Owns |
| --- | --- |
| `jira` | The entry point. Routes a request, applies the repo config, and runs `jira` commands |
| `init-jira` | Installs or finds the `jira` CLI, sets the API token, runs `jira init`, verifies |
| `config-jira` | The repo config `.agents/cyber-jira.json`: projects, users, aliases, defaults |

| Where | What |
| --- | --- |
| `packages/cyber-jira` | The plugin, and the npm package that ships it |
| `apps/web` | The Astro + Starlight docs site, deployed to GitHub Pages |

## Plugin layout

Everything the plugin needs lives in `packages/cyber-jira/` and must stay listed in that package's
`files`, or it will not reach consumers.

| Path | Authored? |
| --- | --- |
| `plugin.json` | yes, the canonical manifest ([Agent Plugins 1.0.0](https://github.com/agentplugins/agent-plugins-spec)) |
| `skills/<name>/SKILL.md` and files beside it | yes |
| `.claude-plugin/`, `.cursor-plugin/`, `.codex-plugin/` | derived by `pnpm plugin:build`, never hand-edited |

After editing `plugin.json` or `skills/`, run `pnpm plugin:build` and commit the derived files with
the change. `pnpm plugin:check` (part of `pnpm verify`) fails when a derived file drifted.

Versions flow from `packages/cyber-jira/package.json` on `pnpm version`: `changeset version`, then
`universal-plugin publish sync-version` carries the number into `plugin.json`, then
`pnpm plugin:build`. Never hand-edit a `version` field.

## Where settings live

- **Credentials and the Jira site** stay with the `jira` CLI: `JIRA_API_TOKEN` in the user's
  environment, and the server, login, and auth type in the CLI's own config file. Never write a
  token or a login into this repo or into a consumer's repo.
- **The repo config** (`.agents/cyber-jira.json` in the consumer's repo) is committed. It holds
  project keys, user names and aliases, and defaults, which teams already share in issue links.

## Commands

```bash
pnpm verify        # biome, plugin build check, manifest validation, typecheck, tests, knip
pnpm plugin:build  # derive the vendor manifests
pnpm cj test       # the plugin package's tests
pnpm web dev       # the docs site
```

## Commit discipline

- **Unit of work:** one coherent, independently revertable change. Commit it when it is complete
  and `pnpm verify` passes.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`); `commitlint` checks them.
- Stage files by name; never `git add .` or `git add -A`.
- A change to `packages/cyber-jira` that users see gets a changeset (`pnpm changeset`).

## Language

Write all content in en-US.
