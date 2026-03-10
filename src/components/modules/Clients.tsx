/**
 * Freelance OS - Clients Module
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
import type { Client, ClientFormData } from '@/types';

const statusOptions = [
  { value: 'Active', label: 'نشط', color: 'bg-green-100 text-green-800' },
  { value: 'Inactive', label: 'غير نشط', color: 'bg-gray-100 text-gray-800' },
  { value: 'Prospect', label: 'محتمل', color: 'bg-blue-100 text-blue-800' },
];

const clientTypeOptions = [
  { value: 'فرد', label: 'فرد' },
  { value: 'شركة', label: 'شركة' },
  { value: 'وكالة', label: 'وكالة' },
];

const sourceOptions = [
  { value: 'توصية', label: 'توصية' },
  { value: 'موقع', label: 'موقع' },
  { value: 'سوشيال ميديا', label: 'سوشيال ميديا' },
  { value: 'معرض', label: 'معرض' },
  { value: 'أخرى', label: 'أخرى' },
];

const initialFormData: ClientFormData = {
  client_name: '',
  company_name: '',
  phone: '',
  whatsapp: '',
  email: '',
  city: '',
  country: 'السعودية',
  source: '',
  client_type: 'فرد',
  status: 'Active',
  notes: '',
};

interface ClientRow extends Record<string, unknown> {
  client_id: string;
  client_name: string;
  company_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  country: string;
  source: string;
  client_type: string;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await api.clients.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleAdd = () => {
    setEditingClient(null);
    setFormData(initialFormData);
    setModalOpen(true);
  };

  const handleEdit = (client: ClientRow) => {
    const fullClient = clients.find(c => c.client_id === client.client_id);
    if (fullClient) {
      setEditingClient(fullClient);
      setFormData({
        client_name: fullClient.client_name,
        company_name: fullClient.company_name,
        phone: fullClient.phone,
        whatsapp: fullClient.whatsapp,
        email: fullClient.email,
        city: fullClient.city,
        country: fullClient.country,
        source: fullClient.source,
        client_type: fullClient.client_type,
        status: fullClient.status,
        notes: fullClient.notes,
      });
      setModalOpen(true);
    }
  };

  const handleDelete = async (client: ClientRow) => {
    if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;
    
    try {
      await api.clients.delete(client.client_id);
      await loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingClient) {
        await api.clients.update(editingClient.client_id, formData);
      } else {
        await api.clients.create(formData);
      }
      await loadClients();
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving client:', error);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const columns = [
    { key: 'client_id', header: 'الرمز', width: 'w-24' },
    { 
      key: 'client_name', 
      header: 'العميل',
      render: (client: ClientRow) => (
        <div>
          <p className="font-medium">{client.client_name}</p>
          {client.company_name && (
            <p className="text-sm text-slate-500">{client.company_name}</p>
          )}
        </div>
      ),
    },
    { key: 'phone', header: 'الهاتف' },
    { key: 'email', header: 'البريد' },
    { key: 'city', header: 'المدينة' },
    {
      key: 'status',
      header: 'الحالة',
      render: (client: ClientRow) => (
        <Badge className={statusOptions.find(s => s.value === client.status)?.color || ''}>
          {statusOptions.find(s => s.value === client.status)?.label || client.status}
        </Badge>
      ),
    },
  ];

  const tableData: ClientRow[] = clients.map(c => ({ ...c }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">العملاء</h1>
        <p className="text-slate-500">إدارة بيانات العملاء</p>
      </div>

      {/* Data Table */}
      <DataTable
        title=""
        columns={columns}
        data={tableData}
        searchFields={['client_name', 'company_name', 'phone', 'email']}
        statusField="status"
        statusOptions={statusOptions}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonLabel="عميل جديد"
        idKey="client_id"
      />

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? 'تعديل عميل' : 'عميل جديد'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client_name">اسم العميل *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company_name">اسم الشركة</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">الهاتف</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp">واتساب</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">المدينة</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">الدولة</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">المصدر</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => setFormData({ ...formData, source: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المصدر" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client_type">نوع العميل</Label>
                <Select
                  value={formData.client_type}
                  onValueChange={(value) => setFormData({ ...formData, client_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
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
                {editingClient ? 'حفظ التغييرات' : 'إضافة العميل'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
