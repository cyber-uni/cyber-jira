---
title: Where settings live
description: What goes in the shell profile, the jira CLI config, and the repo config.
---

| Setting | Where |
| --- | --- |
| API token | `JIRA_API_TOKEN` in your shell profile. Add `JIRA_AUTH_TYPE=bearer` for a Data Center personal access token |
| Site, login, personal default project and board | The `jira` CLI config, `~/.config/.jira/.config.yml`, written by `jira init`. Select another file with `JIRA_CONFIG_FILE` |
| The repo's projects, user aliases, issue defaults | [`.agents/cyber-jira.json`](/cyber-jira/reference/repo-config/), committed |

The repo config never holds a token, a login, or an email. A project it names wins over the CLI's
personal default.
