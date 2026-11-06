# jira CLI commands

The command shapes the `jira` skill uses. `<KEY>` is a project key, `<ISSUE>` an issue key such as
`API-123`. Every command takes `-p <KEY>` to override the project and `-c <file>` to pick a config
file. For anything not listed here, read `jira <command> --help`.

## Find and read

```bash
jira issue list -p <KEY> --plain                       # newest first, as a table
jira issue list -p <KEY> --plain --columns key,summary,status,assignee --no-truncate
jira issue list -p <KEY> --raw                         # JSON
jira issue list -p <KEY> -a"$(jira me)" -s"In Progress" --plain
jira issue list -p <KEY> -q 'labels = backend AND created >= -7d' --plain
jira issue list -p <KEY> --plain --paginate 0:20
jira issue view <ISSUE> --plain                        # one issue, readable
jira issue view <ISSUE> --raw                          # one issue, JSON
jira issue view <ISSUE> --comments 5 --plain           # with its last 5 comments
```

List filters: `-a` assignee, `-r` reporter, `-s` status, `-t` type, `-y` priority, `-l` label,
`-C` component, `-P` parent, `-q` JQL. `-a x` lists unassigned issues. A leading `~` negates a
filter (`-s~Done`).

## Create

```bash
jira issue create -p <KEY> -t Task -s "<summary>" -T <body-file> --no-input
jira issue create -p <KEY> -t Bug -s "<summary>" -y High -l backend -l urgent \
  -C api -a "<name>" -T <body-file> --no-input
jira issue create -p <KEY> -t Sub-task -P <PARENT-ISSUE> -s "<summary>" --no-input
jira epic create -p <KEY> -n "<epic name>" -s "<summary>" -T <body-file> --no-input
```

`-t` type, `-s` summary, `-T` body file, `-y` priority, `-l` label (repeat it), `-C` component
(repeat it), `-a` assignee, `-P` parent (an epic, or the parent of a sub-task), `--custom
<field>=<value>` a custom field. Add `--raw` to `issue create` to get the new issue as JSON. The
issue key is in the output.

## Change

```bash
jira issue edit <ISSUE> -s "<new summary>" --no-input
jira issue edit <ISSUE> --no-input < <body-file>                  # new description from stdin
jira issue edit <ISSUE> -l new-label --no-input                  # adds a label; check --help to remove one
jira issue assign <ISSUE> "<name>"                               # "$(jira me)", or x to unassign
jira issue move <ISSUE> "In Progress"                            # transition to a status
jira issue move <ISSUE> Done --comment "<why>"
jira issue comment add <ISSUE> --template <body-file>
jira issue link <ISSUE> <OTHER-ISSUE> Blocks                     # link type as the site names it
jira issue link remote <ISSUE> <url> "<title>"                   # a web link, such as a PR
jira epic add <EPIC-ISSUE> <ISSUE> [<ISSUE>...]
jira epic remove <ISSUE> [<ISSUE>...]
jira issue delete <ISSUE>                                        # confirm with the user first
```

`issue move` takes a status the issue's workflow can reach from where it is. When it fails, read
the issue's status with `issue view` and ask which status the user means.

## Epics and sprints

`sprint list` has no board flag. It uses the board in the CLI config (`jira init --board`). To
list the active sprint's issues for any project, use JQL instead.

```bash
jira epic list -p <KEY> --plain --table                 # the epics
jira epic list <EPIC-ISSUE> -p <KEY> --plain            # the issues in one epic
jira sprint list --plain --table                        # the sprints of the configured board
jira sprint list --current --plain                      # issues in the configured board's active sprint
jira issue list -p <KEY> -q 'sprint in openSprints()' --plain   # active-sprint issues of one project
jira sprint add <sprint-id> <ISSUE> [<ISSUE>...]
```

## Other

```bash
jira project list                # every project the login can see
jira board list -p <KEY>         # boards of a project
jira me                          # the login from the config; no server call
jira serverinfo                  # the server and its version
jira open <ISSUE> --no-browser   # print the issue's URL instead of opening it
```
