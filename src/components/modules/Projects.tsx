/**
 * Freelance OS - Projects Module
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
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/services/api';
import { SERVICE_TYPES } from '@/types';
import type { Project, ProjectFormData, Client, Task, Payment } from '@/types';

const statusOptions = [
  { value: 'Pending', label: 'معلق', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'In Progress', label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-800' },
  { value: 'Completed', label: 'مكتمل', color: 'bg-green-100 text-green-800' },
  { value: 'Cancelled', label: 'ملغي', color: 'bg-red-100 text-red-800' },
  { value: 'On Hold', label: 'متوقف', color: 'bg-gray-100 text-gray-800' },
];

const priorityOptions = [
  { value: 'Low', label: 'منخفض', color: 'bg-green-100 text-green-800' },
  { value: 'Medium', label: 'متوسط', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'High', label: 'عالي', color: 'bg-red-100 text-red-800' },
  { value: 'Urgent', label: 'عاجل', color: 'bg-red-100 text-red-800 border-red-300' },
];

const serviceTypeOptions = SERVICE_TYPES.map(st => ({
  value: st,
  label: st === 'Marketing Campaign' ? 'حملة تسويقية' :
         st === 'Content Creation' ? 'إنشاء محتوى' :
         st === 'Shopify Store' ? 'متجر Shopify' :
         st === 'Salla Store' ? 'متجر سلة' :
         st === 'Website Development' ? 'تطوير موقع' :
         st === 'Consulting' ? 'استشارة' :
         st === 'SEO' ? 'تحسين محركات البحث' :
         st === 'Automation' ? 'أتمتة' : 'أخرى',
}));

const currencyOptions = [
  { value: 'SAR', label: 'ريال سعودي' },
  { value: 'USD', label: 'دولار أمريكي' },
  { value: 'EUR', label: 'يورو' },
  { value: 'GBP', label: 'جنيه إسترليني' },
];

const initialFormData: ProjectFormData = {
  client_id: '',
  project_name: '',
  project_type: 'تطوير ويب',
  service_type: 'Website Development',
  description: '',
  start_date: '',
  due_date: '',
  delivery_date: '',
  project_value: 0,
  paid_amount: 0,
  currency: 'SAR',
  status: 'Pending',
  priority: 'Medium',
  progress_percent: 0,
  notes: '',
};

function formatCurrency(amount: number, currency = 'SAR') {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface ProjectRow extends Record<string, unknown> {
  project_id: string;
  client_id: string;
  project_name: string;
  project_type: string;
  service_type: string;
  description: string;
  start_date: string;
  due_date: string;
  delivery_date: string;
  project_value: number;
  paid_amount: number;
  remaining_amount: number;
  currency: string;
  status: string;
  priority: string;
  progress_percent: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  
  // Filters
  const [filterClient, setFilterClient] = useState('all');
  const [filterServiceType, setFilterServiceType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, clientsData, tasksData, paymentsData] = await Promise.all([
        api.projects.getAll(),
        api.clients.getAll(),
        api.tasks.getAll(),
        api.payments.getAll(),
      ]);
      setProjects(projectsData);
      setClients(clientsData);
      setTasks(tasksData);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.client_id === clientId);
    return client?.client_name || clientId;
  };

  const getServiceTypeLabel = (serviceType: string) => {
    return serviceTypeOptions.find(s => s.value === serviceType)?.label || serviceType;
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    if (filterClient !== 'all' && project.client_id !== filterClient) return false;
    if (filterServiceType !== 'all' && project.service_type !== filterServiceType) return false;
    if (filterStatus !== 'all' && project.status !== filterStatus) return false;
    if (filterDateFrom && project.start_date < filterDateFrom) return false;
    if (filterDateTo && project.start_date > filterDateTo) return false;
    return true;
  });

  const handleAdd = () => {
    setEditingProject(null);
    setFormData(initialFormData);
    setModalOpen(true);
  };

  const handleEdit = (project: ProjectRow) => {
    const fullProject = projects.find(p => p.project_id === project.project_id);
    if (fullProject) {
      setEditingProject(fullProject);
      setFormData({
        client_id: fullProject.client_id,
        project_name: fullProject.project_name,
        project_type: fullProject.project_type,
        service_type: fullProject.service_type,
        description: fullProject.description,
        start_date: fullProject.start_date,
        due_date: fullProject.due_date,
        delivery_date: fullProject.delivery_date,
        project_value: fullProject.project_value,
        paid_amount: fullProject.paid_amount,
        currency: fullProject.currency,
        status: fullProject.status,
        priority: fullProject.priority,
        progress_percent: fullProject.progress_percent,
        notes: fullProject.notes,
      });
      setModalOpen(true);
    }
  };

  const handleViewDetails = (project: ProjectRow) => {
    const fullProject = projects.find(p => p.project_id === project.project_id);
    if (fullProject) {
      setSelectedProject(fullProject);
      setDetailModalOpen(true);
    }
  };

  const handleDelete = async (project: ProjectRow) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
    
    try {
      await api.projects.delete(project.project_id);
      await loadData();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProject) {
        await api.projects.update(editingProject.project_id, formData);
      } else {
        await api.projects.create(formData);
      }
      await loadData();
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const columns = [
    { key: 'project_id', header: 'الرمز', width: 'w-20' },
    { 
      key: 'project_name', 
      header: 'المشروع',
      render: (project: ProjectRow) => (
        <div>
          <p className="font-medium">{project.project_name}</p>
          <p className="text-sm text-slate-500">{getClientName(project.client_id)}</p>
        </div>
      ),
    },
    {
      key: 'service_type',
      header: 'نوع الخدمة',
      render: (project: ProjectRow) => (
        <Badge variant="outline" className="text-xs">
          {getServiceTypeLabel(project.service_type)}
        </Badge>
      ),
    },
    { 
      key: 'project_value', 
      header: 'القيمة',
      render: (project: ProjectRow) => formatCurrency(project.project_value, project.currency),
    },
    { 
      key: 'remaining_amount', 
      header: 'المتبقي',
      render: (project: ProjectRow) => (
        <span className={project.remaining_amount > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
          {formatCurrency(project.remaining_amount, project.currency)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'الحالة',
      render: (project: ProjectRow) => (
        <Badge className={statusOptions.find(s => s.value === project.status)?.color || ''}>
          {statusOptions.find(s => s.value === project.status)?.label || project.status}
        </Badge>
      ),
    },
    {
      key: 'progress_percent',
      header: 'التقدم',
      render: (project: ProjectRow) => (
        <div className="w-20">
          <Progress value={project.progress_percent} className="h-2" />
          <span className="text-xs text-slate-500">{project.progress_percent}%</span>
        </div>
      ),
    },
  ];

  const tableData: ProjectRow[] = filteredProjects.map(p => ({ ...p }));

  // Get project details
  const getProjectTasks = (projectId: string) => tasks.filter(t => t.project_id === projectId);
  const getProjectPayments = (projectId: string) => payments.filter(p => p.project_id === projectId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">المشاريع</h1>
        <p className="text-slate-500">إدارة المشاريع والمهام</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <Label className="text-xs mb-1 block">العميل</Label>
              <Select value={filterClient} onValueChange={setFilterClient}>
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
              <Label className="text-xs mb-1 block">نوع الخدمة</Label>
              <Select value={filterServiceType} onValueChange={setFilterServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الخدمات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الخدمات</SelectItem>
                  {serviceTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <Label className="text-xs mb-1 block">الحالة</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <Label className="text-xs mb-1 block">من تاريخ</Label>
              <Input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <Label className="text-xs mb-1 block">إلى تاريخ</Label>
              <Input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <DataTable
        title=""
        columns={columns}
        data={tableData}
        searchFields={['project_name', 'project_type', 'description']}
        statusField="status"
        statusOptions={statusOptions}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleViewDetails}
        addButtonLabel="مشروع جديد"
        idKey="project_id"
      />

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'تعديل مشروع' : 'مشروع جديد'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client_id">العميل *</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => setFormData({ ...formData, client_id: value })}
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
                <Label htmlFor="project_name">اسم المشروع *</Label>
                <Input
                  id="project_name"
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service_type">نوع الخدمة *</Label>
                <Select
                  value={formData.service_type}
                  onValueChange={(value) => setFormData({ ...formData, service_type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
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
                <Label htmlFor="project_value">قيمة المشروع</Label>
                <Input
                  id="project_value"
                  type="number"
                  value={formData.project_value}
                  onChange={(e) => setFormData({ ...formData, project_value: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paid_amount">المبلغ المدفوع</Label>
                <Input
                  id="paid_amount"
                  type="number"
                  value={formData.paid_amount}
                  onChange={(e) => setFormData({ ...formData, paid_amount: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="start_date">تاريخ البدء</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
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
              
              <div className="space-y-2">
                <Label htmlFor="priority">الأولوية</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="progress_percent">نسبة التقدم (%)</Label>
                <Input
                  id="progress_percent"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress_percent}
                  onChange={(e) => setFormData({ ...formData, progress_percent: parseInt(e.target.value) })}
                />
                <div className="text-left text-sm text-slate-500">
                  {formData.progress_percent}%
                </div>
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">الوصف</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                {editingProject ? 'حفظ التغييرات' : 'إضافة المشروع'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Project Details Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.project_name}</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="info">المعلومات</TabsTrigger>
                  <TabsTrigger value="tasks">المهام</TabsTrigger>
                  <TabsTrigger value="payments">المدفوعات</TabsTrigger>
                  <TabsTrigger value="progress">التقدم</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-500">العميل</Label>
                      <p className="font-medium">{getClientName(selectedProject.client_id)}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500">نوع الخدمة</Label>
                      <p className="font-medium">{getServiceTypeLabel(selectedProject.service_type)}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500">قيمة المشروع</Label>
                      <p className="font-medium text-lg">{formatCurrency(selectedProject.project_value, selectedProject.currency)}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500">المدفوع</Label>
                      <p className="font-medium text-green-600">{formatCurrency(selectedProject.paid_amount, selectedProject.currency)}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500">المتبقي</Label>
                      <p className={`font-medium text-lg ${selectedProject.remaining_amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(selectedProject.remaining_amount, selectedProject.currency)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-slate-500">الحالة</Label>
                      <div>
                        <Badge className={statusOptions.find(s => s.value === selectedProject.status)?.color || ''}>
                          {statusOptions.find(s => s.value === selectedProject.status)?.label || selectedProject.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="tasks">
                  <div className="space-y-2">
                    {getProjectTasks(selectedProject.project_id).length === 0 ? (
                      <p className="text-center text-slate-500 py-4">لا توجد مهام</p>
                    ) : (
                      getProjectTasks(selectedProject.project_id).map(task => (
                        <div key={task.task_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className={`font-medium ${task.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                              {task.task_title}
                            </p>
                            <p className="text-sm text-slate-500">{task.due_date}</p>
                          </div>
                          <Badge className={task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {task.status === 'Completed' ? 'مكتملة' : 'معلقة'}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="payments">
                  <div className="space-y-2">
                    {getProjectPayments(selectedProject.project_id).length === 0 ? (
                      <p className="text-center text-slate-500 py-4">لا توجد مدفوعات</p>
                    ) : (
                      getProjectPayments(selectedProject.project_id).map(payment => (
                        <div key={payment.payment_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium">{formatCurrency(payment.amount, payment.currency)}</p>
                            <p className="text-sm text-slate-500">{payment.payment_date}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">{payment.payment_method}</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="progress">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-500 mb-2 block">نسبة الإنجاز</Label>
                      <Progress value={selectedProject.progress_percent} className="h-4" />
                      <p className="text-center mt-2 font-medium">{selectedProject.progress_percent}%</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-slate-500">إجمالي المهام</p>
                        <p className="text-2xl font-bold">{getProjectTasks(selectedProject.project_id).length}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-slate-500">المهام المكتملة</p>
                        <p className="text-2xl font-bold">
                          {getProjectTasks(selectedProject.project_id).filter(t => t.status === 'Completed').length}
                        </p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-slate-500">المهام المعلقة</p>
                        <p className="text-2xl font-bold">
                          {getProjectTasks(selectedProject.project_id).filter(t => t.status !== 'Completed').length}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
