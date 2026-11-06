---
name: init-jira
description: Use this skill when setting up Jira for an agent — install the jira CLI, set the API token, run jira init, verify.
---

# Init Jira

Get the [`jira` CLI](https://github.com/ankitpokhrel/jira-cli) (ankitpokhrel/jira-cli) working
for this user: installed, authenticated, pointed at their Jira site, and verified. Every other
cyber-jira skill drives this CLI and stops here when it fails.

## When to use

The first time the user works with Jira through an agent, or when a `jira` command fails with
`command not found`, a 401 or 403, or a missing config.

## 1. Check what is already there

```bash
command -v jira && jira version
echo "Token set: ${JIRA_API_TOKEN:+yes}"
echo "Auth type: ${JIRA_AUTH_TYPE:-unset}"
echo "Config: ${JIRA_CONFIG_FILE:-${XDG_CONFIG_HOME:-$HOME/.config}/.jira/.config.yml}"
ls -l "${JIRA_CONFIG_FILE:-${XDG_CONFIG_HOME:-$HOME/.config}/.jira/.config.yml}"
```

Never print the token itself. When the CLI, the token, and the config are all present, go to
**5. Verify**.

## 2. Install the CLI

Skip when `jira version` printed a version. Installing changes the user's machine, so name the
method and **ask** before running it. Pick the first one that fits:

| Platform | Command |
| --- | --- |
| macOS with Homebrew | `brew tap ankitpokhrel/jira-cli && brew install jira-cli` |
| Windows with Scoop | `scoop bucket add extras && scoop install jira-cli` |
| Nix | `nix-env -f '<nixpkgs>' -iA jira-cli-go` (the package is `jira-cli-go`) |
| FreeBSD, NetBSD | `pkg install jira-cli`, `pkgin install jira-cli` |
| Go 1.16 or newer on PATH | `go install github.com/ankitpokhrel/jira-cli/cmd/jira@latest` |
| Anything else | the release binary, below |

**Release binary.** Read the latest version from
<https://github.com/ankitpokhrel/jira-cli/releases/latest> (or
`gh release view --repo ankitpokhrel/jira-cli --json tagName`). Assets are named
`jira_<version>_<os>_<arch>.tar.gz`: `<os>` is `linux` or `macOS`, `<arch>` is `x86_64`,
`arm64`, `armv6`, or `i386`; Windows has only `jira_<version>_windows_x86_64.zip`. Download the
asset and `checksums.txt` into a new empty directory, check the asset's SHA-256 against
`checksums.txt`, extract it, and copy the `jira` binary it contains to a directory on the user's
PATH (`~/.local/bin` needs no root). Do not run anything else from the archive.

After installing, `jira version` must print a version. A `go install` binary lands in
`$(go env GOPATH)/bin`; if that is not on PATH, tell the user to add it.

## 3. Set the API token

Skip when the token is set and the user is not changing sites. Ask which kind of Jira they use:

- **Jira Cloud** (`*.atlassian.net`): create an API token at
  <https://id.atlassian.com/manage-profile/security/api-tokens>. The login is their Atlassian
  account email.
- **Jira Data Center or Server, with a personal access token**: create the token from the
  user's Jira profile (Profile → Personal Access Tokens), and also set `JIRA_AUTH_TYPE=bearer`.
- **Jira Data Center or Server, with a password**: the password goes in `JIRA_API_TOKEN`; the
  auth type stays `basic`, the default.
- **Client certificates (mTLS)**: `jira init` asks for the CA certificate, client key, and client
  certificate. Have the user run `jira init` themselves (step 4) and pick `Local`, then `mtls`.

The user adds the token to their shell profile themselves, so it never passes through this
conversation:

```bash
export JIRA_API_TOKEN='<token>'
export JIRA_AUTH_TYPE=bearer   # only for a Data Center personal access token
```

Do not ask the user to paste the token here, and never write it into a repo file. If they paste
it anyway, do not repeat it back; tell them to put it in their profile and to revoke the token
if the conversation is shared.

A profile change reaches new shells only. If `echo ${JIRA_API_TOKEN:+yes}` is still empty in
your shell after they set it, ask the user to restart the session (or `source` the profile in
their terminal and start the agent from there).

## 4. Run `jira init`

`jira init` writes the CLI's config. It calls the server, so it also proves the token, login, and
project are right. Collect these first, asking for what is not known:

| Flag | Value |
| --- | --- |
| `--installation` | `cloud` or `local` (Data Center or Server) |
| `--server` | The site URL, `https://acme.atlassian.net` |
| `--login` | Cloud: the account email. Data Center: the username |
| `--auth-type` | `basic` (default), `bearer`, or `mtls`. Omit it when `JIRA_AUTH_TYPE` is set |
| `--project` | The user's usual project key, such as `API`. Optional: pick from `jira project list` afterwards |
| `--board` | The board name for that project. Optional |

```bash
jira init --installation cloud --server https://acme.atlassian.net \
  --login alice@acme.com --project API --board "API board"
```

With every flag given, it runs without prompts; a value left out is prompted for, so leave out
only what the user will answer in their own terminal.

When a config file already exists, show its `server`, `login`, and `project` lines and ask
before replacing it. On yes, add `--force`; the old file is kept as `.config.yml.bkp` beside it.

**Several Jira sites.** One config file holds one site. Keep one file per site and select it with
`JIRA_CONFIG_FILE=<path>` (or `-c <path>` on any command), for example in the repo's
`mise.toml` or `.envrc`, which is where a per-repo setting belongs. Point `JIRA_CONFIG_FILE` at
the new path before running `jira init`, then check that the file was written there.

**Errors.** `401` or `403`: the token or login is wrong, or the auth type does not match the
token. `project not found`: the key is wrong or the user cannot see it. A non-English Jira may
need `epic.name`, `epic.link`, and the `issue.types` handles edited by hand in the config file.

## 5. Verify

```bash
jira serverinfo
jira project list
jira issue list --plain --paginate 0:3
```

`jira me` only prints the login from the config; it does not prove the token works. All three
commands above must succeed. Report the server, the login, and the default project the config
holds.

## 6. Optional: the repo config

If this repo works against fixed Jira projects or people, offer the **config-jira** skill. It
records the default project, user aliases, and issue defaults in the committed
`.agents/cyber-jira.json`.
