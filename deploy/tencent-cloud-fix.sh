#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/laonanren52-cell/personal-.git"
DEFAULT_DIR="/var/www/personal-"
APP_DIR="${APP_DIR:-$DEFAULT_DIR}"
NGINX_CONF="/etc/nginx/conf.d/personal-.conf"

echo "== Tencent Cloud deploy check =="
echo "Current directory:"
pwd
echo
echo "Current files:"
ls -la
echo

if [ ! -d "$APP_DIR/.git" ]; then
  echo "Project not found at $APP_DIR. Cloning..."
  sudo mkdir -p "$(dirname "$APP_DIR")"
  sudo chown -R "$USER":"$USER" "$(dirname "$APP_DIR")"
  git clone "$REPO_URL" "$APP_DIR"
else
  echo "Project found at $APP_DIR. Pulling latest main..."
  cd "$APP_DIR"
  git fetch origin main
  git checkout main
  git pull --ff-only origin main
fi

cd "$APP_DIR"
echo
echo "Project path:"
pwd
echo
echo "Project files:"
ls -la
echo

if [ ! -f package.json ]; then
  echo "ERROR: package.json not found in $(pwd)"
  exit 1
fi

if [ ! -f dist/index.html ]; then
  echo "dist/index.html not found. Installing dependencies and building..."
  npm install
  EXPO_NO_TELEMETRY=1 npm run build
else
  echo "dist/index.html exists. Rebuilding to ensure latest output..."
  npm install
  EXPO_NO_TELEMETRY=1 npm run build
fi

if [ ! -f dist/index.html ]; then
  echo "ERROR: build finished but dist/index.html is still missing."
  exit 1
fi

DIST_PATH="$(cd dist && pwd)"
echo
echo "Build output verified: $DIST_PATH/index.html"
echo

echo "Existing nginx root entries:"
if command -v nginx >/dev/null 2>&1; then
  sudo nginx -T 2>/tmp/nginx-dump.err | grep -n "root" || true
else
  echo "ERROR: nginx is not installed. Install it with: sudo apt install -y nginx"
  exit 1
fi
echo

echo "Writing nginx config to $NGINX_CONF ..."
sudo tee "$NGINX_CONF" >/dev/null <<EOF
server {
    listen 80;
    server_name _;

    root $DIST_PATH;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|ttf|woff|woff2)$ {
        try_files \$uri =404;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

echo
echo "Testing and reloading nginx..."
sudo nginx -t
sudo systemctl reload nginx

echo
echo "Local HTTP check:"
curl -I http://127.0.0.1

echo
echo "Preview command, if you want to test port 3000 instead:"
echo "  cd $APP_DIR && npm run preview"
echo "  curl -I http://127.0.0.1:3000"
echo
echo "Tencent Cloud security group reminder:"
echo "  - Nginx/public HTTP: open TCP 80"
echo "  - HTTPS: open TCP 443"
echo "  - serve preview: open TCP 3000"
echo
echo "Expected public URL:"
echo "  http://YOUR_PUBLIC_IP"
