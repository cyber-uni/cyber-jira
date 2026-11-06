---
title: init-jira
description: Install the jira CLI, set the API token, run jira init, and verify the connection.
---

Run `/cyber-jira:init-jira` the first time you use Jira through an agent, or when a `jira`
command fails with `command not found`, a 401 or 403, or a missing config.

## Steps

1. **Check.** It looks for the CLI, the token, and the CLI config, without printing the token.
   If all three are present it jumps to the check at the end.
2. **Install the CLI.** It names the method for your platform (Homebrew, Scoop, Nix, `go install`,
   or the release binary with a checksum) and asks before running it.
3. **Set the token.** It asks which kind of Jira you use and tells you where to create the token:
   Jira Cloud, or Data Center with a personal access token or a password. You add
   `JIRA_API_TOKEN` to your shell profile yourself. Do not paste the token into the chat.
4. **Run `jira init`.** It collects the installation type, server URL, login, and optionally a
   project and board, then writes the CLI config. It asks before replacing an existing config.
5. **Verify.** `jira serverinfo`, `jira project list`, and `jira issue list` must all succeed.

## Several Jira sites

One CLI config file holds one site. Keep a file per site and select it with `JIRA_CONFIG_FILE`,
for example in the repo's `mise.toml` or `.envrc`.

## Next

If the repo works against fixed projects, run [config-jira](/cyber-jira/skills/config-jira/).
[Where settings live](/cyber-jira/reference/settings/) shows what goes where.

[Skill source](https://github.com/cyber-uni/cyber-jira/blob/main/packages/cyber-jira/skills/init-jira/SKILL.md) on GitHub.
