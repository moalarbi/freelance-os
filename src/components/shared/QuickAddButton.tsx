/**
 * Freelance OS - Quick Add Floating Button
 */

import { useState } from 'react';
import { Plus, User, FolderKanban, CreditCard, CheckSquare, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/services/api';
import { SERVICE_TYPES, EXPENSE_CATEGORIES } from '@/types';
import type { Client, Project } from '@/types';

interface QuickAddButtonProps {
  clients: Client[];
  projects: Project[];
  onSuccess: () => void;
}

export function QuickAddButton({ clients, projects, onSuccess }: QuickAddButtonProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Client Form
  const [clientForm, setClientForm] = useState({
    client_name: '',
    company_name: '',
    phone: '',
    email: '',
    status: 'Active',
  });

  // Project Form
  const [projectForm, setProjectForm] = useState({
    client_id: '',
    project_name: '',
    service_type: 'Website Development',
    project_value: 0,
    currency: 'SAR',
    status: 'Pending',
  });

  // Payment Form
  const [paymentForm, setPaymentForm] = useState({
    client_id: '',
    project_id: '',
    amount: 0,
    currency: 'SAR',
    payment_method: 'تحويل بنكي',
    payment_date: new Date().toISOString().split('T')[0],
  });

  // Task Form
  const [taskForm, setTaskForm] = useState({
    client_id: '',
    project_id: '',
    task_title: '',
    priority: 'Medium',
    due_date: '',
  });

  // Expense Form
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: 0,
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmitClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.clients.create({
        ...clientForm,
        whatsapp: '',
        city: '',
        country: 'السعودية',
        source: '',
        client_type: 'فرد',
        notes: '',
      });
      setActiveModal(null);
      setClientForm({ client_name: '', company_name: '', phone: '', email: '', status: 'Active' });
      onSuccess();
    } catch (error) {
      console.error('Error creating client:', error);
      alert('حدث خطأ أثناء إضافة العميل');
    }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.projects.create({
        ...projectForm,
        project_type: 'أخرى',
        description: '',
        start_date: '',
        due_date: '',
        delivery_date: '',
        paid_amount: 0,
        priority: 'Medium',
        progress_percent: 0,
        notes: '',
      });
      setActiveModal(null);
      setProjectForm({ client_id: '', project_name: '', service_type: 'Website Development', project_value: 0, currency: 'SAR', status: 'Pending' });
      onSuccess();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('حدث خطأ أثناء إضافة المشروع');
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.payments.create({
        ...paymentForm,
        invoice_id: '',
        payment_status: 'Completed',
        reference_number: '',
        notes: '',
      });
      setActiveModal(null);
      setPaymentForm({ client_id: '', project_id: '', amount: 0, currency: 'SAR', payment_method: 'تحويل بنكي', payment_date: new Date().toISOString().split('T')[0] });
      onSuccess();
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('حدث خطأ أثناء إضافة الدفعة');
    }
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.tasks.create({
        ...taskForm,
        task_description: '',
        status: 'Pending',
        assigned_to: '',
        notes: '',
      });
      setActiveModal(null);
      setTaskForm({ client_id: '', project_id: '', task_title: '', priority: 'Medium', due_date: '' });
      onSuccess();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('حدث خطأ أثناء إضافة المهمة');
    }
  };

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.expenses.create({
        ...expenseForm,
        notes: '',
      });
      setActiveModal(null);
      setExpenseForm({ title: '', amount: 0, category: 'Other', date: new Date().toISOString().split('T')[0] });
      onSuccess();
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('حدث خطأ أثناء إضافة المصروف');
    }
  };

  const getFilteredProjects = (clientId: string) => {
    if (!clientId) return projects;
    return projects.filter(p => p.client_id === clientId);
  };

  return (
    <>
      {/* Floating Quick Add Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-lg z-50"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setActiveModal('client')}>
            <User className="h-4 w-4 ml-2" />
            عميل جديد
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveModal('project')}>
            <FolderKanban className="h-4 w-4 ml-2" />
            مشروع جديد
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveModal('payment')}>
            <CreditCard className="h-4 w-4 ml-2" />
            دفعة جديدة
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveModal('task')}>
            <CheckSquare className="h-4 w-4 ml-2" />
            مهمة جديدة
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveModal('expense')}>
            <TrendingDown className="h-4 w-4 ml-2" />
            مصروف جديد
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Client Modal */}
      <Dialog open={activeModal === 'client'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>عميل جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitClient} className="space-y-4">
            <div className="space-y-2">
              <Label>اسم العميل *</Label>
              <Input
                value={clientForm.client_name}
                onChange={(e) => setClientForm({ ...clientForm, client_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>اسم الشركة</Label>
              <Input
                value={clientForm.company_name}
                onChange={(e) => setClientForm({ ...clientForm, company_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>الهاتف</Label>
              <Input
                value={clientForm.phone}
                onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input
                type="email"
                value={clientForm.email}
                onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">إضافة العميل</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Project Modal */}
      <Dialog open={activeModal === 'project'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>مشروع جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitProject} className="space-y-4">
            <div className="space-y-2">
              <Label>العميل *</Label>
              <Select
                value={projectForm.client_id}
                onValueChange={(value) => setProjectForm({ ...projectForm, client_id: value })}
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
              <Label>اسم المشروع *</Label>
              <Input
                value={projectForm.project_name}
                onChange={(e) => setProjectForm({ ...projectForm, project_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>نوع الخدمة</Label>
              <Select
                value={projectForm.service_type}
                onValueChange={(value) => setProjectForm({ ...projectForm, service_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === 'Marketing Campaign' ? 'حملة تسويقية' :
                       type === 'Content Creation' ? 'إنشاء محتوى' :
                       type === 'Shopify Store' ? 'متجر Shopify' :
                       type === 'Salla Store' ? 'متجر سلة' :
                       type === 'Website Development' ? 'تطوير موقع' :
                       type === 'Consulting' ? 'استشارة' :
                       type === 'SEO' ? 'تحسين محركات البحث' :
                       type === 'Automation' ? 'أتمتة' : 'أخرى'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>قيمة المشروع</Label>
              <Input
                type="number"
                value={projectForm.project_value}
                onChange={(e) => setProjectForm({ ...projectForm, project_value: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <Button type="submit" className="w-full">إضافة المشروع</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={activeModal === 'payment'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>دفعة جديدة</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div className="space-y-2">
              <Label>العميل *</Label>
              <Select
                value={paymentForm.client_id}
                onValueChange={(value) => setPaymentForm({ ...paymentForm, client_id: value, project_id: '' })}
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
              <Label>المشروع</Label>
              <Select
                value={paymentForm.project_id}
                onValueChange={(value) => setPaymentForm({ ...paymentForm, project_id: value })}
                disabled={!paymentForm.client_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المشروع" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredProjects(paymentForm.client_id).map((project) => (
                    <SelectItem key={project.project_id} value={project.project_id}>
                      {project.project_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>المبلغ *</Label>
              <Input
                type="number"
                step="0.01"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>طريقة الدفع</Label>
              <Select
                value={paymentForm.payment_method}
                onValueChange={(value) => setPaymentForm({ ...paymentForm, payment_method: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الطريقة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                  <SelectItem value="كاش">كاش</SelectItem>
                  <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="أخرى">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">تسجيل الدفعة</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Task Modal */}
      <Dialog open={activeModal === 'task'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>مهمة جديدة</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitTask} className="space-y-4">
            <div className="space-y-2">
              <Label>العميل</Label>
              <Select
                value={taskForm.client_id}
                onValueChange={(value) => setTaskForm({ ...taskForm, client_id: value, project_id: '' })}
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
              <Label>المشروع</Label>
              <Select
                value={taskForm.project_id}
                onValueChange={(value) => setTaskForm({ ...taskForm, project_id: value })}
                disabled={!taskForm.client_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المشروع" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredProjects(taskForm.client_id).map((project) => (
                    <SelectItem key={project.project_id} value={project.project_id}>
                      {project.project_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>عنوان المهمة *</Label>
              <Input
                value={taskForm.task_title}
                onChange={(e) => setTaskForm({ ...taskForm, task_title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>الأولوية</Label>
              <Select
                value={taskForm.priority}
                onValueChange={(value) => setTaskForm({ ...taskForm, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">منخفض</SelectItem>
                  <SelectItem value="Medium">متوسط</SelectItem>
                  <SelectItem value="High">عالي</SelectItem>
                  <SelectItem value="Urgent">عاجل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>تاريخ التسليم</Label>
              <Input
                type="date"
                value={taskForm.due_date}
                onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">إضافة المهمة</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Expense Modal */}
      <Dialog open={activeModal === 'expense'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>مصروف جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitExpense} className="space-y-4">
            <div className="space-y-2">
              <Label>البند *</Label>
              <Input
                value={expenseForm.title}
                onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                placeholder="مثال: اشتراك Canva"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>المبلغ *</Label>
              <Input
                type="number"
                step="0.01"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>التصنيف</Label>
              <Select
                value={expenseForm.category}
                onValueChange={(value) => setExpenseForm({ ...expenseForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'Ads' ? 'إعلانات' :
                       cat === 'Tools' ? 'أدوات' :
                       cat === 'Subscriptions' ? 'اشتراكات' :
                       cat === 'Hosting' ? 'استضافة' : 'أخرى'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">إضافة المصروف</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
