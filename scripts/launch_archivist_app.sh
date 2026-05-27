#!/usr/bin/env bash
set -euo pipefail

ROOT="${ARCHIVIST_ROOT:-/home/irovian/Documents/senku-archivist}"
SERVICE_HOST="${ARCHIVIST_SERVICE_HOST:-127.0.0.1}"
SERVICE_PORT="${ARCHIVIST_SERVICE_PORT:-8798}"
APP_HOST="${ARCHIVIST_APP_HOST:-127.0.0.1}"
APP_PORT="${ARCHIVIST_APP_PORT:-5173}"
DEFAULT_DOC_ID="${ARCHIVIST_DEFAULT_DOC_ID:-DOC-GOVERNANCE_AND_PLANNING-POLICY_AND_ORGANIZATIONAL_STATEMENTS}"
APP_URL="${ARCHIVIST_APP_URL:-http://${APP_HOST}:${APP_PORT}/#/workspaces/epp-full/documents/${DEFAULT_DOC_ID}}"

RUNTIME_DIR="$ROOT/.tmp/archivist-launch"
LAUNCHER_LOG="$RUNTIME_DIR/launcher.log"
SERVICE_LOG="$RUNTIME_DIR/service.log"
APP_LOG="$RUNTIME_DIR/vite.log"
SERVICE_PID_FILE="$RUNTIME_DIR/service.pid"
APP_PID_FILE="$RUNTIME_DIR/vite.pid"

mkdir -p "$RUNTIME_DIR"

log() {
  printf '[%s] %s\n' "$(date -Is)" "$*" >> "$LAUNCHER_LOG"
}

notify() {
  local title="$1"
  local body="$2"
  if command -v notify-send >/dev/null 2>&1; then
    notify-send "$title" "$body" >/dev/null 2>&1 || true
  fi
}

die() {
  log "ERROR: $*"
  notify "Archivist could not start" "$*"
  printf 'Archivist could not start: %s\nLogs: %s\n' "$*" "$RUNTIME_DIR" >&2
  exit 1
}

url_ready() {
  local url="$1"
  python3 - "$url" <<'PY' >/dev/null 2>&1
from urllib.request import Request, urlopen
import sys

url = sys.argv[1]
try:
    with urlopen(Request(url, headers={"Accept": "application/json,text/html"}), timeout=1.0) as response:
        sys.exit(0 if response.status < 500 else 1)
except Exception:
    sys.exit(1)
PY
}

port_open() {
  local host="$1"
  local port="$2"
  python3 - "$host" "$port" <<'PY' >/dev/null 2>&1
import socket
import sys

host = sys.argv[1]
port = int(sys.argv[2])
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.settimeout(0.3)
    sys.exit(0 if sock.connect_ex((host, port)) == 0 else 1)
PY
}

pid_alive() {
  local pid="$1"
  [[ "$pid" =~ ^[0-9]+$ ]] && ps -p "$pid" >/dev/null 2>&1
}

pid_args_match() {
  local pid="$1"
  local marker="$2"
  pid_alive "$pid" || return 1
  ps -p "$pid" -o args= 2>/dev/null | grep -F "$marker" >/dev/null 2>&1
}

clear_stale_pid() {
  local pid_file="$1"
  local marker="$2"
  [[ -f "$pid_file" ]] || return 0

  local pid
  pid="$(cat "$pid_file" 2>/dev/null || true)"
  if pid_args_match "$pid" "$marker"; then
    return 0
  fi

  log "Removing stale pid file $pid_file (${pid:-empty})."
  rm -f "$pid_file"
}

wait_until_ready() {
  local url="$1"
  local label="$2"
  local deadline
  deadline=$((SECONDS + 30))
  while (( SECONDS < deadline )); do
    if url_ready "$url"; then
      log "$label is ready at $url."
      return 0
    fi
    sleep 0.35
  done
  return 1
}

ensure_dependencies() {
  if [[ ! -d "$ROOT" ]]; then
    die "Repo root was not found at $ROOT"
  fi
  if [[ ! -f "$ROOT/package.json" ]]; then
    die "No package.json found in $ROOT"
  fi
  if [[ ! -x "$ROOT/node_modules/.bin/vite" ]]; then
    log "Installing npm dependencies because node_modules/.bin/vite is missing."
    (cd "$ROOT" && npm install) >> "$APP_LOG" 2>&1 || die "npm install failed; see $APP_LOG"
  fi
}

start_service() {
  local status_url="http://${SERVICE_HOST}:${SERVICE_PORT}/api/status"
  if url_ready "$status_url"; then
    log "Archivist service already running at $status_url."
    return 0
  fi
  if port_open "$SERVICE_HOST" "$SERVICE_PORT"; then
    die "Port $SERVICE_PORT is occupied, but Archivist service is not healthy."
  fi

  clear_stale_pid "$SERVICE_PID_FILE" "archivist_service.py"
  log "Starting Archivist service on ${SERVICE_HOST}:${SERVICE_PORT}."
  (
    cd "$ROOT"
    if command -v setsid >/dev/null 2>&1; then
      nohup setsid env ARCHIVIST_SERVICE_PORT="$SERVICE_PORT" python3 -u service/archivist_service.py \
        </dev/null >> "$SERVICE_LOG" 2>&1 &
    else
      nohup env ARCHIVIST_SERVICE_PORT="$SERVICE_PORT" python3 -u service/archivist_service.py \
        </dev/null >> "$SERVICE_LOG" 2>&1 &
    fi
    printf '%s\n' "$!" > "$SERVICE_PID_FILE"
  )

  wait_until_ready "$status_url" "Archivist service" || die "service did not become ready; see $SERVICE_LOG"
}

start_app() {
  local app_url="http://${APP_HOST}:${APP_PORT}/"
  if url_ready "$app_url"; then
    log "Archivist app already running at $app_url."
    return 0
  fi
  if port_open "$APP_HOST" "$APP_PORT"; then
    die "Port $APP_PORT is occupied, but the Archivist app is not healthy."
  fi

  clear_stale_pid "$APP_PID_FILE" "npm run dev"
  log "Starting Vite app on ${APP_HOST}:${APP_PORT}."
  (
    cd "$ROOT"
    if command -v setsid >/dev/null 2>&1; then
      nohup setsid npm run dev -- --host "$APP_HOST" --port "$APP_PORT" --strictPort \
        </dev/null >> "$APP_LOG" 2>&1 &
    else
      nohup npm run dev -- --host "$APP_HOST" --port "$APP_PORT" --strictPort \
        </dev/null >> "$APP_LOG" 2>&1 &
    fi
    printf '%s\n' "$!" > "$APP_PID_FILE"
  )

  wait_until_ready "$app_url" "Archivist app" || die "Vite app did not become ready; see $APP_LOG"
}

browser_command() {
  if [[ -n "${ARCHIVIST_BROWSER:-}" ]]; then
    printf '%s\n' "$ARCHIVIST_BROWSER"
    return 0
  fi

  local candidate
  for candidate in google-chrome google-chrome-stable chromium chromium-browser microsoft-edge brave-browser; do
    if command -v "$candidate" >/dev/null 2>&1; then
      command -v "$candidate"
      return 0
    fi
  done

  return 1
}

open_browser() {
  local browser
  if browser="$(browser_command)"; then
    log "Opening $APP_URL with $browser."
    "$browser" --new-window "$APP_URL" >/dev/null 2>&1 &
  elif command -v xdg-open >/dev/null 2>&1; then
    log "Opening $APP_URL with xdg-open."
    xdg-open "$APP_URL" >/dev/null 2>&1 &
  else
    die "No browser command found. Open $APP_URL manually."
  fi
}

stop_process() {
  local pid_file="$1"
  local marker="$2"
  local label="$3"
  [[ -f "$pid_file" ]] || return 0

  local pid
  pid="$(cat "$pid_file" 2>/dev/null || true)"
  if pid_args_match "$pid" "$marker"; then
    log "Stopping $label process $pid."
    kill -- "-$pid" >/dev/null 2>&1 || kill "$pid" >/dev/null 2>&1 || true
  fi
  rm -f "$pid_file"
}

show_status() {
  local service_url="http://${SERVICE_HOST}:${SERVICE_PORT}/api/status"
  local app_url="http://${APP_HOST}:${APP_PORT}/"
  if url_ready "$service_url"; then
    printf 'service: ready (%s)\n' "$service_url"
  else
    printf 'service: not ready (%s)\n' "$service_url"
  fi
  if url_ready "$app_url"; then
    printf 'app: ready (%s)\n' "$app_url"
  else
    printf 'app: not ready (%s)\n' "$app_url"
  fi
  printf 'logs: %s\n' "$RUNTIME_DIR"
}

case "${1:-}" in
  --status)
    show_status
    ;;
  --stop)
    stop_process "$APP_PID_FILE" "npm run dev" "Vite app"
    stop_process "$SERVICE_PID_FILE" "archivist_service.py" "Archivist service"
    ;;
  --logs)
    if command -v xdg-open >/dev/null 2>&1; then
      xdg-open "$RUNTIME_DIR" >/dev/null 2>&1 &
    else
      printf '%s\n' "$RUNTIME_DIR"
    fi
    ;;
  --no-open)
    ensure_dependencies
    start_service
    start_app
    show_status
    ;;
  *)
    ensure_dependencies
    start_service
    start_app
    open_browser
    ;;
esac
