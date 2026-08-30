---
day: 18
title: Plugins, MCP and Extending Hermes
subtitle: Three ways to add capabilities — packaged plugins, the modern tool-interop standard, and custom tools.
---

# Plugins, MCP and Extending Hermes

**Read time: 5 minutes · Task: 10 minutes (optional)**

When the built-in tools are not enough, choose the smallest extension that fits the job.

## 1. Skills — procedures before new code

A skill is usually the right choice when existing tools can do the work and the missing piece is a repeatable procedure. Skills can include instructions, scripts and templates.

## 2. Plugins — packaged code and configuration

- A **plugin** can bundle tools, providers, gateway adapters or other code. Inspect its source and permissions before installing it.
- Examples: connect a specific external service, add a specialised tool, extend the gateway.
- Manage installed plugins with `hermes plugins`. Install only from a source and pinned revision you trust.

## 3. MCP — external tool servers

The **Model Context Protocol** connects Hermes to external tool servers.

- If your favourite services expose **MCP servers**, Hermes can plug into them directly.
- The gateway/proxy can also let other MCP clients reach the agent.
- Think of MCP as the universal adapter: one protocol to connect many tools, rather than bespoke code per service.

## 4. Core tools — change Hermes itself only when necessary

- Adding a built-in tool changes Hermes core and carries the highest maintenance cost. Reserve it for work that cannot be expressed as a skill, plugin or MCP server.
- **Rule of thumb:** skill → trusted plugin or MCP server → core tool.

## Choosing the right extension

| Need | Use |
|------|-----|
| Repeatable method using existing tools | Skill |
| Packaged Hermes feature or adapter | Plugin |
| External tool with an MCP server | MCP |
| Change to Hermes itself | Core tool |

## 🎯 Task

Choose one missing capability from your work. Decide whether it needs a skill, plugin, MCP server or core change. If it needs third-party code, inspect the source and pin before installing.

## 📤 Output

The plugin (or MCP server) you found and one sentence on how you'd use it.

---
**Official guides:** [Creating skills](https://hermes-agent.nousresearch.com/docs/developer-guide/creating-skills) and [CLI commands for plugins and MCP](https://hermes-agent.nousresearch.com/docs/reference/cli-commands).
