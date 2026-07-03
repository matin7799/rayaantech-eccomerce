#!/usr/bin/env bash

# =============================================================================
# Rayan Tech Production VPS Provisioning & Deployment Automation Script
# Designed for ArvanCloud Ubuntu-based VPS (Zero-Trust Isolation)
# =============================================================================

set -euo pipefail

# Invariants Check: Require root execution
if [ "$EUID" -ne 0 ]; then
  echo "Error: Please run this script as root (e.g. sudo ./deploy.sh)"
  exit 1
fi

# Invariants Check: Require production env file
if [ ! -f .env.production ]; then
  echo "Error: .env.production file is missing!"
  echo "Please place the root .env.production file with secure production secrets in the workspace root."
  exit 1
fi

# Load production env variables early so they are available for compose evaluation and migrations
export $(grep -v '^#' .env.production | xargs)


echo "=== 1. System Package Update ==="
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git ufw openssl

# === 2. Docker & Docker Compose Installation ===
if ! command -v docker &> /dev/null; then
  echo "Installing Docker Engine..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm get-docker.sh
fi

if ! docker compose version &> /dev/null; then
  echo "Installing Docker Compose Plugin..."
  apt-get install -y docker-compose-plugin
fi

# === 3. Node.js & pnpm Installation (For host-level db:push) ===
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'.' -f1)" != "v22" ]; then
  echo "Installing/Upgrading Node.js to v22..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

if ! command -v pnpm &> /dev/null; then
  echo "Installing pnpm..."
  npm install -g pnpm@11.8.0
fi

# === 4. Firewall (UFW) Security Sealing ===
echo "Configuring firewall protections..."
# Detect active SSH port from sshd config
SSH_PORT=$(grep -Ei '^port\s+[0-9]+' /etc/ssh/sshd_config | awk '{print $2}' || echo "22")
SSH_PORT=${SSH_PORT:-22}

# Reset rules
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Allow only web gateway and secure SSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow "$SSH_PORT"/tcp

# Explicitly block external DB/Cache queries (just in case)
ufw deny 5432/tcp
ufw deny 6379/tcp
ufw deny 9092/tcp

ufw --force enable
echo "UFW Firewall enabled: Only Ports 80, 443, and SSH ($SSH_PORT) are permitted."

# === 5. Directory Persistence Setup ===
echo "Creating persistence mount points on physical disk..."
mkdir -p /var/lib/rayantech/pgdata
mkdir -p /var/lib/rayantech/redisdata
mkdir -p /var/lib/rayantech/zkdata
mkdir -p /var/lib/rayantech/zklog
mkdir -p /var/lib/rayantech/kafkadata
mkdir -p /var/lib/rayantech/nginx/logs
mkdir -p /var/lib/rayantech/ssl

# Guarantee correct permissions for stateful layers
chmod 700 /var/lib/rayantech/pgdata

# === 6. Bootstrap SSL Configuration ===
if [ ! -f /var/lib/rayantech/ssl/rayantech.crt ]; then
  echo "Generating temporary self-signed SSL certificate for initial bootstrap..."
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /var/lib/rayantech/ssl/rayantech.key \
    -out /var/lib/rayantech/ssl/rayantech.crt \
    -subj "/C=IR/ST=Tehran/L=Tehran/O=RayanTech/CN=localhost"
  echo "Temporary certificates generated successfully."
fi

# === 7. Code Updates ===
echo "Pulling latest main branch commits..."
if [ -d .git ]; then
  git pull origin main || echo "Git pull warning: ensure credentials and branch match."
fi

# Install dependencies on host for DB migration client
pnpm install --frozen-lockfile

# === 8. Bootstrap Database & Migration ===
echo "Spinning up PostgreSQL stateful layer..."
docker compose -f docker-compose.prod.yml up -d rt-postgres

echo "Waiting for PostgreSQL to pass healthchecks..."
until [ "$(docker inspect -f '{{.State.Health.Status}}' rt-postgres)" = "healthy" ]; do
  sleep 2
  echo -n "."
done
echo "PostgreSQL is online and healthy!"

# Load production env variables for host database client execution
echo "Running database schema migrations..."
# Direct migrations push from host to local port-forwarded DB (override host target)
export DATABASE_URL=$(echo "$DATABASE_URL" | sed 's/@rt-postgres/@127.0.0.1/')
if ! pnpm db:push; then
  echo "Error: Database migration push failed."
  echo "=== PostgreSQL Container Logs ==="
  docker logs rt-postgres --tail 50
  exit 1
fi

# === 9. Full Production Service Build & Deploy ===
echo "Building docker images locally without utilizing stale cache layers..."
docker compose -f docker-compose.prod.yml build --no-cache

echo "Launching complete production monorepo stack..."
docker compose -f docker-compose.prod.yml up -d --remove-orphans

echo "=== Deployment Finished Successfully ==="
docker compose -f docker-compose.prod.yml ps
