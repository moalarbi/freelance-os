/**
 * Freelance OS - Dashboard Module
 */

import { useEffect, useState } from 'react';
import { 
  Users, 
  FolderKanban, 
  FileText, 
  CheckSquare,
  TrendingUp,
  AlertCircle,
  DollarSign,
  PiggyBank
} from 'lucide-react';
import { KPICard } from '@/components/shared/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/services/api';
import type { DashboardStats, Project, Invoice, Task } from '@/types';

// Import Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Mock data for initial render
const initialStats: DashboardStats = {
  clients: { total: 0, active: 0 },
  projects: { total: 0, active: 0, completed: 0, total_value: 0, total_paid: 0, total_remaining: 0 },
  invoices: { total: 0, pending: 0, overdue: 0, total_invoiced: 0, total_due: 0 },
  payments: { total: 0, this_month: 0, pending: 0 },
  expenses: { total: 0, this_month: 0 },
  profit: { total: 0, this_month: 0 },
  tasks: { total: 0, pending: 0, in_progress: 0, completed: 0, high_priority: 0 },
  recent: { projects: [], invoices: [], tasks: [] },
  revenueByMonth: [],
  revenueByServiceType: [],
  projectStatusDistribution: [],
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

function formatCurrency(amount: number, currency = 'SAR') {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'Active': 'bg-green-100 text-green-800',
    'Inactive': 'bg-gray-100 text-gray-800',
    'Prospect': 'bg-blue-100 text-blue-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'On Hold': 'bg-gray-100 text-gray-800',
    'Draft': 'bg-gray-100 text-gray-800',
    'Sent': 'bg-blue-100 text-blue-800',
    'Partial': 'bg-yellow-100 text-yellow-800',
    'Paid': 'bg-green-100 text-green-800',
    'Overdue': 'bg-red-100 text-red-800',
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800',
    'Urgent': 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

function getServiceTypeLabel(serviceType: string) {
  const labels: Record<string, string> = {
    'Marketing Campaign': 'حملة تسويقية',
    'Content Creation': 'إنشاء محتوى',
    'Shopify Store': 'متجر Shopify',
    'Salla Store': 'متجر سلة',
    'Website Development': 'تطوير موقع',
    'Consulting': 'استشارة',
    'SEO': 'تحسين محركات البحث',
    'Automation': 'أتمتة',
    'Other': 'أخرى',
  };
  return labels[serviceType] || serviceType;
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    'Pending': 'معلق',
    'In Progress': 'قيد التنفيذ',
    'Completed': 'مكتمل',
    'Cancelled': 'ملغي',
    'On Hold': 'متوقف',
  };
  return labels[status] || status;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.dashboard.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const collectionRate = stats.projects.total_value > 0
    ? Math.round((stats.projects.total_paid / stats.projects.total_value) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">لوحة التحكم</h1>
        <p className="text-slate-500">نظرة عامة على أداء أعمالك</p>
      </div>

      {/* KPI Cards - Row 1 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="إجمالي العملاء"
          value={stats.clients.total}
          subtitle={`${stats.clients.active} عميل نشط`}
          icon={Users}
          color="blue"
        />
        <KPICard
          title="إجمالي المشاريع"
          value={stats.projects.total}
          subtitle={`${stats.projects.active} نشط | ${stats.projects.completed} مكتمل`}
          icon={FolderKanban}
          color="green"
        />
        <KPICard
          title="المهام المعلقة"
          value={stats.tasks.pending + stats.tasks.in_progress}
          subtitle={`${stats.tasks.high_priority} ذات أولوية عالية`}
          icon={CheckSquare}
          color={stats.tasks.high_priority > 0 ? 'red' : 'blue'}
        />
      </div>

      {/* KPI Cards - Row 2 (Financial) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="إيرادات هذا الشهر"
          value={formatCurrency(stats.payments.this_month)}
          subtitle="المدفوعات المستلمة"
          icon={DollarSign}
          color="green"
        />
        <KPICard
          title="المدفوعات المعلقة"
          value={formatCurrency(stats.payments.pending)}
          subtitle="غير المحصلة"
          icon={AlertCircle}
          color="yellow"
        />
        <KPICard
          title="الفواتير المستحقة"
          value={formatCurrency(stats.invoices.total_due)}
          subtitle={`${stats.invoices.pending} فاتورة معلقة`}
          icon={FileText}
          color={stats.invoices.total_due > 0 ? 'yellow' : 'green'}
        />
      </div>

      {/* Profit Summary Widget */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <PiggyBank className="h-5 w-5" />
            ملخص الأرباح
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-slate-500 mb-1">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.payments.total)}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-slate-500 mb-1">إجمالي المصروفات</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(stats.expenses.total)}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-slate-500 mb-1">صافي الربح</p>
              <p className={`text-2xl font-bold ${stats.profit.total >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(stats.profit.total)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue">الإيرادات الشهرية</TabsTrigger>
          <TabsTrigger value="service">الإيرادات حسب الخدمة</TabsTrigger>
          <TabsTrigger value="status">توزيع حالات المشاريع</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>الإيرادات الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `ر.س ${value}`} />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelStyle={{ textAlign: 'right' }}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" name="الإيرادات" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="service">
          <Card>
            <CardHeader>
              <CardTitle>الإيرادات حسب نوع الخدمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.revenueByServiceType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ service_type, revenue }) => `${getServiceTypeLabel(service_type)}: ${formatCurrency(revenue)}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="revenue"
                      nameKey="service_type"
                    >
                      {stats.revenueByServiceType.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend formatter={(value) => getServiceTypeLabel(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>توزيع حالات المشاريع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.projectStatusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${getStatusLabel(status)}: ${count}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="status"
                    >
                      {stats.projectStatusDistribution.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend formatter={(value) => getStatusLabel(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Financial Overview */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              النظرة المالية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-sm text-slate-500">إجمالي قيمة المشاريع</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {formatCurrency(stats.projects.total_value)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-500">المدفوع</p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {formatCurrency(stats.projects.total_paid)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-500">المتبقي</p>
                <p className="mt-1 text-2xl font-bold text-red-600">
                  {formatCurrency(stats.projects.total_remaining)}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">نسبة التحصيل</span>
                <span className="text-sm font-medium text-slate-900">{collectionRate}%</span>
              </div>
              <Progress value={collectionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              المهام العاجلة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.tasks.high_priority > 0 ? (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-red-800">
                    مهام عالية الأولوية
                  </span>
                  <Badge className="bg-red-100 text-red-800">
                    {stats.tasks.high_priority}
                  </Badge>
                </div>
              ) : (
                <p className="text-center text-slate-500 py-4">
                  لا توجد مهام عاجلة
                </p>
              )}
              {stats.invoices.overdue > 0 && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-red-800">
                    فواتير متأخرة
                  </span>
                  <Badge className="bg-red-100 text-red-800">
                    {stats.invoices.overdue}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>آخر المشاريع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recent.projects.length === 0 ? (
                <p className="text-center text-slate-500 py-4">لا توجد مشاريع</p>
              ) : (
                stats.recent.projects.map((project: Project) => (
                  <div key={project.project_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{project.project_name}</p>
                      <p className="text-sm text-slate-500">
                        {formatCurrency(project.project_value, project.currency)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status === 'Pending' ? 'معلق' :
                       project.status === 'In Progress' ? 'قيد التنفيذ' :
                       project.status === 'Completed' ? 'مكتمل' :
                       project.status === 'Cancelled' ? 'ملغي' : 'متوقف'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>آخر الفواتير</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recent.invoices.length === 0 ? (
                <p className="text-center text-slate-500 py-4">لا توجد فواتير</p>
              ) : (
                stats.recent.invoices.map((invoice: Invoice) => (
                  <div key={invoice.invoice_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{invoice.invoice_number}</p>
                      <p className="text-sm text-slate-500">
                        مستحق: {formatCurrency(invoice.amount_due, invoice.currency)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(invoice.invoice_status)}>
                      {invoice.invoice_status === 'Paid' ? 'مدفوعة' :
                       invoice.invoice_status === 'Pending' ? 'معلقة' :
                       invoice.invoice_status === 'Draft' ? 'مسودة' :
                       invoice.invoice_status === 'Overdue' ? 'متأخرة' : invoice.invoice_status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>المهام النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recent.tasks.length === 0 ? (
                <p className="text-center text-slate-500 py-4">لا توجد مهام</p>
              ) : (
                stats.recent.tasks.map((task: Task) => (
                  <div key={task.task_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{task.task_title}</p>
                      <p className="text-sm text-slate-500">
                        تسليم: {task.due_date || 'غير محدد'}
                      </p>
                    </div>
                    <Badge className={getStatusColor(task.priority)}>
                      {task.priority === 'High' ? 'عالي' :
                       task.priority === 'Medium' ? 'متوسط' :
                       task.priority === 'Low' ? 'منخفض' : 'عاجل'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
