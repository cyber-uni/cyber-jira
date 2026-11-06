---
name: config-jira
description: Use this skill when adding, removing, or showing the Jira projects, users, aliases, or defaults in the repo config.
argument-hint: '[add|remove|show|sync] [project|user|default] [keyword...]'
---

# Config Jira

Keep `.agents/cyber-jira.json` in step with what the repo works against. It is the committed,
per-repo registry the `jira` skill reads: which project is the default, what short names point
to which project or person, and the issue defaults. The `jira` CLI has no command for this file,
so this skill reads and writes it directly, and uses the CLI only to look things up.

## When to use

- **Add** a project or a person, by search, by key, or by name.
- **Set** a default: the default project, assignee, issue type, labels, or components.
- **Remove** a project, a user, or one alias.
- **Refresh** names that changed in Jira (`sync`).
- **Show** what is registered, or what an alias resolves to.

Needs a working `jira` CLI: `jira serverinfo` succeeds. When it fails, run the **init-jira**
skill first.

## The file

`.agents/cyber-jira.json` at the repo root. Create it on the first add.

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
  "users": [
    {
      "name": "Alice Chen",
      "aliases": ["ali"]
    }
  ],
  "defaults": {
    "assignee": "me",
    "issue_type": "Task",
    "labels": ["agent-created"],
    "components": []
  }
}
```

| Field | Meaning |
| --- | --- |
| `site` | Optional. The Jira host this repo's keys belong to. A check only: the `jira` skill compares it with the CLI's server and stops on a mismatch. Credentials and the login are never stored here |
| `projects[].key` | The project key, the issue-key prefix (`API` in `API-123`). The identity of the entry |
| `projects[].name` | The project's display name, cached from Jira |
| `projects[].aliases` | Short names that resolve to this project, matched case-insensitively |
| `projects[].purpose` | One line saying what work belongs in this project; the `jira` skill uses it to pick a project |
| `projects[].default` | `true` on at most one project: the one used when a request names none |
| `users[].name` | The person's display name exactly as Jira shows it. The identity of the entry, and the value passed to `-a` |
| `users[].aliases` | Short names that resolve to this person |
| `defaults.assignee` | A user alias, a display name, or `me` |
| `defaults.issue_type` | The issue type used when a request names none, as the project spells it |
| `defaults.labels`, `defaults.components` | Added to every issue the `jira` skill creates |

Every field except `schema_version` is optional. Keep the keys in the order shown, match the
repo's JSON indentation, and write the file in one edit after the user confirms.

Do not store emails, tokens, the login, or the auth type. Credentials belong to the CLI's own
config and the user's environment (see **init-jira**). The `jira` CLI's `-a` flag takes a
username, email, or display name, so the display name is enough for every command that takes a
person.

## Instructions

Work out which of the sections below the user wants. Confirm every change before writing it:
show the entry as it will be written.

### A. Add a project

1. **Find it.** If the user gave a key, use it. Otherwise list projects and match the user's
   words or the repo name against the key and name:

   ```bash
   jira project list
   ```

   Too many rows: filter the output by the keyword. Present the candidates; do not pick one
   silently.
2. **Read its name** from the `project list` row for that key.
3. **Ask** for aliases, a one-line purpose, and whether it is the default. If another project is
   already the default, say so; making this one the default clears the other.
4. **Write** the entry. When `site` is unset, offer to set it to the host of the `server` line in
   the CLI's config file (see **init-jira** for where it is).
5. **Tell the user** to commit `.agents/cyber-jira.json`.

### B. Add a user

1. **Find the display name.** The `jira` CLI has no user search, so find the person through
   issues they appear on. Take the name, email, or partial name the user gave and list a few
   issues assigned to that person:

   ```bash
   jira issue list -a"<name or email>" --plain --columns key,assignee --paginate 0:5
   ```

   Read the display name from the `ASSIGNEE` column. For the user themselves, pass
   `-a"$(jira me)"`. No rows: try `-r"<name or email>"` (reporter) instead, then ask the user for
   the name exactly as Jira shows it.
2. **Ask** for aliases.
3. **Write** the entry. Adding an alias to a user who is already registered appends to
   `aliases`; it does not create a second entry.

### C. Set a default

Write the key under `defaults`. Check the value first:

- `assignee`: an alias in `users`, a display name, or `me`.
- `issue_type`: one the default project offers. Read the types from the create screen or an
  existing issue (`jira issue list -p <KEY> --plain --no-headers --columns type --paginate 0:50`),
  and use the project's spelling.
- The default project is set on the project entry (`default: true`), not under `defaults`.

### D. Remove

Remove a project by key, name, or alias; a user by name or alias; or one alias. Name
what will be removed and confirm. Removing the default project leaves no default; say so.

### E. Refresh names (`sync`)

For each project, re-read its name from `jira project list`. Report every name that changed and every entry Jira no
longer knows, and write the changes after the user confirms. Leave user names as they are unless
the user gives the new name; the CLI has no user lookup.

### F. Show and resolve

Print the file as a short table: projects (key, name, aliases, default), users (name,
aliases), defaults. To answer "what does `ali` resolve to", match the alias against project
aliases, then user aliases, case-insensitively, and say which entry it hit. An alias that hits
both a project and a user is a conflict; tell the user to rename one.

## Personal settings

The repo config is shared. A personal default project and the board that `jira sprint list`
reads already live in the CLI's own config, written by `jira init`; the repo config wins when
both name a project. The repo config holds no board, because the CLI takes none on the command
line. To keep a
setting out of the repo, leave it to the CLI config rather than adding a second file.
