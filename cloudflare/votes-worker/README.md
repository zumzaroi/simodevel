# Cloudflare Votes Worker (Free Tier)

This worker provides like + star rating endpoints for SimoDevel static pages.

## 1) Create D1 database

1. In Cloudflare dashboard, go to `Workers & Pages` -> `D1 SQL Database`.
2. Create a database named `simodevel_votes`.
3. Copy the database ID and place it in `wrangler.toml` (`database_id`).
4. Apply schema:

```bash
npx wrangler d1 execute simodevel_votes --file=./schema.sql
```

## 2) Deploy Worker

From this folder:

```bash
npm i -D wrangler
npx wrangler login
npx wrangler deploy
```

## 3) Add Worker route

In Cloudflare dashboard:

1. Go to your domain -> `Workers Routes`.
2. Add route pattern: `simodevel.com/api/*`
3. Attach Worker: `simodevel-votes-api`.

After this, frontend calls to `/api/votes` will reach the worker.

## 4) Endpoints

### GET /api/votes?item=blog:01_emitator_fm&device=anon-123

Returns aggregate stats and viewer vote (if device sent).

### POST /api/votes

Body JSON:

```json
{
  "item": "blog:01_emitator_fm",
  "deviceId": "anon-123",
  "liked": true,
  "stars": 5
}
```

`stars` can be `0..5`. `0` means "no star rating".

## Notes

- Minimal anti-abuse included: same device cannot update the same item too fast.
- This is a zero-login MVP, so "users" means browser/device IDs, not verified identities.
