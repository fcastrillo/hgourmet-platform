#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"
LOG_DIR="$RUN_DIR/logs"
DEV_PID_FILE="$RUN_DIR/dev.pid"
TUNNEL_PID_FILE="$RUN_DIR/tunnel.pid"
ENV_FILE="$ROOT_DIR/.env.local"

mkdir -p "$LOG_DIR"

TUNNEL_MODE="${1:-auto}" # auto | named | quick | token

load_env_file() {
  if [[ -f "$ENV_FILE" ]]; then
    set -a
    # shellcheck source=/dev/null
    source "$ENV_FILE"
    set +a
  fi
}

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "cloudflared is not installed. Run: npm run tunnel:check"
  exit 1
fi

load_env_file

if [[ -f "$DEV_PID_FILE" ]]; then
  DEV_PID="$(<"$DEV_PID_FILE")"
  if kill -0 "$DEV_PID" >/dev/null 2>&1; then
    echo "Dev server already running (PID: $DEV_PID)."
  else
    rm -f "$DEV_PID_FILE"
  fi
fi

if [[ -f "$TUNNEL_PID_FILE" ]]; then
  TUNNEL_PID="$(<"$TUNNEL_PID_FILE")"
  if kill -0 "$TUNNEL_PID" >/dev/null 2>&1; then
    echo "Tunnel already running (PID: $TUNNEL_PID)."
  else
    rm -f "$TUNNEL_PID_FILE"
  fi
fi

if [[ ! -f "$DEV_PID_FILE" ]]; then
  (
    cd "$ROOT_DIR"
    npm run dev >>"$LOG_DIR/dev.log" 2>&1
  ) &
  echo $! >"$DEV_PID_FILE"
  echo "Started dev server (PID: $(<"$DEV_PID_FILE")). Log: .run/logs/dev.log"
fi

if [[ "$TUNNEL_MODE" == "auto" ]]; then
  if [[ -n "${CLOUDFLARE_TUNNEL_TOKEN:-}" ]]; then
    TUNNEL_MODE="token"
  else
    TUNNEL_MODE="named"
  fi
fi

if [[ "$TUNNEL_MODE" == "quick" ]]; then
  TUNNEL_CMD=(npm run tunnel:quick)
  TUNNEL_LABEL="quick"
elif [[ "$TUNNEL_MODE" == "token" ]]; then
  if [[ -z "${CLOUDFLARE_TUNNEL_TOKEN:-}" ]]; then
    echo "CLOUDFLARE_TUNNEL_TOKEN is not set in .env.local"
    exit 1
  fi
  TUNNEL_CMD=(cloudflared tunnel run --token "$CLOUDFLARE_TUNNEL_TOKEN")
  TUNNEL_LABEL="token"
else
  TUNNEL_CMD=(npm run tunnel)
  TUNNEL_LABEL="named"
fi

if [[ ! -f "$TUNNEL_PID_FILE" ]]; then
  (
    cd "$ROOT_DIR"
    "${TUNNEL_CMD[@]}" >>"$LOG_DIR/tunnel.log" 2>&1
  ) &
  echo $! >"$TUNNEL_PID_FILE"
  echo "Started tunnel mode=$TUNNEL_LABEL (PID: $(<"$TUNNEL_PID_FILE")). Log: .run/logs/tunnel.log"
fi

echo "Done. Use: bash ./scripts/dev-down.sh"
