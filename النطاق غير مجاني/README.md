# النطاق غير مجاني

هذا المجلد يحتوي على كود النشر الفعلي لنطاق مدفوع.

## الملفات
- `deploy.sh` — ينشر الموقع على خادم VPS أو Linux عبر SSH وrsync.
- `nginx.conf` — إعدادات خادم Nginx.
- `.env.example` — متغيرات البيئة المطلوبة.

## الاستخدام
```bash
cp .env.example .env
chmod +x deploy.sh
./deploy.sh
```
