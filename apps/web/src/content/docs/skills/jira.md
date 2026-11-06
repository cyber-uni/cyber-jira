---
title: jira
description: The entry point for Jira work. Routes a request and runs jira CLI commands.
---

The `jira` skill handles any request about issues, epics, and sprints. It runs the
[`jira` CLI](https://github.com/ankitpokhrel/jira-cli) for you.

## What it does

- Finds, views, creates, edits, moves, assigns, links, and comments on issues.
- Lists epics and sprints, and creates epics.
- Sends setup problems (`command not found`, 401, 403) to [init-jira](/cyber-jira/skills/init-jira/).
- Sends changes to the repo's projects and people to [config-jira](/cyber-jira/skills/config-jira/).

## How it picks the project

The first of these that applies wins:

1. The key prefix in the request, such as `API` in `API-123` or in an issue URL.
2. A project you name, by key, name, or alias.
3. The project whose `purpose` fits the work you describe.
4. The default project in the [repo config](/cyber-jira/reference/repo-config/).
5. The CLI's own default project.

It passes the project to every command, so a change to your personal default cannot redirect the
repo's work. When two projects fit equally, it asks.

## Rules it follows

- It never opens the CLI's interactive UI. Lists use `--plain`, and creates use `--no-input`.
- Descriptions and comments come from a file, not an inline shell string.
- It filters on the server with list flags or JQL.
- It asks before deleting an issue, changing several issues at once, or making a change you did
  not request.
- It reports the issue key and its URL when it finishes.

If the repo config names a `site` that differs from the CLI's server, it stops and tells you.

[Skill source](https://github.com/cyber-uni/cyber-jira/blob/main/packages/cyber-jira/skills/jira/SKILL.md) and
[command reference](https://github.com/cyber-uni/cyber-jira/blob/main/packages/cyber-jira/skills/jira/references/commands.md) on GitHub.
