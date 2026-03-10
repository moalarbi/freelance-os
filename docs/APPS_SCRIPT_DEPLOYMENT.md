# Google Apps Script Deployment Guide

## خطوات نشر Google Apps Script

### 1. فتح محرر Apps Script

1. في Google Sheets، اذهب إلى: **Extensions** > **Apps Script**
2. سيفتح محرر Apps Script في نافذة جديدة

### 2. إنشاء المشروع

1. في محرر Apps Script، انقر على **Untitled project**
2. سمّ المشروع: "Freelance OS Backend"
3. احذف أي كود افتراضي في الملف

### 3. إضافة الكود

1. افتح ملف `google-apps-script/Code.gs` من هذا المشروع
2. انسخ كل الكود
3. الصقه في محرر Apps Script
4. احفظ المشروع: **Ctrl+S** (أو **Cmd+S** على Mac)

### 4. إعداد الأذونات

1. انقر على **Project Settings** (أيقونة الترس)
2. تأكد من تفعيل "Show "appsscript.json" manifest file in editor"
3. عدل ملف `appsscript.json` ليصبح:

```json
{
  "timeZone": "Asia/Riyadh",
  "dependencies": {},
  "webapp": {
    "access": "ANYONE",
    "executeAs": "USER_DEPLOYING"
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
```

### 5. اختبار الكود

1. في محرر Apps Script، اختر دالة `doGet`
2. انقر على **Run** (زر التشغيل ▶️)
3. في المرة الأولى، سيُطلب منك:
   - مراجعة الأذونات
   - اختر حساب Google
   - انقر على "Advanced" > "Go to Freelance OS Backend (unsafe)"
   - انقر على "Allow"

### 6. النشر كـ Web App

1. انقر على **Deploy** > **New deployment**
2. اختر نوع: **Web app**
3. اضبط الإعدادات:
   - Description: "Freelance OS API v1"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. انقر على **Deploy**
5. في المرة الأولى، سيُطلب منك مراجعة الأذونات مرة أخرى
6. انسخ **Web App URL** - ستحتاجه لاحقاً

### 7. التحقق من النشر

1. افتح Web App URL في متصفح جديد
2. أضف معامل الاستعلام: `?action=getDashboardStats`
3. يجب أن ترى استجابة JSON:

```json
{
  "success": true,
  "data": {
    "clients": { "total": 0, "active": 0 },
    "projects": { "total": 0, "active": 0, "completed": 0, "total_value": 0, "total_paid": 0, "total_remaining": 0 },
    "invoices": { "total": 0, "pending": 0, "overdue": 0, "total_invoiced": 0, "total_due": 0 },
    "payments": { "total": 0 },
    "tasks": { "total": 0, "pending": 0, "in_progress": 0, "completed": 0, "high_priority": 0 },
    "recent": { "projects": [], "invoices": [], "tasks": [] }
  }
}
```

### 8. إعادة النشر بعد التعديلات

عندما تعدل الكود:

1. احفظ التغييرات: **Ctrl+S**
2. انقر على **Deploy** > **Manage deployments**
3. انقر على **Edit** (أيقونة القلم) بجانب النشر الحالي
4. اختر **New version**
5. أضف وصفاً للتغييرات
6. انقر على **Deploy**

**ملاحظة**: قد يستغرق التحديث بضع دقائق حتى ينتشر.

## استكشاف الأخطاء

### خطأ "You do not have permission"

- تأكد من تعيين "Execute as" إلى "Me"
- تأكد من تعيين "Who has access" إلى "Anyone"

### خطأ "Script function not found"

- تأكد من أن اسم الدالة صحيح (doGet, doPost)
- تأكد من حفظ المشروع

### خطأ "Authorization required"

- شغل الكود يدوياً من المحرر أولاً
- وافق على جميع الأذونات المطلوبة

## الخطوة التالية

بعد نشر Apps Script، انتقل إلى:
[GitHub Pages Deployment Guide](GITHUB_PAGES_DEPLOYMENT.md)

---

# Google Apps Script Deployment Guide (English)

## Steps to Deploy Google Apps Script

### 1. Open Apps Script Editor

1. In Google Sheets, go to: **Extensions** > **Apps Script**
2. The Apps Script editor will open in a new window

### 2. Create the Project

1. In the Apps Script editor, click on **Untitled project**
2. Name the project: "Freelance OS Backend"
3. Delete any default code in the file

### 3. Add the Code

1. Open the `google-apps-script/Code.gs` file from this project
2. Copy all the code
3. Paste it into the Apps Script editor
4. Save the project: **Ctrl+S** (or **Cmd+S** on Mac)

### 4. Configure Permissions

1. Click on **Project Settings** (gear icon)
2. Enable "Show "appsscript.json" manifest file in editor"
3. Edit the `appsscript.json` file to match the configuration shown above

### 5. Test the Code

1. In the Apps Script editor, select the `doGet` function
2. Click **Run** (play button ▶️)
3. The first time, you'll be asked to:
   - Review permissions
   - Choose a Google account
   - Click "Advanced" > "Go to Freelance OS Backend (unsafe)"
   - Click "Allow"

### 6. Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Select type: **Web app**
3. Configure settings:
   - Description: "Freelance OS API v1"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. The first time, you'll be asked to review permissions again
6. Copy the **Web App URL** - you'll need it later

### 7. Verify Deployment

1. Open the Web App URL in a new browser tab
2. Add query parameter: `?action=getDashboardStats`
3. You should see a JSON response with dashboard stats

### 8. Redeploy After Changes

When you modify the code:

1. Save changes: **Ctrl+S**
2. Click **Deploy** > **Manage deployments**
3. Click **Edit** (pencil icon) next to the current deployment
4. Select **New version**
5. Add a description of changes
6. Click **Deploy**

**Note**: Updates may take a few minutes to propagate.

## Troubleshooting

### Error "You do not have permission"

- Make sure "Execute as" is set to "Me"
- Make sure "Who has access" is set to "Anyone"

### Error "Script function not found"

- Make sure the function name is correct (doGet, doPost)
- Make sure the project is saved

### Error "Authorization required"

- Run the code manually from the editor first
- Approve all requested permissions

## Next Step

After deploying Apps Script, proceed to:
[GitHub Pages Deployment Guide](GITHUB_PAGES_DEPLOYMENT.md)
