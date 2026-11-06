---
title: Getting Started
description: Install the cyber-jira plugin and connect it to your Jira site.
---

## Install the plugin

Pick your agent.

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

## Connect to Jira

Start a new session and run:

```text
/cyber-jira:init-jira
```

The skill checks what is already set up, then covers whatever is missing:

1. The `jira` CLI, with your approval before it installs anything.
2. An API token, which you add to your shell profile yourself so it never enters the chat.
3. `jira init`, which writes the CLI config for your site.
4. A check that the server, the project list, and the issue list all respond.

See [init-jira](/cyber-jira/skills/init-jira/) for the details.

## Use it

Ask for Jira work in plain words, for example "list my open issues in API" or "move API-123 to
Done". The [jira skill](/cyber-jira/skills/jira/) picks the project, runs the CLI, and reports the
issue key and URL.

If the repo works against fixed projects or people, run
[config-jira](/cyber-jira/skills/config-jira/) once to record them.
