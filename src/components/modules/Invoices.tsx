/**
 * Freelance OS - Invoices Module
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
import { api } from '@/services/api';
import type { Invoice, InvoiceFormData, Client, Project } from '@/types';

const statusOptions = [
  { value: 'Draft', label: 'مسودة', color: 'bg-gray-100 text-gray-800' },
  { value: 'Sent', label: 'مرسلة', color: 'bg-blue-100 text-blue-800' },
  { value: 'Pending', label: 'معلقة', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Partial', label: 'جزئي', color: 'bg-orange-100 text-orange-800' },
  { value: 'Paid', label: 'مدفوعة', color: 'bg-green-100 text-green-800' },
  { value: 'Overdue', label: 'متأخرة', color: 'bg-red-100 text-red-800' },
  { value: 'Cancelled', label: 'ملغاة', color: 'bg-gray-100 text-gray-800' },
];

const currencyOptions = [
  { value: 'SAR', label: 'ريال سعودي' },
  { value: 'USD', label: 'دولار أمريكي' },
  { value: 'EUR', label: 'يورو' },
  { value: 'GBP', label: 'جنيه إسترليني' },
];

const initialFormData: InvoiceFormData = {
  invoice_number: '',
  client_id: '',
  project_id: '',
  invoice_date: new Date().toISOString().split('T')[0],
  due_date: '',
  subtotal: 0,
  tax_rate: 15,
  amount_paid: 0,
  currency: 'SAR',
  invoice_status: 'Draft',
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

interface InvoiceRow extends Record<string, unknown> {
  invoice_id: string;
  invoice_number: string;
  client_id: string;
  project_id: string;
  invoice_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  invoice_status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState<InvoiceFormData>(initialFormData);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [invoicesData, clientsData, projectsData] = await Promise.all([
        api.invoices.getAll(),
        api.clients.getAll(),
        api.projects.getAll(),
      ]);
      setInvoices(invoicesData);
      setClients(clientsData);
      setProjects(projectsData);
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

  const calculateTotals = (subtotal: number, taxRate: number, amountPaid: number) => {
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    const amountDue = total - amountPaid;
    return { taxAmount, total, amountDue };
  };

  const handleAdd = () => {
    setEditingInvoice(null);
    setFormData({
      ...initialFormData,
      invoice_number: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
    });
    setModalOpen(true);
  };

  const handleEdit = (invoice: InvoiceRow) => {
    const fullInvoice = invoices.find(i => i.invoice_id === invoice.invoice_id);
    if (fullInvoice) {
      setEditingInvoice(fullInvoice);
      setFormData({
        invoice_number: fullInvoice.invoice_number,
        client_id: fullInvoice.client_id,
        project_id: fullInvoice.project_id,
        invoice_date: fullInvoice.invoice_date,
        due_date: fullInvoice.due_date,
        subtotal: fullInvoice.subtotal,
        tax_rate: fullInvoice.tax_rate,
        amount_paid: fullInvoice.amount_paid,
        currency: fullInvoice.currency,
        invoice_status: fullInvoice.invoice_status,
        notes: fullInvoice.notes,
      });
      setModalOpen(true);
    }
  };

  const handleDelete = async (invoice: InvoiceRow) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) return;
    
    try {
      await api.invoices.delete(invoice.invoice_id);
      await loadData();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingInvoice) {
        await api.invoices.update(editingInvoice.invoice_id, formData);
      } else {
        await api.invoices.create(formData);
      }
      await loadData();
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const { taxAmount, total, amountDue } = calculateTotals(
    formData.subtotal,
    formData.tax_rate,
    formData.amount_paid
  );

  const columns = [
    { key: 'invoice_number', header: 'رقم الفاتورة', width: 'w-32' },
    { 
      key: 'client_id', 
      header: 'العميل',
      render: (invoice: InvoiceRow) => getClientName(invoice.client_id),
    },
    { 
      key: 'invoice_date', 
      header: 'التاريخ',
      render: (invoice: InvoiceRow) => formatDate(invoice.invoice_date),
    },
    { 
      key: 'total', 
      header: 'الإجمالي',
      render: (invoice: InvoiceRow) => formatCurrency(invoice.total, invoice.currency),
    },
    { 
      key: 'amount_due', 
      header: 'المستحق',
      render: (invoice: InvoiceRow) => (
        <span className={invoice.amount_due > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
          {formatCurrency(invoice.amount_due, invoice.currency)}
        </span>
      ),
    },
    {
      key: 'invoice_status',
      header: 'الحالة',
      render: (invoice: InvoiceRow) => (
        <Badge className={statusOptions.find(s => s.value === invoice.invoice_status)?.color || ''}>
          {statusOptions.find(s => s.value === invoice.invoice_status)?.label || invoice.invoice_status}
        </Badge>
      ),
    },
  ];

  const tableData: InvoiceRow[] = invoices.map(i => ({ ...i }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">الفواتير</h1>
        <p className="text-slate-500">إدارة الفواتير والضرائب</p>
      </div>

      {/* Data Table */}
      <DataTable
        title=""
        columns={columns}
        data={tableData}
        searchFields={['invoice_number', 'client_id']}
        statusField="invoice_status"
        statusOptions={statusOptions}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonLabel="فاتورة جديدة"
        idKey="invoice_id"
      />

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingInvoice ? 'تعديل فاتورة' : 'فاتورة جديدة'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoice_number">رقم الفاتورة *</Label>
                <Input
                  id="invoice_number"
                  value={formData.invoice_number}
                  onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client_id">العميل *</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, client_id: value, project_id: '' });
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
                <Label htmlFor="invoice_date">تاريخ الفاتورة</Label>
                <Input
                  id="invoice_date"
                  type="date"
                  value={formData.invoice_date}
                  onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="due_date">تاريخ الاستحقاق</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtotal">المجموع الفرعي</Label>
                <Input
                  id="subtotal"
                  type="number"
                  step="0.01"
                  value={formData.subtotal}
                  onChange={(e) => setFormData({ ...formData, subtotal: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tax_rate">نسبة الض (%)</Label>
                <Input
                  id="tax_rate"
                  type="number"
                  value={formData.tax_rate}
                  onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount_paid">المبلغ المدفوع</Label>
                <Input
                  id="amount_paid"
                  type="number"
                  step="0.01"
                  value={formData.amount_paid}
                  onChange={(e) => setFormData({ ...formData, amount_paid: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invoice_status">الحالة</Label>
                <Select
                  value={formData.invoice_status}
                  onValueChange={(value) => setFormData({ ...formData, invoice_status: value })}
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
            </div>
            
            {/* Totals Summary */}
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">الضريبة:</span>
                <span className="font-medium">{formatCurrency(taxAmount, formData.currency)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>الإجمالي:</span>
                <span className="text-blue-600">{formatCurrency(total, formData.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">المبلغ المدفوع:</span>
                <span className="font-medium text-green-600">{formatCurrency(formData.amount_paid, formData.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">المستحق:</span>
                <span className={`font-medium ${amountDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(amountDue, formData.currency)}
                </span>
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
                {editingInvoice ? 'حفظ التغييرات' : 'إضافة الفاتورة'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
