---
day: 21
title: Plugins, MCP and Extending Hermes
subtitle: Three ways to add capabilities — packaged plugins, the modern tool-interop standard, and custom tools.
---

# Plugins, MCP and Extending Hermes

**Read time: 5 minutes · Task: 10 minutes (optional)**

Hermes is designed to grow with you. When the built-in features aren't enough, you extend it — three escalating ways.

## 1. Plugins — get features with one command

> **Command:** this is the standard, low-code way to add capabilities.

- A **plugin** bundles new features you can enable with a single command.
- Examples: connect a specific external service, add a specialised tool, extend the gateway.
- This is your first stop when you need something new — check for a plugin before building anything custom.

## 2. MCP — the modern interoperability standard

The **Model Context Protocol** is the emerging standard for connecting AI to external tools and data.

- If your favourite services expose **MCP servers**, Hermes can plug into them directly.
- The gateway/proxy can also let other MCP clients reach the agent.
- Think of MCP as the universal adapter: one protocol to connect many tools, rather than bespoke code per service.

## 3. Custom tools — build your own

- For a unique need, you can author your own **tool** — with an explicit name, description, and input schema (MCP-style), telling the agent when and how to call it.
- Documented and testable, this is how advanced users add precisely-tailored abilities.
- **Rule of thumb:** plugin → MCP server → custom tool, in that order. Don't write custom code when a plugin or MCP bridge already exists.

## Choosing the right extension

| Need | Use |
|------|-----|
| Common feature / service | Plugin |
| External tool with an MCP server | MCP |
| Truly unique to your workflow | Custom tool |

## 🎯 Task

Browse the plugin directory/documentation for one plugin relevant to your work and note it. If you use a service that exposes MCP, sketch how you'd connect it.

## 📤 Output

The plugin (or MCP server) you found and one sentence on how you'd use it.

---
**Verified fact:** Plugins, MCP servers/clients, and authoring custom MCP-style tools are documented Hermes Agent extension mechanisms.
