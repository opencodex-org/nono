# النطاق المجاني

هذا المجلد يحتوي على كود النشر الفعلي للنطاق المجاني.

## الملفات
- `deploy.sh` — ينشر الموقع إلى فرع GitHub Pages أو فرع استضافة مجانية.
- `vercel.json` — إعدادات Vercel إذا كان المشروع يعمل عليه.
- `.env.example` — متغيرات البيئة المطلوبة.

## الاستخدام
```bash
cp .env.example .env
chmod +x deploy.sh
./deploy.sh
```
