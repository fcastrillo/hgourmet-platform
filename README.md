# hgourmet-platform

## Local development

```bash
npm install
npm run dev
```

## Shareable preview with Cloudflare Tunnel (ENABLER-1)

1. Verify `cloudflared` is installed:

```bash
npm run tunnel:check
```

2. With the local app running (`npm run dev`), open the tunnel:

```bash
npm run tunnel
```

3. Share the fixed preview domain (for this project: `demo.hgourmet.com.mx`).

Notes:
- `npm run tunnel` uses `cloudflared/config.yml` (named tunnel + fixed domain).
- If you only need a temporary URL, use:

```bash
npm run tunnel:quick
```

## One-command local startup/shutdown

Start app + named tunnel:

```bash
npm run dev:up named
```

Start app + temporary tunnel:

```bash
npm run dev:up:quick
```

Start app + token-based tunnel (reads `CLOUDFLARE_TUNNEL_TOKEN` from `.env.local`):

```bash
npm run dev:up token
```

Auto mode (default `npm run dev:up`) uses token when available, otherwise falls back to named tunnel.

Stop both services:

```bash
npm run dev:down
```

Runtime logs are written to `.run/logs/`.

## Git workflow (feature demo, production on main)

- Daily development happens in feature branches (e.g. `hu/N.M` or `feature/*`).
- Demo validation happens from feature branches using local app + tunnel (`npm run dev:up` or `npm run dev` + `npm run tunnel`).
- Production deployment is tied to `main` only (`www.hgourmet.com.mx`).
- Vercel branch previews are currently not part of the operating flow.
- Merge to `main` only after VoBo on demo.
