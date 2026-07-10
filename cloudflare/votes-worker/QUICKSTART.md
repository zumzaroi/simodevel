# Quick Setup - Like + Rating Without Login

This guide is beginner-friendly and uses Cloudflare Free.

## What You Get

- LIKE button
- 1..5 star rating
- Stats: likes, rating count, average rating
- No login (MVP)

## 0) Prerequisites

- Your domain is on Cloudflare (already done)
- Local repository (this project)
- Node.js installed locally

## 1) Create D1 Database

1. In Cloudflare Dashboard, open `Workers & Pages`.
2. Open `D1 SQL Database`.
3. Click `Create` and name the database `simodevel_votes`.
4. Copy the `Database ID`.
5. Open `wrangler.toml` and set that value in `database_id`.

## 2) Run SQL Schema

Open a terminal in `cloudflare/votes-worker` and run:

```bash
npm i -D wrangler
npx wrangler login
npx wrangler d1 execute simodevel_votes --file=./schema.sql
```

## 3) Deploy Worker

In the same folder run:

```bash
npx wrangler deploy
```

After deployment, the worker is available in your Cloudflare account.

## 4) Attach Worker to Domain Route

1. In dashboard, open your domain.
2. Open `Workers Routes`.
3. Click `Add route`.
4. Route pattern: `simodevel.com/api/*`
5. Worker: `simodevel-votes-api`
6. Save.

## 5) Quick Test

Open:

- `https://simodevel.com/api/votes?item=blog:01_emitator_fm`

You should get JSON with `ok: true`.

## 6) Frontend Integration Already Included

In `index.html`, the voting widget is already integrated in detail views for:

- blog
- part
- tutorial
- tool

When running from `file://` locally, you will see a fallback message.
On `https://` domain, the widget automatically calls `/api/votes`.

## 7) MVP Limits

- No login: a "user" is a browser/device ID.
- Minimal anti-abuse: update rate limiting per item.
- For comments and real identity, add auth in a later step.
