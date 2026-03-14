#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"
DEV_PID_FILE="$RUN_DIR/dev.pid"
TUNNEL_PID_FILE="$RUN_DIR/tunnel.pid"

stop_pid_file() {
  local pid_file="$1"
  local label="$2"

  if [[ ! -f "$pid_file" ]]; then
    echo "$label is not running (no PID file)."
    return
  fi

  local pid
  pid="$(<"$pid_file")"

  if ! kill -0 "$pid" >/dev/null 2>&1; then
    echo "$label not running (stale PID: $pid). Cleaning PID file."
    rm -f "$pid_file"
    return
  fi

  kill "$pid" >/dev/null 2>&1 || true

  for _ in {1..5}; do
    if kill -0 "$pid" >/dev/null 2>&1; then
      sleep 1
    else
      break
    fi
  done

  if kill -0 "$pid" >/dev/null 2>&1; then
    echo "$label still running, forcing stop (PID: $pid)."
    kill -9 "$pid" >/dev/null 2>&1 || true
  else
    echo "Stopped $label (PID: $pid)."
  fi

  rm -f "$pid_file"
}

stop_pid_file "$TUNNEL_PID_FILE" "Tunnel"
stop_pid_file "$DEV_PID_FILE" "Dev server"

echo "Done."
