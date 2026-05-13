# 🔌 Using Portfile

Welcome to Portfile! This guide will walk you through how to use it safely and effectively to manage ports across your local projects.

---

## 1. Quick Start (Per Project)

When you pull a repo or start a new project, navigate to its folder and initialize your ports.

```bash
# Go to your project
cd my-awesome-project

# Initialize a .portfile config
portfile init
```

The wizard will ask you for:
- **Project name:** Defaults to folder name.
- **Port:** The number you need (e.g., `3000`).
- **Description:** What runs there (e.g., `React Frontend`).

You can add multiple ports by following the prompts, or press **Enter** with an empty port to save and exit.

**What happens?**
1. It creates a `.portfile` JSON file in your directory *(commit this to git!)*.
2. It registers these ports automatically in your machine's global SQLite registry.

---

## 2. The Pre-flight Check

Before you start any development server, check the status of your assigned ports:

```bash
portfile check
```
It immediately analyzes your `.portfile` and tells you:
- Are the servers running right now? (**` LIVE `** or `idle`)
- Are there any conflicts? (e.g., Is `ecommerce-backend` accidentally mapped to this same port on your computer?)

---

## 3. Viewing Your Global Registry

Want to remember which port `old-project` was using six months ago? List everything running locally:

```bash
portfile list
```
You will get a clean terminal table of every port registered on your machine, which project owns it, and if it is actively listening `LIVE` right now.

---

## 4. Advanced Debugging

### Sweeping for Ghosts
Did something steal `8080`, but it's not showing up in `portfile list`? Scan a specific range to find untracked zombie processes.

```bash
portfile scan --range 8000-8100
```
This pings 100 ports around `8000` to find what's active, pointing out undocumented local services.

### Registry Cleanup
Did you delete a web application's folder without telling Portfile? That leaves a "stale" entry in your registry. To fix this:

```bash
# Safely find all stale database entries
portfile doctor
```

---

## 5. Cleaning Up

If you need to change ports, or no longer want a project tracked, you can release those specific ports:

```bash
# Release a single port
portfile release 3000

# Release all ports for the current project
portfile release --all
```

Then simply remove your `.portfile` configuration file from the project directory.