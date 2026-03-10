# GitHub Pages Deployment Guide

## خطوات النشر على GitHub Pages

### 1. إنشاء مستودع GitHub

1. اذهب إلى [GitHub](https://github.com)
2. سجل دخولك (أو أنشئ حساباً جديداً)
3. انقر على **New** (أو +) > **New repository**
4. سمّ المستودع: `freelance-os`
5. اجعله **Public** (أو Private إذا كان لديك Pro)
6. لا تضف README أو .gitignore
7. انقر على **Create repository**

### 2. رفع الكود إلى GitHub

#### الخيار أ: باستخدام سطر الأوامر

```bash
# في مجلد المشروع
cd freelance-os

# تهيئة Git
git init

# إضافة جميع الملفات
git add .

# عمل commit
git commit -m "Initial commit - Freelance OS MVP"

# إضافة remote
git remote add origin https://github.com/YOUR_USERNAME/freelance-os.git

# رفع الكود
git push -u origin main
```

#### الخيار ب: رفع الملفات مباشرة

1. في صفحة المستودع الجديد، انقر على **uploading an existing file**
2. اسحب وأفلت جميع ملفات المشروع (باستثناء node_modules)
3. انقر على **Commit changes**

### 3. إعداد GitHub Pages

1. في المستودع، اذهب إلى **Settings** > **Pages**
2. في قسم "Build and deployment":
   - Source: **GitHub Actions**
3. أو إذا كنت تفضل النشر من الفرع:
   - Source: **Deploy from a branch**
   - Branch: **main** / **root**
   - انقر على **Save**

### 4. إعداد GitHub Actions (اختياري - للبناء التلقائي)

1. في المستودع، اذهب إلى **Actions** > **New workflow**
2. اختر "set up a workflow yourself"
3. الصق هذا الكود:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_GAS_WEB_APP_URL: ${{ secrets.VITE_GAS_WEB_APP_URL }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

4. انقر على **Commit changes**

### 5. إضافة Secret (لـ GitHub Actions)

1. في المستودع، اذهب إلى **Settings** > **Secrets and variables** > **Actions**
2. انقر على **New repository secret**
3. الاسم: `VITE_GAS_WEB_APP_URL`
4. القيمة: رابط Google Apps Script Web App URL
5. انقر على **Add secret**

### 6. البناء محلياً ورفعه

إذا كنت تفضل البناء محلياً:

```bash
# في مجلد المشروع

# تثبيت التبعيات
npm install

# إنشاء ملف .env
echo "VITE_GAS_WEB_APP_URL=your_web_app_url_here" > .env

# بناء المشروع
npm run build

# رفع مجلد dist إلى فرع gh-pages
npm run deploy
```

**ملاحظة**: يجب تثبيت `gh-pages`:
```bash
npm install --save-dev gh-pages
```

وإضافة هذا إلى `package.json`:
```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

### 7. التحقق من النشر

1. اذهب إلى **Settings** > **Pages**
2. انتظر حتى تكتمل البناء (قد يستغرق بضع دقائق)
3. انقر على الرابط المعروض
4. يجب أن ترى تطبيق Freelance OS يعمل

### 8. تحديث الموقع

#### إذا كنت تستخدم GitHub Actions:

كلما دفعت تغييرات إلى الفرع `main`، سيتم إعادة البناء والنشر تلقائياً.

```bash
git add .
git commit -m "Update description"
git push
```

#### إذا كنت تبني محلياً:

```bash
npm run build
npm run deploy
```

## استكشاف الأخطاء

### الصفحة فارغة (بيضاء)

- افتح Console في المتصفح (F12 > Console)
- تحقق من وجود أخطاء
- تأكد من أن `base` في `vite.config.ts` مضبوط على `'./'`
- تأكد من أن جميع المسارات نسبية

### خطأ 404

- تأكد من أن المستودع عام (Public)
- انتظر بضع دقائق بعد النشر
- تحقق من إعدادات GitHub Pages

### خطأ CORS

- تأكد من أن Google Apps Script يحتوي على CORS headers
- تحقق من Web App URL في الإعدادات

### البيانات لا تظهر

- تأكد من إضافة Web App URL الصحيح
- افتح Console وتحقق من أخطاء الشبكة
- جرب فتح Web App URL مباشرة في المتصفح

## نصائح

1. **استخدم نطاق مخصص** (اختياري):
   - يمكنك ربط نطاق خاص بـ GitHub Pages
   - اذهب إلى Settings > Pages > Custom domain

2. **تفعيل HTTPS**:
   - GitHub Pages يدعم HTTPS تلقائياً
   - تأكد من تفعيل "Enforce HTTPS"

3. **النسخ الاحتياطي**:
   - احتفظ بنسخة من Google Sheets
   - صدّر البيانات بشكل دوري

## تهانينا!

تم نشر Freelance OS بنجاح على GitHub Pages!

---

# GitHub Pages Deployment Guide (English)

## Steps to Deploy to GitHub Pages

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com)
2. Sign in (or create a new account)
3. Click **New** (or +) > **New repository**
4. Name it: `freelance-os`
5. Make it **Public** (or Private if you have Pro)
6. Don't add README or .gitignore
7. Click **Create repository**

### 2. Push Code to GitHub

#### Option A: Using Command Line

```bash
# In the project folder
cd freelance-os

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Freelance OS MVP"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/freelance-os.git

# Push code
git push -u origin main
```

#### Option B: Upload Files Directly

1. On the new repository page, click **uploading an existing file**
2. Drag and drop all project files (except node_modules)
3. Click **Commit changes**

### 3. Configure GitHub Pages

1. In the repository, go to **Settings** > **Pages**
2. In the "Build and deployment" section:
   - Source: **GitHub Actions**
3. Or if you prefer deploying from branch:
   - Source: **Deploy from a branch**
   - Branch: **main** / **root**
   - Click **Save**

### 4. Setup GitHub Actions (Optional - for automatic builds)

Follow the steps shown above to create a GitHub Actions workflow.

### 5. Add Secret (for GitHub Actions)

1. In the repository, go to **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Name: `VITE_GAS_WEB_APP_URL`
4. Value: Your Google Apps Script Web App URL
5. Click **Add secret**

### 6. Build Locally and Deploy

If you prefer building locally, follow the commands shown above.

### 7. Verify Deployment

1. Go to **Settings** > **Pages**
2. Wait for the build to complete (may take a few minutes)
3. Click on the displayed link
4. You should see the Freelance OS app running

### 8. Update the Site

#### If using GitHub Actions:

Every time you push changes to the `main` branch, it will rebuild and deploy automatically.

```bash
git add .
git commit -m "Update description"
git push
```

#### If building locally:

```bash
npm run build
npm run deploy
```

## Troubleshooting

### Blank Page (White)

- Open Console in browser (F12 > Console)
- Check for errors
- Make sure `base` in `vite.config.ts` is set to `'./'`
- Make sure all paths are relative

### 404 Error

- Make sure the repository is Public
- Wait a few minutes after deployment
- Check GitHub Pages settings

### CORS Error

- Make sure Google Apps Script has CORS headers
- Check Web App URL in settings

### Data Not Showing

- Make sure the correct Web App URL is added
- Open Console and check network errors
- Try opening Web App URL directly in browser

## Tips

1. **Use a custom domain** (optional):
   - You can link a custom domain to GitHub Pages
   - Go to Settings > Pages > Custom domain

2. **Enable HTTPS**:
   - GitHub Pages supports HTTPS automatically
   - Make sure "Enforce HTTPS" is enabled

3. **Backup**:
   - Keep a backup of your Google Sheets
   - Export data periodically

## Congratulations!

Freelance OS has been successfully deployed to GitHub Pages!
