#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# deploy/deploy.sh  —  Run on the VPS to deploy the latest code
#
# Usage:
#   chmod +x deploy/deploy.sh
#   ./deploy/deploy.sh
#
# Prerequisites (see deploy/README.md for first-time setup):
#   - Python venv at /home/portfoilos/portfoilos/portfoilo_tenant_server/venv
#   - pnpm installed globally
#   - PM2 installed globally (npm i -g pm2)
#   - /home/portfoilos/portfoilos/portfoilo_tenant_server/.env.production filled out
#   - /home/portfoilos/portfoilos/templates/template_1_malakparites/.env.production filled out
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_DIR="/home/portfoilos/portfoilos"
BACKEND_DIR="$REPO_DIR/portfoilo_tenant_server"
FRONTEND_DIR="$REPO_DIR/templates/template_1_malakparites"
VENV_DIR="$BACKEND_DIR/.venv"
LOG_DIR="/var/log/portfoilos"

echo ""
echo "════════════════════════════════════════════"
echo "  Portfoilos — VPS Deploy Script"
echo "════════════════════════════════════════════"
echo ""

# ── 1. Pull latest code ───────────────────────────────────────────────────────
echo "[1/7] Pulling latest code from git..."
cd "$REPO_DIR"
git pull origin main

# ── 2. Backend — install Python deps ─────────────────────────────────────────
echo "[2/7] Installing Python dependencies with uv..."
if ! command -v uv &> /dev/null; then
  echo "  Installing uv..."
  curl -LsSf https://astral.sh/uv/install.sh | sh
  # Ensure uv is in the path for this execution
  export PATH="$HOME/.local/bin:$PATH"
fi
cd "$BACKEND_DIR"
uv sync --frozen

# ── 3. Backend — run migrations ───────────────────────────────────────────────
echo "[3/7] Running database migrations..."
cd "$BACKEND_DIR"
DJANGO_SETTINGS_MODULE=config.settings.production \
  "$VENV_DIR/bin/python" manage.py migrate --noinput

# ── 4. Backend — collect static files ────────────────────────────────────────
echo "[4/7] Collecting static files..."
DJANGO_SETTINGS_MODULE=config.settings.production \
  "$VENV_DIR/bin/python" manage.py collectstatic --noinput --clear

# ── 5. Backend — restart Gunicorn ─────────────────────────────────────────────
echo "[5/7] Restarting Gunicorn (portfoilos-backend.service)..."
sudo systemctl restart portfoilos-backend
sudo systemctl is-active --quiet portfoilos-backend && echo "  ✓ Gunicorn is running" || echo "  ✗ Gunicorn failed — check: sudo journalctl -u portfoilos-backend -n 30"

# ── 6. Frontend — install deps + build ────────────────────────────────────────
echo "[6/7] Building Next.js frontend..."
cd "$FRONTEND_DIR"
pnpm install --frozen-lockfile
pnpm build

# ── 7. Frontend — restart PM2 ────────────────────────────────────────────────
echo "[7/7] Restarting Next.js via PM2..."
if pm2 list | grep -q "portfoilos-frontend"; then
  pm2 restart portfoilos-frontend
else
  pm2 start "$REPO_DIR/deploy/ecosystem.config.js" --env production
  pm2 save
fi

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════"
echo "  Deploy complete!"
echo "  Backend:  https://malakparties.com/api/v1/"
echo "  Frontend: https://malakparties.com"
echo "════════════════════════════════════════════"
echo ""

# Create log directory if it does not exist
sudo mkdir -p "$LOG_DIR"
sudo chown -R portfoilos:www-data "$LOG_DIR"
chmod -R 775 "$LOG_DIR"
