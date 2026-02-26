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
