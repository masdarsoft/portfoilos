# 🚀 Portfoilos — Full VPS Deployment & Reference Guide

This document serves as the definitive deployment blueprint and operational reference for **Portfoilos / Malak Parties** on your Hostinger VPS.

---

## 📊 Infrastructure Overview

The application architecture on the VPS is configured as follows:

```
                          [ Internet Traffic (HTTPS) ]
                                       │
                                       ▼
                              Nginx (Port 80/443)
                                 ┌──────┴──────┐
             (Routes /api/* & /admin/*) │             │ (Routes all other paths /*)
                                 ▼             ▼
                         Gunicorn:8000    Next.js:3000
                        (Django Backend) (PM2 Frontend)
                                 │
                                 ▼
                           SQLite / Redis
```

| Service | Internal Port | Managed By | Log File Locations |
| :--- | :--- | :--- | :--- |
| **Nginx** | `80` / `443` | `systemd` | `/var/log/nginx/error.log` <br> `/var/log/nginx/access.log` |
| **Gunicorn (Django)** | `8000` | `systemd` | `/var/log/portfoilos/gunicorn-error.log` <br> `/var/log/portfoilos/gunicorn-access.log` |
| **Next.js (Frontend)** | `3000` | `PM2` | `/var/log/portfoilos/nextjs-error.log` <br> `/var/log/portfoilos/nextjs-out.log` |
| **Redis Server** | `6379` | `systemd` | System logs |

---

## 🛠️ Phase 1 — Initial Server Preparation (Run as `root`)

### Step 1: Connect to the VPS
Open your local terminal (PowerShell or Command Prompt) and connect as the administrative root user:
```bash
ssh root@72.61.193.157
```

### Step 2: Install System Packages
Update the package manager repository and install all required runtimes, web servers, and databases:
```bash
# Update system repositories
apt update && apt upgrade -y

# Install essential compilation and network utilities
apt install -y git curl build-essential nginx redis-server ufw rsync

# Install Python 3 and Virtual Environment packages
apt install -y python3 python3-venv python3-pip

# Install Node.js (Version 20.x)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install pnpm and PM2 globally
npm install -g pnpm pm2
```

---

## 👤 Phase 2 — Secure Deployment User (Run as `root`)

### Step 3: Create the Restricted `portfoilos` User
To secure the server, create a dedicated non-root user and grant it administrative privileges via `sudo`:
```bash
# Create the user (enter a secure password and press Enter to skip optional fields)
# Note: User name MUST be 'portfoilos' to match project paths
adduser portfoilos

# Grant sudo privileges
usermod -aG sudo portfoilos

# Switch to the new user session
su - portfoilos
```
> [!IMPORTANT]
> **Always perform all subsequent development, cloning, and service runs under the `portfoilos` user.** Do not run application code as `root`.

---

## 🔑 Phase 3 — Repository Setup & Authentication (Run as `portfoilos`)

### Step 4: Generate SSH Deploy Keys
Because your GitHub repository is private, you must grant the VPS secure, read-only access:

1. **Generate the key pair:**
   ```bash
   ssh-keygen -t ed25519 -C "vps@malakparties.com"
   ```
   *Press **Enter** to accept the default file path, and press **Enter** twice to skip the passphrase.*

2. **Retrieve the public key:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   *Copy the entire output string (starting with `ssh-ed25519`).*

3. **Register the Deploy Key on GitHub:**
   * Go to your repository: `https://github.com/masdarsoft/portfoilos`.
   * Click **Settings** (top navigation bar) ➔ **Deploy keys** (left sidebar) ➔ **Add deploy key**.
   * Set the title to `Hostinger VPS` and paste your public key. Leave "Allow write access" unchecked.
   * Click **Add key**.

### Step 5: Clone the Repository
Clone the repository using the SSH URL into the home directory:
```bash
cd /home/portfoilos
git clone git@github.com:masdarsoft/portfoilos.git
cd portfoilos
```

---

## 🔄 Phase 4 — Upload Existing Local Database and Media Files

> [!IMPORTANT]
> To ensure that you don't lose any data or have to re-enter media/content, we will copy your local SQLite database (`db.sqlite3`) and Next.js frontend media assets directly to the VPS using `rsync` before setting up the services.

Run these commands **from your local Windows machine** in PowerShell or Git Bash:

### 1. Upload the Local SQLite Database
This copies your database exactly as it is now to the server:
```powershell
rsync -avz --progress "C:/Users/Ramzi/Desktop/Nejed/portfoilo/portfoilo_tenant_server/db.sqlite3" portfoilos@72.61.193.157:/home/portfoilos/portfoilos/portfoilo_tenant_server/
```

### 2. Upload Django Backend Media Files
```powershell
rsync -avz --progress "C:/Users/Ramzi/Desktop/Nejed/portfoilo/portfoilo_tenant_server/media/" portfoilos@72.61.193.157:/home/portfoilos/portfoilos/portfoilo_tenant_server/media/
```

### 3. Upload Next.js Frontend Public/Media Assets (Including Drone Videos)
```powershell
rsync -avz --progress "C:/Users/Ramzi/Desktop/Nejed/portfoilo/templates/template_1_malakparites/public/malakparties/" portfoilos@72.61.193.157:/home/portfoilos/portfoilos/templates/template_1_malakparites/public/malakparties/
```

---

## 🐍 Phase 5 — Backend Configuration (Run as `portfoilos`)

### Step 6: Install `uv` and Sync Dependencies
Install `uv` and synchronise backend dependencies using your `uv.lock` file (this automatically creates a `.venv` directory):
```bash
cd /home/portfoilos/portfoilos/portfoilo_tenant_server

# Install uv for the portfoilos user if it's not installed
if ! command -v uv &> /dev/null; then
  curl -LsSf https://astral.sh/uv/install.sh | sh
  source $HOME/.local/bin/env
fi

# Sync dependencies using the lockfile (creates .venv)
uv sync --frozen
```

### Step 7: Configure Production Secrets
1. Create the production environment file:
   ```bash
   cp .env /home/portfoilos/portfoilos/portfoilo_tenant_server/.env
   chmod 600 .env
   ```
2. Open the file:
   ```bash
   nano .env
   ```
3. Update the production values:
   * **`DEBUG`**: Set to `False`
   * **`ALLOWED_HOSTS`**: `72.61.193.157,malakparties.com,www.malakparties.com`
   * Make sure `DATABASE_URL` or database configuration points to the uploaded `db.sqlite3`.
   * *Save and exit (Ctrl+O ➔ Enter ➔ Ctrl+X).*

### Step 8: Database Migrations & Static Files Collection
Run Django administrative commands via `uv run` to prepare the database and collect admin CSS/JS assets:
```bash
export DJANGO_SETTINGS_MODULE=config.settings.production

# Apply any pending database migrations
uv run python manage.py migrate --noinput

# Collect static files
uv run python manage.py collectstatic --noinput --clear
```

---

## ⚛️ Phase 6 — Frontend Configuration (Run as `portfoilos`)

### Step 9: Install Dependencies & Build
Prepare the Next.js environment and compile the production bundle:
```bash
cd /home/portfoilos/portfoilos/templates/template_1_malakparites

# Install dependencies using lockfile
pnpm install --frozen-lockfile

# Compile the application
pnpm build
```

---

## ⚙️ Phase 7 — Process Management & Services

### Step 10: Configure Gunicorn (Django Backend)
Gunicorn is managed by `systemd` to run in the background and restart automatically on failures.

1. **Create log directory with correct permissions:**
   ```bash
   sudo mkdir -p /var/log/portfoilos
   sudo chown -R portfoilos:www-data /var/log/portfoilos
   sudo chmod -R 775 /var/log/portfoilos
   ```

2. **Install the service file:**
   Copy the systemd unit file from your deploy folder:
   ```bash
   sudo cp /home/portfoilos/portfoilos/deploy/portfoilos-backend.service /etc/systemd/system/portfoilos-backend.service
   ```

3. **Start and enable Gunicorn:**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable portfoilos-backend
   sudo systemctl start portfoilos-backend
   ```

---

### Step 11: Configure PM2 (Next.js Frontend)
PM2 manages the Next.js Node process.

1. **Start the frontend and enable boot persistence:**
   ```bash
   cd /home/portfoilos/portfoilos
   
   # Start the app
   pm2 start deploy/ecosystem.config.js --env production
   
   # Save process list
   pm2 save
   
   # Setup system startup script
   pm2 startup
   ```
   *Note: Run the exact `sudo env PATH=...` command printed by `pm2 startup` in your terminal.*

---

## 🌐 Phase 8 — Web Server & Security (Run as `portfoilos`)

### Step 12: Configure Nginx Reverse Proxy
1. **Link and enable the Nginx configuration file:**
   ```bash
   sudo cp /home/portfoilos/portfoilos/deploy/nginx.conf /etc/nginx/sites-available/portfoilos
   sudo ln -s /etc/nginx/sites-available/portfoilos /etc/nginx/sites-enabled/
   
   # Remove default Nginx site configuration
   sudo rm -f /etc/nginx/sites-enabled/default
   
   # Test Nginx syntax
   sudo nginx -t
   
   # Reload Nginx
   sudo systemctl reload nginx
   ```

### Step 13: Install SSL Certificates (HTTPS)
Use Certbot to request a Let's Encrypt certificate and automatically upgrade Nginx to HTTPS:
```bash
# Install Certbot Nginx plugin
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate and configure HTTPS redirect
sudo certbot --nginx -d malakparties.com -d www.malakparties.com
```
*Follow the prompts (enter your email, accept terms). Certbot will modify your `/etc/nginx/sites-available/portfoilos` configuration to implement SSL.*

### Step 14: Configure Firewall (UFW)
Restrict all ports except SSH, HTTP, and HTTPS:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 🔄 Phase 9 — Future Deployments (After First Setup)

To update the website with new code changes, log in as `portfoilos` and run the automation script:
```bash
ssh portfoilos@72.61.193.157
cd /home/portfoilos/portfoilos
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

The script automatically pulls the latest code from Git, updates dependencies, runs migrations, compiles Next.js, and restarts all Gunicorn/PM2 services safely.

---

## 🔍 Troubleshooting Commands

### 1. Monitor Django (Gunicorn) Logs
```bash
# Check service status
sudo systemctl status portfoilos-backend

# Follow live systemd logs
sudo journalctl -u portfoilos-backend -n 50 -f

# Follow Gunicorn error files
sudo tail -f /var/log/portfoilos/gunicorn-access.log
```

### 2. Monitor Next.js (PM2) Logs
```bash
# Check PM2 processes
pm2 status

# Follow Next.js logs
pm2 logs portfoilos-frontend

# Read error output log
tail -n 100 /var/log/portfoilos/nextjs-error.log
```

### 3. Monitor Nginx Logs
```bash
# Test Nginx configuration files
sudo nginx -t

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```
