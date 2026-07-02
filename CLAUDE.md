# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Minimal Node.js + Express + SQLite CRUD sample app used for the SPELIX Claude Code Day 1 training lab. It exposes a single `items` resource. This repo is the starting point of a 5-day curriculum (Day 3/4/5 live in separate `dayN_repository` repos linked from the README).

## Tech Stack

- **Node.js** 18+ (LTS recommended)
- **Express** `^4.21.2` — HTTP framework
- **better-sqlite3** `^11.10.0` — synchronous SQLite driver
- **Jest** `^29.7.0` + **Supertest** `^7.1.0` — test runner & in-process HTTP assertions

## Commands

- `npm install` — install dependencies
- `npm start` (or `node server.js`) — run the server on port 3000
- `npm test` — run the full Jest test suite
- `npx jest tests/items.test.js` — run a single test file
- `npx jest -t "rejects a negative price"` — run tests matching a name

## Environment

Configured via env vars (see `.env.example`):
- `PORT` — server port (default `3000`)
- `DB_PATH` — SQLite file path (default `./data.db`); set to `:memory:` for an ephemeral DB.

## Architecture

Request flow: `server.js` → `app.js` → `routes/*.js` → `db.js`.

- **App/server split:** `app.js` builds and exports the Express app but does **not** call `listen()`; `server.js` is the only place that opens a socket. This lets tests import `app` and drive it in-process via Supertest without binding a port. Add app-level routes (e.g. `/healthz`) in `app.js`; add resource routes under `routes/` and mount them in `app.js`.
- **Database:** `db.js` opens one shared synchronous `better-sqlite3` connection and creates the `items` table on load. Route handlers `require('../db')` and use prepared statements with `?` placeholders. Because the connection is created at module-load time, `DB_PATH` must be set **before** the app is required — which is why `tests/items.test.js` sets `process.env.DB_PATH = ':memory:'` on its first line.
- **Validation:** route handlers validate input inline and return `400` with `{ error }` on bad input; successful creates return `201` with the persisted row.

## Conventions

- **Variables & functions:** camelCase (e.g. `itemsRouter`, `nextId`).
- **Route paths:** lowercase / kebab-case (e.g. `/items`, `/products`).
- **DB columns:** snake_case (e.g. `created_at`).
- **Tests:** all live in `/tests`, named `<resource>.test.js` (e.g. `items.test.js`, `products.test.js`); run with `npm test`.

## Notes

- Despite the "CRUD" name, only Create (`POST /items`) and Read (`GET /items`) are implemented; there is no Update/Delete yet.
- On Windows PowerShell, `curl` is an alias for `Invoke-WebRequest` — use `curl.exe` for the README's manual API examples.
