---
title: Repo config
description: The fields of .agents/cyber-jira.json.
---

`.agents/cyber-jira.json` sits at the repo root and is committed. The
[jira skill](/cyber-jira/skills/jira/) reads it to resolve projects and people, and
[config-jira](/cyber-jira/skills/config-jira/) maintains it.

## Example

```json
{
	"schema_version": 1,
	"site": "acme.atlassian.net",
	"projects": [
		{
			"key": "API",
			"name": "Platform API",
			"aliases": ["api", "backend"],
			"purpose": "Server and public API work for this repo",
			"default": true
		}
	],
	"users": [{ "name": "Alice Chen", "aliases": ["ali"] }],
	"defaults": {
		"assignee": "me",
		"issue_type": "Task",
		"labels": ["agent-created"],
		"components": []
	}
}
```

## Fields

Every field except `schema_version` is optional.

| Field | Meaning |
| --- | --- |
| `site` | The Jira host this repo's keys belong to. A check only: the skill stops when it differs from the CLI's server |
| `projects[].key` | The project key, the prefix of issue keys (`API` in `API-123`) |
| `projects[].name` | The display name, cached from Jira |
| `projects[].aliases` | Short names for the project, matched case-insensitively |
| `projects[].purpose` | One line on what work belongs here, used to pick a project |
| `projects[].default` | `true` on at most one project, used when a request names none |
| `users[].name` | The display name exactly as Jira shows it, passed to the CLI's assignee flag |
| `users[].aliases` | Short names for the person |
| `defaults.assignee` | A user alias, a display name, or `me` |
| `defaults.issue_type` | The type used on create when none is given, as the project spells it |
| `defaults.labels`, `defaults.components` | Added to every issue the skill creates |

An alias that matches both a project and a user is a conflict. Rename one of them.
