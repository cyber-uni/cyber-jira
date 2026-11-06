---
title: config-jira
description: Keep the repo's Jira projects, user aliases, and issue defaults in .agents/cyber-jira.json.
---

`config-jira` reads and writes the committed [repo config](/cyber-jira/reference/repo-config/).
The `jira` CLI has no command for that file, so the skill edits it directly and uses the CLI only
to look things up.

It needs a working CLI. If `jira serverinfo` fails, run
[init-jira](/cyber-jira/skills/init-jira/) first.

## Usage

```text
/cyber-jira:config-jira [add|remove|show|sync] [project|user|default] [keyword...]
```

| Action | What it does |
| --- | --- |
| Add a project | Finds it by key or search, reads its name from Jira, and asks for aliases, a one-line purpose, and whether it is the default |
| Add a user | Finds the display name through issues the person appears on, then asks for aliases |
| Set a default | Writes the assignee, issue type, labels, or components used when a request does not say |
| Remove | Removes a project, a user, or one alias, after you confirm |
| `sync` | Re-reads project names from Jira and reports names that changed or entries Jira no longer knows |
| Show | Prints the file as tables, or says what an alias resolves to |

Every change is shown as it will be written and confirmed first. Afterwards, commit
`.agents/cyber-jira.json`.

The file never holds a token, login, or email.

[Skill source](https://github.com/cyber-uni/cyber-jira/blob/main/packages/cyber-jira/skills/config-jira/SKILL.md) on GitHub.
