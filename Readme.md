# 🔌 Portfile

> A local port registry for developers. Know which project owns which port, detect conflicts before they happen, and see everything running on your machine — from one CLI.

---

## The Problem

You are juggling multiple local projects every day:

```
Project A  →  runs on 3000
Project B  →  also wants 3000
Project C  →  runs on 3001
Project D  →  nobody knows — it just works until it doesn't
```

Every developer has faced this:

- You start your backend server. It fails silently because port 3000 is already taken.
- You have no idea which project is using it.
- You run `lsof -i :3000` or `netstat`, get a PID, and manually trace it back.
- Five minutes wasted. Every. Single. Time.

There is no standard tool that tells you: *"Port 3000 belongs to your `ecommerce-app` project."*

Portfile fixes that.

---

## What Portfile Does

Portfile is a globally installed CLI tool that maintains a local **port registry** — a small encrypted SQLite database on your machine that maps port numbers to projects.

Before you start any project, Portfile tells you:
- Which ports your project wants to use
- Whether those ports are already registered to another project
- Whether those ports are actively in use right now by a live process

Think of it as a `.nvmrc` for ports — a small config file per project that declares what ports it needs, tracked in your registry.

---

## Core Concepts

### The Registry
A SQLite database stored at `~/.portfile/registry.db`. It holds all your port-to-project mappings across every project on your machine.

### The `.portfile` Config
A small JSON file in each project's root directory that declares which ports that project needs. You commit this file to Git — it is part of your project.

```
your-project/
├── .portfile          ← declares port ownership (commit this)
├── src/
├── package.json
└── ...
```

### Registry vs Live Detection
Portfile distinguishes between two states:
- **Registered** — a project has claimed this port in the registry
- **Live** — a process is actively listening on this port right now

Both matter. A port can be registered but not live (the project is not running). A port can be live but not registered (something grabbed it outside of Portfile).

---

## Commands

### `portfile init`
Initializes a `.portfile` config file in the current directory. You run this once per project.

It asks you:
- What is your project name?
- Which ports does this project need?
- What is each port used for? (e.g., "API server", "frontend dev server", "Redis")

This creates a `.portfile` in your project root and registers all the declared ports in your global registry.

---

### `portfile register <port> <description>`
Manually registers a single port to the current project.

Example:
```
portfile register 3000 "Next.js dev server"
portfile register 5432 "PostgreSQL"
```

If the port is already registered to another project, Portfile will tell you which project owns it and ask what you want to do: overwrite, pick a different port, or cancel.

---

### `portfile check`
Scans the `.portfile` in the current directory and checks the status of every declared port.

For each port it reports:
- Is it registered in your registry?
- Is it live right now (something is listening)?
- Is there a conflict with another project?

This is the command you run before starting your project. Think of it as a pre-flight check.

---

### `portfile list`
Shows all registered ports across all your projects in a clean terminal table.

```
PORT    PROJECT             DESCRIPTION              STATUS
------  ------------------  -----------------------  --------
3000    ecommerce-app       Next.js dev server        LIVE
3001    admin-dashboard     Vite dev server           idle
5432    ecommerce-app       PostgreSQL                LIVE
8080    old-prototype       Express API               idle
```

The STATUS column is live — it probes each port in real time.

---

### `portfile release <port>`
Removes a port from the registry. Useful when you finish a project or reassign a port.

---

### `portfile release --all`
Releases all ports registered to the current project. Run this when you are done with a project or want to clean up.

---

### `portfile status`
Shows a summary dashboard for the current project:

```
Project:   ecommerce-app
Location:  ~/projects/ecommerce-app
Ports:     3 registered

PORT    DESCRIPTION          STATUS
------  -------------------  ------
3000    Next.js dev server    LIVE
5001    Express API           LIVE
5432    PostgreSQL            LIVE
```

---

### `portfile doctor`
Scans your entire registry and reports:
- Ports that are registered but the project directory no longer exists (stale entries)
- Ports that are live but not registered (untracked processes)
- Port conflicts between two registered projects

Useful for cleaning up after you delete old projects.

---

### `portfile scan`
Scans all ports in a range (default: 1024–9999) and shows which ones are currently live on your machine — whether registered or not.

```
portfile scan
portfile scan --range 3000-4000
```

---

## The `.portfile` Config Format

A simple JSON file committed to your project root.

```json
{
  "project": "ecommerce-app",
  "ports": [
    { "port": 3000, "description": "Next.js dev server" },
    { "port": 5001, "description": "Express API" },
    { "port": 5432, "description": "PostgreSQL" }
  ]
}
```

This file is the contract your project makes about what ports it needs. When a new developer clones your repo and runs `portfile init`, Portfile reads this file and registers the ports on their machine.

---

## Conflict Resolution

When you try to register a port that is already taken, Portfile does not just error and exit. It gives you options:

```
Port 3000 is already registered to: admin-dashboard
  ~/projects/admin-dashboard

What would you like to do?
  1. Overwrite — take this port for the current project
  2. Use a different port — register an alternate
  3. Cancel
```

---

## Installation

**Requirements:** Node.js 16+

```bash
git clone https://github.com/yourusername/portfile.git
cd portfile
npm install
npm link
```

After linking, `portfile` works from any directory on your machine.

---

## Quick Start

```bash
cd your-project

# Initialize Portfile for this project
portfile init

# Check port status before starting
portfile check

# Start your app normally
npm start

# See everything registered across all projects
portfile list
```

---

## How It Works Internally

### Storage Layer
Portfile uses `better-sqlite3` for its local registry. SQLite was chosen because:
- It requires zero server setup
- It is fast for the small reads and writes Portfile needs
- The database is a single file that can be backed up or deleted easily
- It works offline, always

The database lives at `~/.portfile/registry.db`.

### Live Port Detection
To check if a port is actually in use right now, Portfile uses Node's built-in `net` module to attempt a TCP connection on that port. If the connection succeeds, something is listening. If it is refused, the port is free. This is faster and more portable than parsing `lsof` or `netstat` output.

### Conflict Detection Flow
When you run `portfile check` or `portfile register`:

1. Portfile reads your `.portfile` config (or the port you passed)
2. For each port, it queries the registry: is this port registered?
3. If registered to a different project → conflict warning
4. Then it probes the port live: is something listening right now?
5. If live but not registered → untracked process warning
6. Combines both results into a clear status report

### The `.portfile` File
The `.portfile` JSON file in your project root serves two purposes:
- It is a declaration of intent (what ports your project needs)
- It is a handshake for new developers — `portfile init` reads it and registers everything automatically

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Runtime | Node.js | Same ecosystem as the target audience, fast CLI startup |
| CLI framework | Commander.js | Mature, simple, handles subcommands cleanly |
| Database | better-sqlite3 | Synchronous SQLite — perfect for CLI tools |
| Terminal UI | chalk + cli-table3 | Colored output and clean tables without heavy dependencies |
| Live detection | Node.js `net` module | Built-in, no extra dependencies, works cross-platform |
| Config | JSON (`.portfile`) | Human-readable, Git-friendly, no special parser needed |

---

## Project Structure

```
portfile/
├── bin/
│   └── portfile.js          ← CLI entry point
├── src/
│   ├── cli.js               ← Command registration (Commander)
│   ├── commands/
│   │   ├── init.js          ← portfile init
│   │   ├── register.js      ← portfile register
│   │   ├── release.js       ← portfile release
│   │   ├── check.js         ← portfile check
│   │   ├── list.js          ← portfile list
│   │   ├── status.js        ← portfile status
│   │   ├── doctor.js        ← portfile doctor
│   │   └── scan.js          ← portfile scan
│   └── lib/
│       ├── db.js            ← SQLite read/write helpers
│       ├── detect.js        ← Live port detection (net module)
│       ├── config.js        ← .portfile JSON read/write
│       ├── conflicts.js     ← Conflict detection logic
│       └── display.js       ← Terminal output formatting
├── tests/
│   ├── db.test.js
│   ├── detect.test.js
│   └── conflicts.test.js
├── .portfile                ← Portfile's own port config (dogfooding)
├── .gitignore
└── package.json
```

---

## Portfile vs Other Approaches

| | **Portfile** | Manual `lsof` / `netstat` | `.env` PORT variables | Docker port mapping |
|--|--|--|--|--|
| Knows which project owns a port | ✅ | ❌ | ❌ | Partial |
| Detects conflicts before startup | ✅ | ❌ | ❌ | ❌ |
| Works across all projects | ✅ | ✅ | ❌ | ❌ |
| Zero config to start | ✅ | ✅ | ✅ | ❌ |
| Committed to repo | ✅ (`.portfile`) | ❌ | Partial | ✅ |
| Human-readable history | ✅ | ❌ | ❌ | ❌ |

---

## Build Phases

### Phase 1 — Core Registry (MVP)
Build the SQLite registry, `register`, `release`, and `list` commands. No live detection yet, just the registry layer. Ship this and use it.

### Phase 2 — Live Detection + Check
Add the `net` module probing. Build `portfile check` and integrate live status into `portfile list`. This is where the tool becomes genuinely useful every day.

### Phase 3 — Project Config (`.portfile`)
Add the `.portfile` JSON config format. Build `portfile init` to generate it. Make `portfile check` read from it automatically. This is what makes the tool feel polished and team-friendly.

### Phase 4 — Doctor + Scan
Add `portfile doctor` for registry cleanup and `portfile scan` for full-range port scanning. These are power-user features that make the tool stand out.

### Phase 5 — Optional Extras
- Git hook integration (`pre-start` hook that auto-runs `portfile check`)
- A `portfile watch` mode that alerts you in real time when a registered port goes live or dies
- Shell completions for `bash` and `zsh`

---

## Important Notes

- **Registry is global** — one registry for all projects on your machine, identified by port number and project path
- **`.portfile` is per-project** — commit it to Git so your team gets the benefit
- **No cloud, no account** — everything is local, offline, and private
- **No interference with your app** — Portfile never touches your running processes; it only observes

---

## License

MIT