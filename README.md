# IT Engineer Learning Hub

A self-built study **and** reference tool for Level 1 IT support at a Microsoft-focused MSP.
Built as a learning project — and a working desk reference — covering the tickets, tools and
cloud/AI skills a first-line engineer actually needs.

**Live:** https://learn.maxnova.co.uk

## What's in it

- **L1 Ticket Runbooks** — 12 step-by-step guides in the real ticket-working shape:
  *symptom → questions to ask → diagnosis → fix → escalate-if.* Searchable, filterable,
  with "mark as read" progress.
- **MS365 Admin** — the admin-center map, users & licensing, Exchange, SharePoint, Entra, PowerShell.
- **VoIP & Telephony** — how VoIP works, SIP vs RTP, call routing, common tickets, call quality.
- **AI & Automation** — Copilot, Power Automate, Copilot Studio, the Power Platform, Hermes agent.
- **Cheat Sheets** — copy-paste Windows/PowerShell/Exchange commands, admin URLs, shortcuts.
- **Glossary** — 53 searchable terms decoding the acronym soup.
- **Practice** — topic quizzes, flashcards, and a branching **ticket simulator**.

## Tech

Plain static site — HTML, CSS, and vanilla JavaScript. No build step, no framework, no backend.
Progress (runbooks read, quiz scores, flashcards mastered) is saved locally in the browser via
`localStorage`. Content lives in data files (`*-data.js`) so it's easy to extend.

Deployed as a static site via Coolify behind a Cloudflare Tunnel.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Home dashboard (progress) |
| `runbooks.html` + `runbooks-data.js` + `runbooks.js` | Ticket runbook library |
| `ms365.html` / `voip.html` / `ai-automation.html` | Guide pages (accordions) |
| `cheatsheets.html` + `cheatsheets-data.js` + `cheatsheets.js` | Copy-paste command references |
| `glossary.html` + `glossary-data.js` + `glossary.js` | Searchable glossary |
| `practice.html` + `practice-data.js` + `practice.js` | Quizzes, flashcards, ticket simulator |
| `style.css` | Design system + all page styles |
| `main.js` | Shared header/footer, nav, localStorage progress layer |
