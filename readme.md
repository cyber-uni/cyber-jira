# cyber-jira

Agent skills for Jira. They drive the [`jira` CLI](https://github.com/ankitpokhrel/jira-cli) by
ankitpokhrel, so the plugin ships no CLI, API client, or MCP server of its own.

| Skill | What it does |
| --- | --- |
| `jira` | The entry point. Routes the request, resolves the project and people from the repo config, and runs `jira` commands without opening the CLI's interactive UI |
| `init-jira` | Installs the `jira` CLI or finds it, walks you through creating and setting `JIRA_API_TOKEN`, runs `jira init`, and verifies the connection |
| `config-jira` | Keeps `.agents/cyber-jira.json` up to date: the repo's projects, the default project, user aliases, and issue defaults |

## Install

**Claude Code**

```text
/plugin marketplace add cyber-uni/marketplace
/plugin install cyber-jira@cyber-uni
```

**Codex**

```text
codex plugin marketplace add cyber-uni/marketplace
codex plugin add cyber-jira@cyber-uni
```

**GitHub Copilot CLI**

```text
copilot plugin marketplace add cyber-uni/marketplace
copilot plugin install cyber-jira@cyber-uni
```

Start a new session, then run `/cyber-jira:init-jira`.

## Where settings live

| Setting | Where |
| --- | --- |
| API token | `JIRA_API_TOKEN` in your shell profile, plus `JIRA_AUTH_TYPE=bearer` for a Data Center personal access token |
| Site, login, personal default project and board | The `jira` CLI's config, `~/.config/.jira/.config.yml`, written by `jira init`. Select another with `JIRA_CONFIG_FILE` |
| The repo's projects, user aliases, issue defaults | `.agents/cyber-jira.json`, committed |

The repo config never holds a token, a login, or an email. A project it names wins over the CLI's
personal default.

```json
{
	"schema_version": 1,
	"site": "acme.atlassian.net",
	"projects": [
		{
			"key": "API",
			"name": "Platform API",
			"aliases": ["api"],
			"purpose": "Server and public API work for this repo",
			"default": true
		}
	],
	"users": [{ "name": "Alice Chen", "aliases": ["ali"] }],
	"defaults": { "assignee": "me", "issue_type": "Task", "labels": ["agent-created"] }
}
```

## Development

The repo root is the plugin root. Edit `plugin.json` and `skills/`, then derive the per-vendor
manifests:

```bash
pnpm plugin:build
```

## License

MIT
