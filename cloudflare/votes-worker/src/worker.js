export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (url.pathname !== "/api/votes") {
      return json({ ok: false, error: "Not found." }, 404);
    }

    if (request.method === "GET") {
      return handleGet(url, env);
    }

    if (request.method === "POST") {
      return handlePost(request, env);
    }

    return json({ ok: false, error: "Method not allowed." }, 405);
  }
};

async function handleGet(url, env) {
  const item = sanitizeItem(url.searchParams.get("item"));
  const deviceId = sanitizeDevice(url.searchParams.get("device"));

  if (!item) {
    return json({ ok: false, error: "Missing or invalid item." }, 400);
  }

  const stats = await getStats(env, item);
  let viewer = { liked: false, stars: 0 };

  if (deviceId) {
    const row = await env.DB.prepare(
      "SELECT liked, stars FROM votes WHERE item_key = ?1 AND device_id = ?2"
    ).bind(item, deviceId).first();

    if (row) {
      viewer = {
        liked: !!row.liked,
        stars: Number(row.stars || 0)
      };
    }
  }

  return json({ ok: true, item, stats, viewer }, 200);
}

async function handlePost(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch (_) {
    return json({ ok: false, error: "Invalid JSON body." }, 400);
  }

  const item = sanitizeItem(payload && payload.item);
  const deviceId = sanitizeDevice(payload && payload.deviceId);
  const liked = !!(payload && payload.liked);
  const stars = Number(payload && payload.stars || 0);

  if (!item) {
    return json({ ok: false, error: "Missing or invalid item." }, 400);
  }
  if (!deviceId) {
    return json({ ok: false, error: "Missing or invalid deviceId." }, 400);
  }
  if (!Number.isInteger(stars) || stars < 0 || stars > 5) {
    return json({ ok: false, error: "Stars must be an integer between 0 and 5." }, 400);
  }

  // Allow quick rating corrections (e.g. 5 -> 3) but throttle rapid identical repeats.
  const previous = await env.DB.prepare(
    "SELECT updated_at, stars FROM votes WHERE item_key = ?1 AND device_id = ?2"
  ).bind(item, deviceId).first();

  if (previous && previous.updated_at) {
    const last = Date.parse(previous.updated_at);
    const now = Date.now();
    const previousStars = Number(previous.stars || 0);
    const isSameValueRepeat = previousStars === stars;
    if (!Number.isNaN(last) && now - last < 1000 && isSameValueRepeat) {
      return json({ ok: false, error: "Too many repeated updates. Try again in a second." }, 429);
    }
  }

  const nowIso = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO votes (item_key, device_id, liked, stars, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6)
     ON CONFLICT(item_key, device_id)
     DO UPDATE SET liked = excluded.liked, stars = excluded.stars, updated_at = excluded.updated_at`
  ).bind(item, deviceId, liked ? 1 : 0, stars, nowIso, nowIso).run();

  const stats = await getStats(env, item);

  return json({
    ok: true,
    item,
    stats,
    viewer: {
      liked,
      stars
    }
  }, 200);
}

async function getStats(env, item) {
  const agg = await env.DB.prepare(
    `SELECT
       COUNT(*) AS total_votes,
       SUM(CASE WHEN liked = 1 THEN 1 ELSE 0 END) AS likes,
       ROUND(AVG(CASE WHEN stars > 0 THEN stars END), 2) AS avg_stars
     FROM votes
     WHERE item_key = ?1`
  ).bind(item).first();

  const starsRows = await env.DB.prepare(
    `SELECT stars, COUNT(*) AS c
     FROM votes
     WHERE item_key = ?1 AND stars > 0
     GROUP BY stars`
  ).bind(item).all();

  const stars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const row of starsRows.results || []) {
    const s = Number(row.stars || 0);
    if (s >= 1 && s <= 5) {
      stars[s] = Number(row.c || 0);
    }
  }

  return {
    likes: Number(agg && agg.likes || 0),
    totalVotes: Number(agg && agg.total_votes || 0),
    avgStars: Number(agg && agg.avg_stars || 0),
    stars
  };
}

function sanitizeItem(value) {
  const v = String(value || "").trim();
  if (!v) {
    return "";
  }
  if (!/^[a-z0-9:_-]{3,120}$/i.test(v)) {
    return "";
  }
  return v;
}

function sanitizeDevice(value) {
  const v = String(value || "").trim();
  if (!v) {
    return "";
  }
  if (!/^[a-z0-9-]{8,120}$/i.test(v)) {
    return "";
  }
  return v;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function json(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders()
    }
  });
}
