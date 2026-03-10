# Google Sheets Setup Guide

## خطوات إعداد Google Sheets

### 1. إنشاء جدول بيانات جديد

1. اذهب إلى [Google Sheets](https://sheets.google.com)
2. أنشئ جدول بيانات جديد (Blank)
3. سمّه "Freelance OS Database"

### 2. إنشاء الأوراق (Sheets)

أنشئ 7 أوراق بالأسماء التالية:

1. Clients
2. Projects
3. Invoices
4. Payments
5. Tasks
6. Settings
7. Lists

### 3. إعداد أعمدة كل ورقة

#### Clients (العملاء)
```
client_id | client_name | company_name | phone | whatsapp | email | city | country | source | client_type | status | notes | created_at | updated_at
```

#### Projects (المشاريع)
```
project_id | client_id | project_name | project_type | description | start_date | due_date | delivery_date | project_value | paid_amount | remaining_amount | currency | status | priority | progress_percent | notes | created_at | updated_at
```

#### Invoices (الفواتير)
```
invoice_id | invoice_number | client_id | project_id | invoice_date | due_date | subtotal | tax_rate | tax_amount | total | amount_paid | amount_due | currency | invoice_status | notes | created_at | updated_at
```

#### Payments (المدفوعات)
```
payment_id | project_id | client_id | invoice_id | payment_date | amount | currency | payment_method | payment_status | reference_number | notes | created_at | updated_at
```

#### Tasks (المهام)
```
task_id | project_id | client_id | task_title | task_description | status | priority | due_date | assigned_to | created_at | completed_at | notes | updated_at
```

#### Settings (الإعدادات)
```
setting_key | setting_value
```

#### Lists (القوائم)
```
list_name | list_value | sort_order | is_active
```

### 4. إضافة البيانات الأولية

#### إعدادات القوائم (Lists)

أضف هذه البيانات في ورقة Lists:

| list_name | list_value | sort_order | is_active |
|-----------|------------|------------|-----------|
| client_status | Active | 1 | TRUE |
| client_status | Inactive | 2 | TRUE |
| client_status | Prospect | 3 | TRUE |
| client_type | فرد | 1 | TRUE |
| client_type | شركة | 2 | TRUE |
| client_type | وكالة | 3 | TRUE |
| project_status | Pending | 1 | TRUE |
| project_status | In Progress | 2 | TRUE |
| project_status | Completed | 3 | TRUE |
| project_status | Cancelled | 4 | TRUE |
| project_status | On Hold | 5 | TRUE |
| project_priority | Low | 1 | TRUE |
| project_priority | Medium | 2 | TRUE |
| project_priority | High | 3 | TRUE |
| project_priority | Urgent | 4 | TRUE |
| invoice_status | Draft | 1 | TRUE |
| invoice_status | Sent | 2 | TRUE |
| invoice_status | Pending | 3 | TRUE |
| invoice_status | Partial | 4 | TRUE |
| invoice_status | Paid | 5 | TRUE |
| invoice_status | Overdue | 6 | TRUE |
| invoice_status | Cancelled | 7 | TRUE |
| payment_method | تحويل بنكي | 1 | TRUE |
| payment_method | كاش | 2 | TRUE |
| payment_method | بطاقة ائتمان | 3 | TRUE |
| payment_method | PayPal | 4 | TRUE |
| payment_method | أخرى | 5 | TRUE |
| payment_status | Pending | 1 | TRUE |
| payment_status | Completed | 2 | TRUE |
| payment_status | Failed | 3 | TRUE |
| payment_status | Refunded | 4 | TRUE |
| task_status | Pending | 1 | TRUE |
| task_status | In Progress | 2 | TRUE |
| task_status | Completed | 3 | TRUE |
| task_status | Cancelled | 4 | TRUE |
| task_priority | Low | 1 | TRUE |
| task_priority | Medium | 2 | TRUE |
| task_priority | High | 3 | TRUE |
| task_priority | Urgent | 4 | TRUE |
| currency | SAR | 1 | TRUE |
| currency | USD | 2 | TRUE |
| currency | EUR | 3 | TRUE |
| currency | GBP | 4 | TRUE |

### 5. تنسيق الأعمدة

1. حدد الصف الأول في كل ورقة
2. اجعله **Bold** (عريض)
3. يمكنك تغيير لون الخلفية لتسهيل التمييز

### 6. مشاركة الجدول

1. انقر على زر "Share" (مشاركة)
2. اضبط الإعدادات:
   - General access: Anyone with the link
   - Role: Editor (للسماح بالتعديل)
3. انسخ الرابط واحتفظ به

## الخطوة التالية

بعد إعداد Google Sheets، انتقل إلى:
[Apps Script Deployment Guide](APPS_SCRIPT_DEPLOYMENT.md)

---

# Google Sheets Setup Guide (English)

## Steps to Setup Google Sheets

### 1. Create a New Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "Freelance OS Database"

### 2. Create the Sheets

Create 7 sheets with the following names:

1. Clients
2. Projects
3. Invoices
4. Payments
5. Tasks
6. Settings
7. Lists

### 3. Setup Sheet Columns

Follow the column structure shown above for each sheet.

### 4. Add Initial Data

Add the list values to the Lists sheet as shown in the table above.

### 5. Format Columns

1. Select the first row in each sheet
2. Make it **Bold**
3. You can change the background color for better visibility

### 6. Share the Spreadsheet

1. Click the "Share" button
2. Set the permissions:
   - General access: Anyone with the link
   - Role: Editor (to allow modifications)
3. Copy the link and keep it safe

## Next Step

After setting up Google Sheets, proceed to:
[Apps Script Deployment Guide](APPS_SCRIPT_DEPLOYMENT.md)
