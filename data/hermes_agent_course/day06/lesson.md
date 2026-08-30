---
day: 6
title: Run It 24/7 on a VPS
subtitle: Put Hermes on a server, keep one gateway service running, and prove it survives a reboot.
---

# Run It 24/7 on a VPS

**Read time: 7 minutes · Task: 30–60 minutes**

If your laptop is asleep, its gateway is offline. A VPS is one way to keep Hermes available without leaving your own computer on.

## Decide before you buy

Check the current Hermes requirements and compare live provider prices. Look for:

- a current Linux image supported by Hermes;
- SSH key access;
- a region with acceptable latency;
- enough memory and storage for the gateway and tools you will use; and
- a monthly price and payment method you can sustain.

Do not buy from a price quoted in a course. Cloud plans change. Include tax, storage, backups and bandwidth in your comparison. A cPanel hosting account is not the same thing as a VPS with shell access.

## Connect without using a password

Create the server with your public SSH key, then connect as the user supplied by the host:

```bash
ssh YOUR_USER@YOUR_SERVER_IP
```

Keep root login and password authentication disabled where your host permits it. Apply system updates before installing anything else.

## Install Hermes and the gateway service

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
hermes setup --portal     # or configure another supported provider
hermes gateway setup
hermes gateway install
hermes gateway start
hermes gateway status
```

On a Linux VPS, a user service also needs lingering if it must survive logout:

```bash
sudo loginctl enable-linger $USER
```

The official guide also documents a system-wide service. Choose one service type. Running both creates confusing start, stop and status behaviour.

## Prove it survives

Reboot the server once. Reconnect and run:

```bash
hermes gateway status
hermes status --deep
```

If the gateway is not running, check the service logs listed in the official gateway guide. Do not call the setup “24/7” until it has survived a reboot.

## Security minimum

Use SSH keys, apply updates, keep `~/.hermes/.env` private and expose no Hermes service port unless the feature requires it. Lesson 15 covers the full review.

## Task

Provision a VPS, install Hermes, install one gateway service and reboot the server.

## Output

Record the provider, current monthly cost, Linux distribution, service type and the status shown after reboot. Planning to do it later does not complete this lab.

---
**Official guide:** [Messaging gateway service management](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/). Re-check your host's live pricing and terms before paying.
