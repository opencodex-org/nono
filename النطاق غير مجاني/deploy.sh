#!/usr/bin/env bash
set -euo pipefail

# اقرأ القيم من متغيرات البيئة أو من ملف .env
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

DOMAIN="${DOMAIN:?يرجى تحديد DOMAIN في ملف .env}"
HOST="${HOST:?يرجى تحديد HOST في ملف .env}"
USER="${USER:?يرجى تحديد USER في ملف .env}"
APP_DIR="${APP_DIR:-/var/www/$DOMAIN}"

if [ ! -d dist ]; then
  echo "مجلد dist غير موجود. قم ببناء المشروع أولاً."
  exit 1
fi

echo "بدء النشر لـ: $DOMAIN"
ssh "$USER@$HOST" "mkdir -p '$APP_DIR'"
rsync -avz --delete dist/ "$USER@$HOST:$APP_DIR/"

ssh "$USER@$HOST" "cat > /etc/nginx/conf.d/${DOMAIN}.conf <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    root $APP_DIR;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
sudo nginx -t
sudo systemctl reload nginx"

echo "تم النشر على النطاق غير المجاني: $DOMAIN"
