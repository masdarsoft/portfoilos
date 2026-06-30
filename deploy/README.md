# Rowejly — VPS Deployment Guide

**Server**: Hostinger VPS, `rowejly.com` (`72.61.193.157`)  
**Stack**: Nginx → Next.js (PM2, :3000) + Django/Gunicorn (systemd, :8000) + Redis  

---

## Architecture

```
Browser ──HTTPS──► Nginx (:443)
                     ├── /api/*  → Gunicorn (:8000) → Django
                     └── /*      → Next.js  (:3000)
```

---

## Part 1 — First-Time Server Setup

SSH into the VPS as root:
```bash
ssh root@72.61.193.157
```

### 1.1 Create a deploy user

```bash
adduser rowejly
usermod -aG sudo rowejly
# Switch to the deploy user for all remaining steps
su - rowejly
```

### 1.2 Install system packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y \
    git nginx redis-server \
    python3.11 python3.11-venv python3-pip \
    curl build-essential
```

### 1.3 Install Node.js 20 + pnpm

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g pnpm pm2
```

### 1.4 Enable & start Redis

```bash
sudo systemctl enable redis-server
sudo systemctl start redis-server
redis-cli ping   # Should print PONG
```

---

## Part 2 — Deploy the Application

### 2.1 Clone the repository

```bash
cd /home/rowejly
git clone https://github.com/YOUR_USERNAME/ads_management.git
cd ads_management
```

### 2.2 Create Python virtual environment

```bash
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt
```

### 2.3 Configure backend secrets

```bash
# Copy the production env template and fill in all values
cp backend/.env.production backend/.env.production.bak
nano backend/.env.production
```

**Required values to fill in:**
- `SECRET_KEY` — generate with:  
  `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
- `FIELD_ENCRYPTION_KEY` — generate with:  
  `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`
- All platform API keys (Meta, Google, TikTok, Snapchat, X)

### 2.4 Configure frontend secrets

```bash
nano frontend/.env.production
# Set NEXT_PUBLIC_GOOGLE_CLIENT_ID to your real value
```

### 2.5 Run Django setup

```bash
cd backend
DJANGO_SETTINGS_MODULE=config.settings.production python manage.py migrate --noinput
DJANGO_SETTINGS_MODULE=config.settings.production python manage.py collectstatic --noinput
DJANGO_SETTINGS_MODULE=config.settings.production python manage.py createsuperuser
cd ..
```

### 2.6 Build the frontend

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm build
cd ..
```

---

## Part 3 — Configure Services

### 3.1 Install Gunicorn systemd service

```bash
sudo cp deploy/rowejly-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable rowejly-backend
sudo systemctl start rowejly-backend
sudo systemctl status rowejly-backend    # Should be "active (running)"
```

### 3.2 Create log directory

```bash
sudo mkdir -p /var/log/rowejly
sudo chown www-data:www-data /var/log/rowejly
```

### 3.3 Configure Nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/rowejly
sudo ln -s /etc/nginx/sites-available/rowejly /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default    # Remove default site
sudo nginx -t                                   # Validate config
sudo systemctl reload nginx
```

### 3.4 Install SSL certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d rowejly.com -d www.rowejly.com
# Follow the prompts — Certbot will auto-update nginx.conf with SSL paths
sudo systemctl reload nginx
```

### 3.5 Start Next.js with PM2

```bash
cd /home/rowejly/ads_management
pm2 start deploy/ecosystem.config.js --env production
pm2 save
pm2 startup   # Copy and run the printed command to enable auto-start
```

---

## Part 4 — Verify the Deployment

```bash
# 1. Gunicorn alive?
sudo systemctl is-active rowejly-backend

# 2. Next.js alive?
pm2 status

# 3. Nginx config valid?
sudo nginx -t

# 4. Django responds?
curl http://localhost:8000/api/v1/health/

# 5. Next.js responds?
curl http://localhost:3000

# 6. Through Nginx over HTTPS?
curl https://rowejly.com/api/v1/health/
```

Visit **https://rowejly.com** — the landing page should load immediately.

---

## Part 5 — Ongoing Deployments

After the first-time setup, all future deploys are a single command:

```bash
ssh rowejly@72.61.193.157
cd /home/rowejly/ads_management
./deploy/deploy.sh
```

---

## Part 6 — Troubleshooting

| Problem | Command to investigate |
|---------|------------------------|
| Gunicorn not starting | `sudo journalctl -u rowejly-backend -n 50` |
| Next.js crashed | `pm2 logs rowejly-frontend --lines 50` |
| Nginx error | `sudo tail -f /var/log/nginx/error.log` |
| Django 500 errors | `sudo tail -f /var/log/rowejly/gunicorn-error.log` |
| SSL certificate issue | `sudo certbot renew --dry-run` |

---

## Platform OAuth Callback URLs to Update

After going live, update your OAuth redirect URIs in each platform's developer console:

| Platform | Old (dev) | New (production) |
|----------|-----------|------------------|
| Meta | `https://localhost:8000/api/v1/meta/oauth/callback/` | `https://rowejly.com/api/v1/meta/oauth/callback/` |
| Google | `https://localhost:8000/api/v1/google/oauth/callback/` | `https://rowejly.com/api/v1/google/oauth/callback/` |
| TikTok | `https://localhost:8000/api/v1/tiktok/oauth/callback/` | `https://rowejly.com/api/v1/tiktok/oauth/callback/` |
| Snapchat | `https://localhost:8000/api/v1/snapchat/oauth/callback/` | `https://rowejly.com/api/v1/snapchat/oauth/callback/` |
| X (Twitter) | `https://localhost:8000/api/v1/x/oauth/callback/` | `https://rowejly.com/api/v1/x/oauth/callback/` |

---

## Development vs Production Summary

| Setting | Development (local) | Production (VPS) |
|---------|--------------------|--------------------|
| Django settings | `config.settings.development` | `config.settings.production` |
| Frontend API URL | `https://localhost:8000/api/v1` | `https://rowejly.com/api/v1` |
| Debug mode | `True` | `False` |
| SSL | mkcert self-signed | Let's Encrypt |
| Process manager | `python manage.py runsslserver` | Gunicorn + systemd |
| Frontend runner | `next dev --experimental-https` | `next start` (PM2) |
| `.env` file | `backend/.env` | `backend/.env.production` |
