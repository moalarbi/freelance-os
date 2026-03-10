/**
 * Freelance OS - Tasks Module
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
import { Checkbox } from '@/components/ui/checkbox';
import { api } from '@/services/api';
import type { Task, TaskFormData, Client, Project } from '@/types';

const statusOptions = [
  { value: 'Pending', label: 'معلقة', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'In Progress', label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-800' },
  { value: 'Completed', label: 'مكتملة', color: 'bg-green-100 text-green-800' },
  { value: 'Cancelled', label: 'ملغاة', color: 'bg-red-100 text-red-800' },
];

const priorityOptions = [
  { value: 'Low', label: 'منخفض', color: 'bg-green-100 text-green-800' },
  { value: 'Medium', label: 'متوسط', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'High', label: 'عالي', color: 'bg-red-100 text-red-800' },
  { value: 'Urgent', label: 'عاجل', color: 'bg-red-100 text-red-800 border-red-300' },
];

const initialFormData: TaskFormData = {
  project_id: '',
  client_id: '',
  task_title: '',
  task_description: '',
  status: 'Pending',
  priority: 'Medium',
  due_date: '',
  assigned_to: '',
  notes: '',
};

function formatDate(dateString: string) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ar-SA');
}

function isOverdue(dueDate: string, status: string) {
  if (!dueDate || status === 'Completed' || status === 'Cancelled') return false;
  return new Date(dueDate) < new Date();
}

interface TaskRow extends Record<string, unknown> {
  task_id: string;
  project_id: string;
  client_id: string;
  task_title: string;
  task_description: string;
  status: string;
  priority: string;
  due_date: string;
  assigned_to: string;
  created_at: string;
  completed_at: string;
  notes: string;
  updated_at: string;
}

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, clientsData, projectsData] = await Promise.all([
        api.tasks.getAll(),
        api.clients.getAll(),
        api.projects.getAll(),
      ]);
      setTasks(tasksData);
      setClients(clientsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.project_id === projectId);
    return project?.project_name || projectId;
  };

  const getFilteredProjects = (clientId: string) => {
    if (!clientId) return projects;
    return projects.filter(p => p.client_id === clientId);
  };

  const handleAdd = () => {
    setEditingTask(null);
    setFormData(initialFormData);
    setModalOpen(true);
  };

  const handleEdit = (task: TaskRow) => {
    const fullTask = tasks.find(t => t.task_id === task.task_id);
    if (fullTask) {
      setEditingTask(fullTask);
      setFormData({
        project_id: fullTask.project_id,
        client_id: fullTask.client_id,
        task_title: fullTask.task_title,
        task_description: fullTask.task_description,
        status: fullTask.status,
        priority: fullTask.priority,
        due_date: fullTask.due_date,
        assigned_to: fullTask.assigned_to,
        notes: fullTask.notes,
      });
      setModalOpen(true);
    }
  };

  const handleDelete = async (task: TaskRow) => {
    if (!confirm('هل أنت متأكد من حذف هذه المهمة؟')) return;
    
    try {
      await api.tasks.delete(task.task_id);
      await loadData();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleStatusChange = async (task: TaskRow, newStatus: string) => {
    try {
      await api.tasks.updateStatus(task.task_id, newStatus);
      await loadData();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('حدث خطأ أثناء التحديث');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTask) {
        await api.tasks.update(editingTask.task_id, formData);
      } else {
        await api.tasks.create(formData);
      }
      await loadData();
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving task:', error);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const columns = [
    {
      key: 'status',
      header: '',
      width: 'w-12',
      render: (task: TaskRow) => (
        <Checkbox
          checked={task.status === 'Completed'}
          onCheckedChange={(checked) => {
            handleStatusChange(task, checked ? 'Completed' : 'Pending');
          }}
        />
      ),
    },
    { key: 'task_id', header: 'الرمز', width: 'w-20' },
    { 
      key: 'task_title', 
      header: 'المهمة',
      render: (task: TaskRow) => (
        <div>
          <p className={`font-medium ${task.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
            {task.task_title}
          </p>
          {task.task_description && (
            <p className="text-sm text-slate-500 truncate max-w-xs">{task.task_description}</p>
          )}
        </div>
      ),
    },
    { 
      key: 'project_id', 
      header: 'المشروع',
      render: (task: TaskRow) => getProjectName(task.project_id),
    },
    { 
      key: 'due_date', 
      header: 'تاريخ التسليم',
      render: (task: TaskRow) => (
        <span className={isOverdue(task.due_date, task.status) ? 'text-red-600 font-medium' : ''}>
          {formatDate(task.due_date)}
          {isOverdue(task.due_date, task.status) && ' (متأخرة)'}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'الأولوية',
      render: (task: TaskRow) => (
        <Badge className={priorityOptions.find(p => p.value === task.priority)?.color || ''}>
          {priorityOptions.find(p => p.value === task.priority)?.label || task.priority}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'الحالة',
      render: (task: TaskRow) => (
        <Badge className={statusOptions.find(s => s.value === task.status)?.color || ''}>
          {statusOptions.find(s => s.value === task.status)?.label || task.status}
        </Badge>
      ),
    },
  ];

  const tableData: TaskRow[] = tasks.map(t => ({ ...t }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">المهام</h1>
        <p className="text-slate-500">إدارة المهام والمواعيد</p>
      </div>

      {/* Data Table */}
      <DataTable
        title=""
        columns={columns}
        data={tableData}
        searchFields={['task_title', 'task_description']}
        statusField="status"
        statusOptions={statusOptions}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonLabel="مهمة جديدة"
        idKey="task_id"
      />

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? 'تعديل مهمة' : 'مهمة جديدة'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client_id">العميل</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, client_id: value, project_id: '' });
                  }}
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
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="task_title">عنوان المهمة *</Label>
                <Input
                  id="task_title"
                  value={formData.task_title}
                  onChange={(e) => setFormData({ ...formData, task_title: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="task_description">الوصف</Label>
                <Input
                  id="task_description"
                  value={formData.task_description}
                  onChange={(e) => setFormData({ ...formData, task_description: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="due_date">تاريخ التسليم</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assigned_to">مسندة إلى</Label>
                <Input
                  id="assigned_to"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  placeholder="اسم الشخص المسؤول"
                />
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
                {editingTask ? 'حفظ التغييرات' : 'إضافة المهمة'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
