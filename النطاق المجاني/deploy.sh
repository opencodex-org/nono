#!/usr/bin/env bash
set -euo pipefail

if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

REPOSITORY="${REPOSITORY:?يرجى تحديد REPOSITORY في ملف .env}"
BRANCH="${BRANCH:-gh-pages}"

if [ ! -d dist ]; then
  echo "مجلد dist غير موجود. قم ببناء المشروع أولاً."
  exit 1
fi

echo "بدء النشر على النطاق المجاني"
rm -rf /tmp/free-domain-deploy

git clone --depth 1 "$REPOSITORY" /tmp/free-domain-deploy
cd /tmp/free-domain-deploy

git checkout --orphan "$BRANCH" 2>/dev/null || git checkout "$BRANCH"
find . -mindepth 1 -maxdepth 1 ! -name ".git" -exec rm -rf {} +
cp -R "$OLDPWD/dist/." .

git add -A
git commit -m "deploy: publish free domain" || true
git push origin "$BRANCH" --force

echo "تم النشر على النطاق المجاني عبر الفرع: $BRANCH"
