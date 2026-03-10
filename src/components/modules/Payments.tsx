/**
 * Freelance OS - Payments Module
 */

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/services/api';
import type { Payment, PaymentFormData, Client, Project, Invoice } from '@/types';

const statusOptions = [
  { value: 'Pending', label: 'معلق', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Completed', label: 'مكتمل', color: 'bg-green-100 text-green-800' },
  { value: 'Failed', label: 'فاشل', color: 'bg-red-100 text-red-800' },
  { value: 'Refunded', label: 'مسترجع', color: 'bg-gray-100 text-gray-800' },
];

const paymentMethodOptions = [
  { value: 'تحويل بنكي', label: 'تحويل بنكي' },
  { value: 'كاش', label: 'كاش' },
  { value: 'بطاقة ائتمان', label: 'بطاقة ائتمان' },
  { value: 'PayPal', label: 'PayPal' },
  { value: 'أخرى', label: 'أخرى' },
];

const currencyOptions = [
  { value: 'SAR', label: 'ريال سعودي' },
  { value: 'USD', label: 'دولار أمريكي' },
  { value: 'EUR', label: 'يورو' },
  { value: 'GBP', label: 'جنيه إسترليني' },
];

const initialFormData: PaymentFormData = {
  project_id: '',
  client_id: '',
  invoice_id: '',
  payment_date: new Date().toISOString().split('T')[0],
  amount: 0,
  currency: 'SAR',
  payment_method: 'تحويل بنكي',
  payment_status: 'Completed',
  reference_number: '',
  notes: '',
};

function formatCurrency(amount: number, currency = 'SAR') {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString: string) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ar-SA');
}

function getMonthYear(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

interface PaymentRow extends Record<string, unknown> {
  payment_id: string;
  project_id: string;
  client_id: string;
  invoice_id: string;
  payment_date: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  reference_number: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>(initialFormData);
  
  // Filters
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterClient, setFilterClient] = useState('all');
  const [filterProject, setFilterProject] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [paymentsData, clientsData, projectsData, invoicesData] = await Promise.all([
        api.payments.getAll(),
        api.clients.getAll(),
        api.projects.getAll(),
        api.invoices.getAll(),
      ]);
      setPayments(paymentsData);
      setClients(clientsData);
      setProjects(projectsData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.client_id === clientId);
    return client?.client_name || clientId;
  };

  const getFilteredProjects = (clientId: string) => {
    if (!clientId) return projects;
    return projects.filter(p => p.client_id === clientId);
  };

  const getFilteredInvoices = (clientId: string) => {
    if (!clientId) return invoices.filter(i => i.amount_due > 0);
    return invoices.filter(i => i.client_id === clientId && i.amount_due > 0);
  };

  // Generate month options
  const monthOptions = () => {
    const months = [];
    const monthNames = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      months.push({ value, label });
    }
    return months;
  };

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    if (filterMonth !== 'all' && getMonthYear(payment.payment_date) !== filterMonth) return false;
    if (filterClient !== 'all' && payment.client_id !== filterClient) return false;
    if (filterProject !== 'all' && payment.project_id !== filterProject) return false;
    return true;
  });

  const totalPayments = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const handleAdd = () => {
    setEditingPayment(null);
    setFormData(initialFormData);
    setModalOpen(true);
  };

  const handleEdit = (payment: PaymentRow) => {
    const fullPayment = payments.find(p => p.payment_id === payment.payment_id);
    if (fullPayment) {
      setEditingPayment(fullPayment);
      setFormData({
        project_id: fullPayment.project_id,
        client_id: fullPayment.client_id,
        invoice_id: fullPayment.invoice_id,
        payment_date: fullPayment.payment_date,
        amount: fullPayment.amount,
        currency: fullPayment.currency,
        payment_method: fullPayment.payment_method,
        payment_status: fullPayment.payment_status,
        reference_number: fullPayment.reference_number,
        notes: fullPayment.notes,
      });
      setModalOpen(true);
    }
  };

  const handleDelete = async (payment: PaymentRow) => {
    if (!confirm('هل أنت متأكد من حذف هذه الدفعة؟')) return;
    
    try {
      await api.payments.delete(payment.payment_id);
      await loadData();
    } catch (error) {
      console.error('Error deleting payment:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPayment) {
        await api.payments.update(editingPayment.payment_id, formData);
      } else {
        await api.payments.create(formData);
      }
      await loadData();
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const columns = [
    { key: 'payment_id', header: 'الرمز', width: 'w-24' },
    { 
      key: 'client_id', 
      header: 'العميل',
      render: (payment: PaymentRow) => getClientName(payment.client_id),
    },
    { 
      key: 'payment_date', 
      header: 'التاريخ',
      render: (payment: PaymentRow) => formatDate(payment.payment_date),
    },
    { 
      key: 'amount', 
      header: 'المبلغ',
      render: (payment: PaymentRow) => (
        <span className="font-medium text-green-600">
          {formatCurrency(payment.amount, payment.currency)}
        </span>
      ),
    },
    { 
      key: 'payment_method', 
      header: 'طريقة الدفع',
    },
    {
      key: 'payment_status',
      header: 'الحالة',
      render: (payment: PaymentRow) => (
        <Badge className={statusOptions.find(s => s.value === payment.payment_status)?.color || ''}>
          {statusOptions.find(s => s.value === payment.payment_status)?.label || payment.payment_status}
        </Badge>
      ),
    },
    { 
      key: 'reference_number', 
      header: 'المرجع',
      render: (payment: PaymentRow) => payment.reference_number || '-',
    },
  ];

  const tableData: PaymentRow[] = filteredPayments.map(p => ({ ...p }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">المدفوعات</h1>
        <p className="text-slate-500">تسجيل وتتبع المدفوعات</p>
      </div>

      {/* Total Card */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">إجمالي المدفوعات المعروضة</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalPayments)}</p>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <Label className="text-xs mb-1 block">الشهر</Label>
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الأشهر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأشهر</SelectItem>
                  {monthOptions().map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <Label className="text-xs mb-1 block">العميل</Label>
              <Select value={filterClient} onValueChange={(value) => { setFilterClient(value); setFilterProject('all'); }}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع العملاء" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع العملاء</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.client_id} value={client.client_id}>
                      {client.client_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <Label className="text-xs mb-1 block">المشروع</Label>
              <Select value={filterProject} onValueChange={setFilterProject} disabled={filterClient === 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع المشاريع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المشاريع</SelectItem>
                  {getFilteredProjects(filterClient).map((project) => (
                    <SelectItem key={project.project_id} value={project.project_id}>
                      {project.project_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <DataTable
        title=""
        columns={columns}
        data={tableData}
        searchFields={['payment_id', 'reference_number', 'client_id']}
        statusField="payment_status"
        statusOptions={statusOptions}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonLabel="دفعة جديدة"
        idKey="payment_id"
      />

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPayment ? 'تعديل دفعة' : 'دفعة جديدة'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client_id">العميل *</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, client_id: value, project_id: '', invoice_id: '' });
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.client_id} value={client.client_id}>
                        {client.client_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project_id">المشروع</Label>
                <Select
                  value={formData.project_id}
                  onValueChange={(value) => setFormData({ ...formData, project_id: value })}
                  disabled={!formData.client_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المشروع" />
                  </SelectTrigger>
                  <SelectContent>
                    {getFilteredProjects(formData.client_id).map((project) => (
                      <SelectItem key={project.project_id} value={project.project_id}>
                        {project.project_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invoice_id">الفاتورة</Label>
                <Select
                  value={formData.invoice_id}
                  onValueChange={(value) => setFormData({ ...formData, invoice_id: value })}
                  disabled={!formData.client_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفاتورة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">بدون فاتورة</SelectItem>
                    {getFilteredInvoices(formData.client_id).map((invoice) => (
                      <SelectItem key={invoice.invoice_id} value={invoice.invoice_id}>
                        {invoice.invoice_number} (مستحق: {formatCurrency(invoice.amount_due, invoice.currency)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">العملة</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العملة" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">المبلغ *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment_date">تاريخ الدفع</Label>
                <Input
                  id="payment_date"
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment_method">طريقة الدفع</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الطريقة" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment_status">الحالة</Label>
                <Select
                  value={formData.payment_status}
                  onValueChange={(value) => setFormData({ ...formData, payment_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reference_number">رقم المرجع</Label>
                <Input
                  id="reference_number"
                  value={formData.reference_number}
                  onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                  placeholder="رقم التحويل أو العملية"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                {editingPayment ? 'حفظ التغييرات' : 'تسجيل الدفعة'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
