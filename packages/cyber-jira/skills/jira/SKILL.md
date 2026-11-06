---
name: jira
description: Use this skill when doing Jira work — find, create, update, move, assign, or comment on issues, sprints, and epics, or set up.
---

# Jira

The entry point for Jira work in the cyber-jira plugin. It drives the
[`jira` CLI](https://github.com/ankitpokhrel/jira-cli): classify the request, settle the project
and people from the repo config, then run the command.

## Route the request

Pick the first row that matches.

| The user wants to… | Go to |
| --- | --- |
| install the CLI, set the token, connect to a site, or fix `command not found`, 401, or 403 | `init-jira` skill |
| register, remove, or show projects, users, aliases, or defaults for this repo | `config-jira` skill |
| anything done to issues, epics, or sprints: find, view, create, edit, move, assign, comment, link | **Run a command** below |

## Before the first command

Do these once per session, in order.

1. **The CLI.** `command -v jira`. Missing: run the `init-jira` skill and stop until it passes.
   Do not check the connection up front; a failing command is the signal. On a 401, 403, or a
   missing-config error, run `init-jira`.
2. **The repo config.** Read `.agents/cyber-jira.json` at the repo root if it exists. Its fields
   are described in the `config-jira` skill. No file: use the CLI config's defaults, and offer
   `config-jira` once if the user names projects or people by short names.
3. **The site.** When the repo config sets `site`, compare it with the `server` line of the CLI
   config (`${JIRA_CONFIG_FILE:-${XDG_CONFIG_HOME:-$HOME/.config}/.jira/.config.yml}`). They
   differ: stop and tell the user this repo's issues live on another site; `init-jira` covers
   selecting a config per site.

## Resolve names

- **Project.** Use the first that applies: the prefix of an issue key in the request (`API` in
  `API-123`, or in a URL `https://<site>/browse/API-123`); a project the user names, by key,
  name, or alias; the project whose `purpose` fits the work, when the user describes work rather
  than naming a project; the repo config's default project; the CLI config's `project`. Pass it
  as `-p <KEY>` on every command that takes a project, even when it equals the CLI default, so
  a change of personal default cannot redirect the repo's work. When two projects fit equally,
  ask.
- **People.** An alias or `me` becomes what `-a` (assignee) and `-r` (reporter) take: a user
  alias resolves to that user's `name`; `me` is `"$(jira me)"`. Anything else passes through as
  the user wrote it; the CLI matches a username, email, or display name.
- **Sprints.** `jira sprint list` reads the board from the CLI config and takes no board flag.
  For the active sprint's issues in a resolved project, use
  `jira issue list -p <KEY> -q 'sprint in openSprints()' --plain`.
- **Create defaults.** On create, the repo config's `defaults.issue_type`, `defaults.labels`,
  `defaults.components`, and `defaults.assignee` fill whatever the user did not say. The user's
  words win.

## Run a command

Read [`references/commands.md`](references/commands.md) for the command shapes. Rules that hold
for every command:

- **Never open the interactive UI.** `jira issue list`, `jira epic list`, and `jira sprint list`
  open a full-screen table in a terminal. Always pass `--plain` to read a list; on `issue list`
  and `issue view`, `--raw` gives JSON to parse. Pass `--no-input` to `issue create`,
  `epic create`, and `issue edit`.
- **Bodies come from a file.** Write a description or comment to a file in a temporary directory,
  never an inline shell string. Pass it with `--template <file>` (`-T`) to `issue create`,
  `epic create`, and `issue comment add`; pipe it to `issue edit` on stdin
  (`jira issue edit <ISSUE> --no-input < <file>`). Write bodies in Markdown; the CLI converts it
  for Jira.
- **Filter on the server.** Use the list flags or `-q '<JQL>'` rather than listing everything
  and filtering locally. Page with `--paginate <from>:<limit>` (at most 100).
- **Confirm before** deleting an issue, changing more than one issue in one request, or a
  transition, assignment, or edit the user did not ask for. Show what will change.
- **Report the result** with the issue key and its URL (`jira open <ISSUE> --no-browser` prints it).
- **After a failed create**, search for the summary (`jira issue list -p <KEY> -q 'summary ~
  "<words>"' --plain`) before retrying, so a created issue is not filed twice.

When a request needs a command the reference does not list, read `jira <command> --help` first;
do not guess flags.
