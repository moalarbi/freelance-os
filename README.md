# Freelance OS

نظام إدارة العمل الحر الشخصي - Personal Freelance Operations System

## نظرة عامة

Freelance OS هو نظام تشغيل داخلي للعمل الحر، مصمم للاستخدام الشخصي من قبل مستقل واحد. يوفر إدارة شاملة للعملاء والمشاريع والفواتير والمدفوعات والمهام والمصروفات.

## المميزات

### لوحة التحكم (Dashboard)
- **مؤشرات الأداء الرئيسية**: إجمالي العملاء، المشاريع، المهام، الإيرادات
- **ملخص الأرباح**: إجمالي الإيرادات، المصروفات، صافي الربح
- **رسوم بيانية تفاعلية**:
  - الإيرادات الشهرية (Bar Chart)
  - الإيرادات حسب نوع الخدمة (Pie Chart)
  - توزيع حالات المشاريع (Pie Chart)
- **نظرة مالية شاملة** مع نسبة التحصيل
- **المهام العاجلة** والفواتير المتأخرة

### العملاء (Clients)
- إدارة بيانات العملاء والتواصل
- معلومات الاتصال (هاتف، واتساب، بريد)
- تصنيف العملاء (فرد، شركة، وكالة)
- تتبع مصدر العميل

### المشاريع (Projects)
- **نوع الخدمة**: Marketing Campaign, Content Creation, Shopify Store, Salla Store, Website Development, Consulting, SEO, Automation, Other
- تتبع قيمة المشروع والمدفوعات والمتبقي
- شريط تقدم المشروع (%)
- **صفحة تفاصيل المشروع** مع:
  - معلومات العميل ونوع الخدمة
  - المهام المرتبطة
  - المدفوعات
  - حالة المشروع
- **فلاتر متقدمة**: العميل، نوع الخدمة، الحالة، التاريخ

### الفواتير (Invoices)
- إنشاء وإدارة الفواتير
- حساب الضريبة تلقائياً
- تتبع المبالغ المدفوعة والمستحقة

### المدفوعات (Payments)
- تسجيل المدفوعات وربطها بالفواتير والمشاريع
- **فلاتر**: الشهر، العميل، المشروع
- طرق دفع متعددة

### المهام (Tasks)
- إدارة المهام مع الأولويات
- تتبع المواعيد النهائية
- إكمال المهام بنقرة واحدة

### المصروفات (Expenses) ⭐ جديد
- تتبع مصروفات العمل
- **التصنيفات**: Ads, Tools, Subscriptions, Hosting, Other
- حساب إجمالي المصروفات
- ربط المصروفات بحساب الأرباح

### زر الإضافة السريعة (Quick Add) ⭐ جديد
- زر عائم للإضافة السريعة
- خيارات: عميل، مشروع، دفعة، مهمة، مصروف
- نماذج مبسطة للإضافة السريعة

## التقنية

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Charts**: Recharts
- **Backend**: Google Apps Script Web App
- **Database**: Google Sheets
- **Deployment**: GitHub Pages

## متطلبات التشغيل

- Node.js 18+
- حساب Google
- GitHub account (للنشر)

## التثبيت والتشغيل المحلي

```bash
# استنساخ المشروع
git clone <repository-url>
cd freelance-os

# تثبيت التبعيات
npm install

# تشغيل خادم التطوير
npm run dev
```

## الإعداد

### 1. إعداد Google Sheets

1. أنشئ Google Sheet جديد
2. أنشئ الأوراق التالية:
   - Clients
   - Projects
   - Invoices
   - Payments
   - Tasks
   - **Expenses** (جديد)
   - Settings
   - Lists

### 2. أعمدة الجداول

#### Clients
```
client_id | client_name | company_name | phone | whatsapp | email | city | country | source | client_type | status | notes | created_at | updated_at
```

#### Projects (محدث)
```
project_id | client_id | project_name | project_type | service_type | description | start_date | due_date | delivery_date | project_value | paid_amount | remaining_amount | currency | status | priority | progress_percent | notes | created_at | updated_at
```

#### Invoices
```
invoice_id | invoice_number | client_id | project_id | invoice_date | due_date | subtotal | tax_rate | tax_amount | total | amount_paid | amount_due | currency | invoice_status | notes | created_at | updated_at
```

#### Payments
```
payment_id | project_id | client_id | invoice_id | payment_date | amount | currency | payment_method | payment_status | reference_number | notes | created_at | updated_at
```

#### Tasks
```
task_id | project_id | client_id | task_title | task_description | status | priority | due_date | assigned_to | created_at | completed_at | notes | updated_at
```

#### Expenses (جديد)
```
expense_id | title | amount | category | date | notes | created_at
```

#### Settings
```
setting_key | setting_value
```

#### Lists
```
list_name | list_value | sort_order | is_active
```

### 3. إضافة قوائم الخيارات (Lists)

أضف هذه البيانات في ورقة Lists:

| list_name | list_value | sort_order | is_active |
|-----------|------------|------------|-----------|
| service_type | Marketing Campaign | 1 | TRUE |
| service_type | Content Creation | 2 | TRUE |
| service_type | Shopify Store | 3 | TRUE |
| service_type | Salla Store | 4 | TRUE |
| service_type | Website Development | 5 | TRUE |
| service_type | Consulting | 6 | TRUE |
| service_type | SEO | 7 | TRUE |
| service_type | Automation | 8 | TRUE |
| service_type | Other | 9 | TRUE |
| expense_category | Ads | 1 | TRUE |
| expense_category | Tools | 2 | TRUE |
| expense_category | Subscriptions | 3 | TRUE |
| expense_category | Hosting | 4 | TRUE |
| expense_category | Other | 5 | TRUE |

### 4. نشر Google Apps Script

1. افتح المحرر: Extensions > Apps Script
2. انسخ محتوى `google-apps-script/Code.gs` إلى المحرر
3. انقر على Deploy > New deployment
4. اختر Web app
5. اضبط Execute as: Me
6. اضبط Who has access: Anyone
7. انسخ رابط Web App

### 5. إعداد Frontend

1. أنشئ ملف `.env` في مجلد المشروع:
```
VITE_GAS_WEB_APP_URL=your_google_apps_script_web_app_url
```

2. شغل البناء:
```bash
npm run build
```

### 6. النشر على GitHub Pages

1. ادفع المشروع إلى GitHub
2. اذهب إلى Settings > Pages
3. اختر الفرع `main` والمجلد `dist`
4. احفظ الإعدادات

## القواعد العملية

- **توليد المعرفات تلقائياً**: CL-0001, PR-0001, INV-0001, PAY-0001, TSK-0001, EXP-0001
- **حساب المبالغ المتبقية**: remaining_amount = project_value - paid_amount
- **حساب الضريبة**: tax_amount = subtotal * (tax_rate / 100)
- **حساب الإجمالي**: total = subtotal + tax_amount
- **حساب المستحق**: amount_due = total - amount_paid
- **حساب الربح**: Profit = Total Payments - Total Expenses
- **تحديث تلقائي**: عند إضافة دفعة، يتم تحديث الفاتورة والمشروع تلقائياً

## هيكل المشروع

```
freelance-os/
├── google-apps-script/
│   └── Code.gs              # Backend logic
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components
│   │   ├── modules/         # Feature modules
│   │   └── shared/          # Shared components
│   ├── services/
│   │   └── api.ts           # API service
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## الترخيص

MIT License - للاستخدام الشخصي فقط.

---

# Freelance OS (English)

Personal Freelance Operations System

## Overview

Freelance OS is a personal internal operating system for freelancers, designed for daily personal use. It provides comprehensive management of clients, projects, invoices, payments, tasks, and expenses.

## Features

### Dashboard
- **Key Performance Indicators**: Total clients, projects, tasks, revenue
- **Profit Summary**: Total revenue, expenses, net profit
- **Interactive Charts**:
  - Monthly Revenue (Bar Chart)
  - Revenue by Service Type (Pie Chart)
  - Project Status Distribution (Pie Chart)
- **Financial Overview** with collection rate
- **Urgent Tasks** and overdue invoices

### Clients
- Manage client data and communication
- Contact information (phone, WhatsApp, email)
- Client classification (individual, company, agency)
- Track client source

### Projects
- **Service Types**: Marketing Campaign, Content Creation, Shopify Store, Salla Store, Website Development, Consulting, SEO, Automation, Other
- Track project value, payments, and remaining amount
- Progress bar (%)
- **Project Details Page** with:
  - Client info and service type
  - Related tasks
  - Payments
  - Project status
- **Advanced Filters**: Client, Service Type, Status, Date

### Invoices
- Create and manage invoices
- Automatic tax calculation
- Track paid and due amounts

### Payments
- Record payments and link to invoices and projects
- **Filters**: Month, Client, Project
- Multiple payment methods

### Tasks
- Task management with priorities
- Track deadlines
- One-click task completion

### Expenses ⭐ NEW
- Track business expenses
- **Categories**: Ads, Tools, Subscriptions, Hosting, Other
- Calculate total expenses
- Link expenses to profit calculation

### Quick Add Button ⭐ NEW
- Floating button for quick additions
- Options: Client, Project, Payment, Task, Expense
- Simplified forms for quick entry

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Charts**: Recharts
- **Backend**: Google Apps Script Web App
- **Database**: Google Sheets
- **Deployment**: GitHub Pages

## Setup Instructions

See the detailed setup guides in the `docs/` folder:
- [Google Sheets Setup](docs/GSHEETS_SETUP.md)
- [Apps Script Deployment](docs/APPS_SCRIPT_DEPLOYMENT.md)
- [GitHub Pages Deployment](docs/GITHUB_PAGES_DEPLOYMENT.md)

## Business Rules

- **Auto ID Generation**: CL-0001, PR-0001, INV-0001, PAY-0001, TSK-0001, EXP-0001
- **Remaining Amount**: remaining_amount = project_value - paid_amount
- **Tax Calculation**: tax_amount = subtotal * (tax_rate / 100)
- **Total**: total = subtotal + tax_amount
- **Amount Due**: amount_due = total - amount_paid
- **Profit**: Profit = Total Payments - Total Expenses
- **Auto Update**: When adding a payment, related invoice and project are updated automatically

## License

MIT License - For personal use only.
