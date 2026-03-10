/**
 * Freelance OS - API Service
 * Google Apps Script Integration
 */

import type { 
  Client, ClientFormData, 
  Project, ProjectFormData, 
  Invoice, InvoiceFormData, 
  Payment, PaymentFormData, 
  Task, TaskFormData, 
  Expense, ExpenseFormData,
  DashboardStats, Settings, Lists,
  ApiResponse
} from '@/types';
import { SERVICE_TYPES, EXPENSE_CATEGORIES } from '@/types';

// ============================================
// CONFIGURATION
// ============================================
// Replace this with your Google Apps Script Web App URL after deployment
const GAS_WEB_APP_URL = import.meta.env.VITE_GAS_WEB_APP_URL || '';

// ============================================
// HELPER FUNCTIONS
// ============================================
async function fetchGet<T>(action: string, params: Record<string, string> = {}): Promise<T> {
  const queryParams = new URLSearchParams({ action, ...params });
  const response = await fetch(`${GAS_WEB_APP_URL}?${queryParams}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const result: ApiResponse<T> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Unknown error');
  }
  
  return result.data as T;
}

async function fetchPost<T>(action: string, data: unknown): Promise<T> {
  const response = await fetch(`${GAS_WEB_APP_URL}?action=${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const result: ApiResponse<T> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Unknown error');
  }
  
  return result.data as T;
}

// ============================================
// CLIENTS API
// ============================================
export const clientsApi = {
  getAll: (): Promise<Client[]> => fetchGet('getClients'),
  
  create: (data: ClientFormData): Promise<Client> => 
    fetchPost('createClient', data),
  
  update: (clientId: string, data: Partial<ClientFormData>): Promise<Client> => 
    fetchPost('updateClient', { client_id: clientId, ...data }),
  
  delete: (clientId: string): Promise<{ success: boolean; message: string }> => 
    fetchPost('deleteClient', { client_id: clientId }),
};

// ============================================
// PROJECTS API
// ============================================
export const projectsApi = {
  getAll: (): Promise<Project[]> => fetchGet('getProjects'),
  
  create: (data: ProjectFormData): Promise<Project> => 
    fetchPost('createProject', data),
  
  update: (projectId: string, data: Partial<ProjectFormData>): Promise<Project> => 
    fetchPost('updateProject', { project_id: projectId, ...data }),
  
  delete: (projectId: string): Promise<{ success: boolean; message: string }> => 
    fetchPost('deleteProject', { project_id: projectId }),
};

// ============================================
// INVOICES API
// ============================================
export const invoicesApi = {
  getAll: (): Promise<Invoice[]> => fetchGet('getInvoices'),
  
  create: (data: InvoiceFormData): Promise<Invoice> => 
    fetchPost('createInvoice', data),
  
  update: (invoiceId: string, data: Partial<InvoiceFormData>): Promise<Invoice> => 
    fetchPost('updateInvoice', { invoice_id: invoiceId, ...data }),
  
  delete: (invoiceId: string): Promise<{ success: boolean; message: string }> => 
    fetchPost('deleteInvoice', { invoice_id: invoiceId }),
};

// ============================================
// PAYMENTS API
// ============================================
export const paymentsApi = {
  getAll: (): Promise<Payment[]> => fetchGet('getPayments'),
  
  create: (data: PaymentFormData): Promise<Payment> => 
    fetchPost('createPayment', data),
  
  update: (paymentId: string, data: Partial<PaymentFormData>): Promise<Payment> => 
    fetchPost('updatePayment', { payment_id: paymentId, ...data }),
  
  delete: (paymentId: string): Promise<{ success: boolean; message: string }> => 
    fetchPost('deletePayment', { payment_id: paymentId }),
};

// ============================================
// TASKS API
// ============================================
export const tasksApi = {
  getAll: (): Promise<Task[]> => fetchGet('getTasks'),
  
  create: (data: TaskFormData): Promise<Task> => 
    fetchPost('createTask', data),
  
  update: (taskId: string, data: Partial<TaskFormData>): Promise<Task> => 
    fetchPost('updateTask', { task_id: taskId, ...data }),
  
  updateStatus: (taskId: string, status: string): Promise<Task> => 
    fetchPost('updateTaskStatus', { task_id: taskId, status }),
  
  delete: (taskId: string): Promise<{ success: boolean; message: string }> => 
    fetchPost('deleteTask', { task_id: taskId }),
};

// ============================================
// EXPENSES API
// ============================================
export const expensesApi = {
  getAll: (): Promise<Expense[]> => fetchGet('getExpenses'),
  
  create: (data: ExpenseFormData): Promise<Expense> => 
    fetchPost('createExpense', data),
  
  update: (expenseId: string, data: Partial<ExpenseFormData>): Promise<Expense> => 
    fetchPost('updateExpense', { expense_id: expenseId, ...data }),
  
  delete: (expenseId: string): Promise<{ success: boolean; message: string }> => 
    fetchPost('deleteExpense', { expense_id: expenseId }),
};

// ============================================
// DASHBOARD API
// ============================================
export const dashboardApi = {
  getStats: (): Promise<DashboardStats> => fetchGet('getDashboardStats'),
};

// ============================================
// SETTINGS API
// ============================================
export const settingsApi = {
  getAll: (): Promise<Settings> => fetchGet('getSettings'),
};

// ============================================
// LISTS API
// ============================================
export const listsApi = {
  getAll: (): Promise<Lists> => fetchGet('getLists'),
};

// ============================================
// MOCK DATA FOR DEVELOPMENT
// ============================================
export const mockData = {
  clients: [
    {
      client_id: 'CL-0001',
      client_name: 'أحمد محمد',
      company_name: 'شركة التقنية',
      phone: '+966501234567',
      whatsapp: '+966501234567',
      email: 'ahmed@tech.com',
      city: 'الرياض',
      country: 'السعودية',
      source: 'توصية',
      client_type: 'شركة',
      status: 'Active',
      notes: 'عميل مميز',
      created_at: '2024-01-15 10:30:00',
      updated_at: '2024-01-15 10:30:00',
    },
    {
      client_id: 'CL-0002',
      client_name: 'سارة عبدالله',
      company_name: '',
      phone: '+966502345678',
      whatsapp: '+966502345678',
      email: 'sara@email.com',
      city: 'جدة',
      country: 'السعودية',
      source: 'موقع',
      client_type: 'فرد',
      status: 'Active',
      notes: '',
      created_at: '2024-01-20 14:00:00',
      updated_at: '2024-01-20 14:00:00',
    },
  ] as Client[],
  
  projects: [
    {
      project_id: 'PR-0001',
      client_id: 'CL-0001',
      project_name: 'تطوير موقع تجارة إلكترونية',
      project_type: 'تطوير ويب',
      service_type: 'Website Development',
      description: 'تطوير متجر إلكتروني كامل',
      start_date: '2024-01-15',
      due_date: '2024-03-15',
      delivery_date: '',
      project_value: 25000,
      paid_amount: 15000,
      remaining_amount: 10000,
      currency: 'SAR',
      status: 'In Progress',
      priority: 'High',
      progress_percent: 60,
      notes: '',
      created_at: '2024-01-15 10:30:00',
      updated_at: '2024-02-01 09:00:00',
    },
    {
      project_id: 'PR-0002',
      client_id: 'CL-0002',
      project_name: 'تصميم هوية بصرية',
      project_type: 'تصميم',
      service_type: 'Content Creation',
      description: 'تصميم شعار وبطاقات عمل',
      start_date: '2024-02-01',
      due_date: '2024-02-15',
      delivery_date: '2024-02-14',
      project_value: 5000,
      paid_amount: 5000,
      remaining_amount: 0,
      currency: 'SAR',
      status: 'Completed',
      priority: 'Medium',
      progress_percent: 100,
      notes: '',
      created_at: '2024-02-01 11:00:00',
      updated_at: '2024-02-14 16:00:00',
    },
    {
      project_id: 'PR-0003',
      client_id: 'CL-0001',
      project_name: 'حملة تسويقية',
      project_type: 'تسويق',
      service_type: 'Marketing Campaign',
      description: 'إدارة حملة إعلانية',
      start_date: '2024-03-01',
      due_date: '2024-04-01',
      delivery_date: '',
      project_value: 15000,
      paid_amount: 5000,
      remaining_amount: 10000,
      currency: 'SAR',
      status: 'Pending',
      priority: 'High',
      progress_percent: 20,
      notes: '',
      created_at: '2024-03-01 10:00:00',
      updated_at: '2024-03-01 10:00:00',
    },
  ] as Project[],
  
  invoices: [
    {
      invoice_id: 'INV-0001',
      invoice_number: 'INV-2024-001',
      client_id: 'CL-0001',
      project_id: 'PR-0001',
      invoice_date: '2024-01-15',
      due_date: '2024-02-15',
      subtotal: 12500,
      tax_rate: 15,
      tax_amount: 1875,
      total: 14375,
      amount_paid: 14375,
      amount_due: 0,
      currency: 'SAR',
      invoice_status: 'Paid',
      notes: 'دفعة أولى',
      created_at: '2024-01-15 10:30:00',
      updated_at: '2024-01-15 10:30:00',
    },
    {
      invoice_id: 'INV-0002',
      invoice_number: 'INV-2024-002',
      client_id: 'CL-0001',
      project_id: 'PR-0001',
      invoice_date: '2024-02-01',
      due_date: '2024-03-01',
      subtotal: 12500,
      tax_rate: 15,
      tax_amount: 1875,
      total: 14375,
      amount_paid: 0,
      amount_due: 14375,
      currency: 'SAR',
      invoice_status: 'Pending',
      notes: 'دفعة ثانية',
      created_at: '2024-02-01 09:00:00',
      updated_at: '2024-02-01 09:00:00',
    },
  ] as Invoice[],
  
  payments: [
    {
      payment_id: 'PAY-0001',
      project_id: 'PR-0001',
      client_id: 'CL-0001',
      invoice_id: 'INV-0001',
      payment_date: '2024-01-15',
      amount: 14375,
      currency: 'SAR',
      payment_method: 'تحويل بنكي',
      payment_status: 'Completed',
      reference_number: 'TRX123456',
      notes: '',
      created_at: '2024-01-15 10:30:00',
      updated_at: '2024-01-15 10:30:00',
    },
    {
      payment_id: 'PAY-0002',
      project_id: 'PR-0002',
      client_id: 'CL-0002',
      invoice_id: '',
      payment_date: '2024-02-14',
      amount: 5000,
      currency: 'SAR',
      payment_method: 'كاش',
      payment_status: 'Completed',
      reference_number: '',
      notes: '',
      created_at: '2024-02-14 16:00:00',
      updated_at: '2024-02-14 16:00:00',
    },
  ] as Payment[],
  
  tasks: [
    {
      task_id: 'TSK-0001',
      project_id: 'PR-0001',
      client_id: 'CL-0001',
      task_title: 'تصميم wireframes',
      task_description: 'تصميم الهيكل الأولي للموقع',
      status: 'Completed',
      priority: 'High',
      due_date: '2024-01-25',
      assigned_to: '',
      created_at: '2024-01-15 10:30:00',
      completed_at: '2024-01-24 14:00:00',
      notes: '',
      updated_at: '2024-01-24 14:00:00',
    },
    {
      task_id: 'TSK-0002',
      project_id: 'PR-0001',
      client_id: 'CL-0001',
      task_title: 'تطوير الواجهة الأمامية',
      task_description: 'برمجة صفحات الموقع',
      status: 'In Progress',
      priority: 'High',
      due_date: '2024-02-20',
      assigned_to: '',
      created_at: '2024-01-20 09:00:00',
      completed_at: '',
      notes: '',
      updated_at: '2024-01-20 09:00:00',
    },
    {
      task_id: 'TSK-0003',
      project_id: 'PR-0001',
      client_id: 'CL-0001',
      task_title: 'ربط قاعدة البيانات',
      task_description: 'إعداد الـ backend',
      status: 'Pending',
      priority: 'Medium',
      due_date: '2024-03-01',
      assigned_to: '',
      created_at: '2024-01-25 11:00:00',
      completed_at: '',
      notes: '',
      updated_at: '2024-01-25 11:00:00',
    },
  ] as Task[],

  expenses: [
    {
      expense_id: 'EXP-0001',
      title: 'اشتراك Canva Pro',
      amount: 150,
      category: 'Tools',
      date: '2024-01-05',
      notes: 'اشتراك شهري',
      created_at: '2024-01-05 10:00:00',
    },
    {
      expense_id: 'EXP-0002',
      title: 'إعلانات فيسبوك',
      amount: 2000,
      category: 'Ads',
      date: '2024-02-10',
      notes: 'حملة تسويقية',
      created_at: '2024-02-10 14:00:00',
    },
    {
      expense_id: 'EXP-0003',
      title: 'استضافة موقع',
      amount: 500,
      category: 'Hosting',
      date: '2024-01-01',
      notes: 'استضافة سنوية',
      created_at: '2024-01-01 09:00:00',
    },
  ] as Expense[],
  
  dashboardStats: {
    clients: { total: 2, active: 2 },
    projects: { 
      total: 3, 
      active: 1, 
      completed: 1, 
      total_value: 45000, 
      total_paid: 20000, 
      total_remaining: 25000 
    },
    invoices: { 
      total: 2, 
      pending: 1, 
      overdue: 0, 
      total_invoiced: 28750, 
      total_due: 14375 
    },
    payments: { total: 19375, this_month: 0, pending: 10000 },
    expenses: { total: 2650, this_month: 0 },
    profit: { total: 16725, this_month: 0 },
    tasks: { 
      total: 3, 
      pending: 1, 
      in_progress: 1, 
      completed: 1, 
      high_priority: 2 
    },
    recent: {
      projects: [],
      invoices: [],
      tasks: [],
    },
    revenueByMonth: [
      { month: 'يناير', revenue: 14375 },
      { month: 'فبراير', revenue: 5000 },
      { month: 'مارس', revenue: 0 },
    ],
    revenueByServiceType: [
      { service_type: 'Website Development', revenue: 15000 },
      { service_type: 'Content Creation', revenue: 5000 },
      { service_type: 'Marketing Campaign', revenue: 5000 },
    ],
    projectStatusDistribution: [
      { status: 'In Progress', count: 1 },
      { status: 'Completed', count: 1 },
      { status: 'Pending', count: 1 },
    ],
  } as DashboardStats,
  
  lists: {
    client_status: ['Active', 'Inactive', 'Prospect'],
    client_type: ['فرد', 'شركة', 'وكالة'],
    client_source: ['توصية', 'موقع', 'سوشيال ميديا', 'معرض', 'أخرى'],
    project_status: ['Pending', 'In Progress', 'Completed', 'Cancelled', 'On Hold'],
    project_priority: ['Low', 'Medium', 'High', 'Urgent'],
    project_type: ['تطوير ويب', 'تطبيق موبايل', 'تصميم', 'استشارة', 'أخرى'],
    service_type: [...SERVICE_TYPES],
    invoice_status: ['Draft', 'Sent', 'Pending', 'Partial', 'Paid', 'Overdue', 'Cancelled'],
    payment_method: ['تحويل بنكي', 'كاش', 'بطاقة ائتمان', 'PayPal', 'أخرى'],
    payment_status: ['Pending', 'Completed', 'Failed', 'Refunded'],
    task_status: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    task_priority: ['Low', 'Medium', 'High', 'Urgent'],
    expense_category: [...EXPENSE_CATEGORIES],
    currency: ['SAR', 'USD', 'EUR', 'GBP'],
  } as unknown as Lists,
};

// ============================================
// MOCK API FOR DEVELOPMENT
// ============================================
export const useMockApi = !GAS_WEB_APP_URL;

export const mockApi = {
  clients: {
    getAll: async (): Promise<Client[]> => mockData.clients,
    create: async (data: ClientFormData): Promise<Client> => {
      const newClient = {
        client_id: `CL-${String(mockData.clients.length + 1).padStart(4, '0')}`,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Client;
      mockData.clients.push(newClient);
      return newClient;
    },
    update: async (clientId: string, data: Partial<ClientFormData>): Promise<Client> => {
      const index = mockData.clients.findIndex(c => c.client_id === clientId);
      if (index === -1) throw new Error('Client not found');
      mockData.clients[index] = { ...mockData.clients[index], ...data, updated_at: new Date().toISOString() } as Client;
      return mockData.clients[index];
    },
    delete: async (clientId: string): Promise<{ success: boolean; message: string }> => {
      const index = mockData.clients.findIndex(c => c.client_id === clientId);
      if (index === -1) throw new Error('Client not found');
      mockData.clients.splice(index, 1);
      return { success: true, message: 'Client deleted' };
    },
  },
  
  projects: {
    getAll: async (): Promise<Project[]> => mockData.projects,
    create: async (data: ProjectFormData): Promise<Project> => {
      const newProject = {
        project_id: `PR-${String(mockData.projects.length + 1).padStart(4, '0')}`,
        ...data,
        remaining_amount: data.project_value - data.paid_amount,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Project;
      mockData.projects.push(newProject);
      return newProject;
    },
    update: async (projectId: string, data: Partial<ProjectFormData>): Promise<Project> => {
      const index = mockData.projects.findIndex(p => p.project_id === projectId);
      if (index === -1) throw new Error('Project not found');
      const project = mockData.projects[index];
      const updatedProject = { ...project, ...data, updated_at: new Date().toISOString() } as Project;
      updatedProject.remaining_amount = updatedProject.project_value - updatedProject.paid_amount;
      mockData.projects[index] = updatedProject;
      return updatedProject;
    },
    delete: async (projectId: string): Promise<{ success: boolean; message: string }> => {
      const index = mockData.projects.findIndex(p => p.project_id === projectId);
      if (index === -1) throw new Error('Project not found');
      mockData.projects.splice(index, 1);
      return { success: true, message: 'Project deleted' };
    },
  },
  
  invoices: {
    getAll: async (): Promise<Invoice[]> => mockData.invoices,
    create: async (data: InvoiceFormData): Promise<Invoice> => {
      const taxAmount = data.subtotal * (data.tax_rate / 100);
      const total = data.subtotal + taxAmount;
      const newInvoice = {
        invoice_id: `INV-${String(mockData.invoices.length + 1).padStart(4, '0')}`,
        ...data,
        tax_amount: taxAmount,
        total: total,
        amount_due: total - data.amount_paid,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Invoice;
      mockData.invoices.push(newInvoice);
      return newInvoice;
    },
    update: async (invoiceId: string, data: Partial<InvoiceFormData>): Promise<Invoice> => {
      const index = mockData.invoices.findIndex(i => i.invoice_id === invoiceId);
      if (index === -1) throw new Error('Invoice not found');
      const invoice = mockData.invoices[index];
      const updatedInvoice = { ...invoice, ...data, updated_at: new Date().toISOString() } as Invoice;
      updatedInvoice.tax_amount = updatedInvoice.subtotal * (updatedInvoice.tax_rate / 100);
      updatedInvoice.total = updatedInvoice.subtotal + updatedInvoice.tax_amount;
      updatedInvoice.amount_due = updatedInvoice.total - updatedInvoice.amount_paid;
      mockData.invoices[index] = updatedInvoice;
      return updatedInvoice;
    },
    delete: async (invoiceId: string): Promise<{ success: boolean; message: string }> => {
      const index = mockData.invoices.findIndex(i => i.invoice_id === invoiceId);
      if (index === -1) throw new Error('Invoice not found');
      mockData.invoices.splice(index, 1);
      return { success: true, message: 'Invoice deleted' };
    },
  },
  
  payments: {
    getAll: async (): Promise<Payment[]> => mockData.payments,
    create: async (data: PaymentFormData): Promise<Payment> => {
      const newPayment = {
        payment_id: `PAY-${String(mockData.payments.length + 1).padStart(4, '0')}`,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Payment;
      mockData.payments.push(newPayment);
      return newPayment;
    },
    update: async (paymentId: string, data: Partial<PaymentFormData>): Promise<Payment> => {
      const index = mockData.payments.findIndex(p => p.payment_id === paymentId);
      if (index === -1) throw new Error('Payment not found');
      mockData.payments[index] = { ...mockData.payments[index], ...data, updated_at: new Date().toISOString() } as Payment;
      return mockData.payments[index];
    },
    delete: async (paymentId: string): Promise<{ success: boolean; message: string }> => {
      const index = mockData.payments.findIndex(p => p.payment_id === paymentId);
      if (index === -1) throw new Error('Payment not found');
      mockData.payments.splice(index, 1);
      return { success: true, message: 'Payment deleted' };
    },
  },
  
  tasks: {
    getAll: async (): Promise<Task[]> => mockData.tasks,
    create: async (data: TaskFormData): Promise<Task> => {
      const newTask = {
        task_id: `TSK-${String(mockData.tasks.length + 1).padStart(4, '0')}`,
        ...data,
        created_at: new Date().toISOString(),
        completed_at: data.status === 'Completed' ? new Date().toISOString() : '',
        updated_at: new Date().toISOString(),
      } as Task;
      mockData.tasks.push(newTask);
      return newTask;
    },
    update: async (taskId: string, data: Partial<TaskFormData>): Promise<Task> => {
      const index = mockData.tasks.findIndex(t => t.task_id === taskId);
      if (index === -1) throw new Error('Task not found');
      const task = mockData.tasks[index];
      const updatedTask = { ...task, ...data, updated_at: new Date().toISOString() } as Task;
      if (data.status === 'Completed' && task.status !== 'Completed') {
        updatedTask.completed_at = new Date().toISOString();
      }
      mockData.tasks[index] = updatedTask;
      return updatedTask;
    },
    updateStatus: async (taskId: string, status: string): Promise<Task> => {
      const index = mockData.tasks.findIndex(t => t.task_id === taskId);
      if (index === -1) throw new Error('Task not found');
      mockData.tasks[index].status = status as Task['status'];
      mockData.tasks[index].updated_at = new Date().toISOString();
      if (status === 'Completed' && !mockData.tasks[index].completed_at) {
        mockData.tasks[index].completed_at = new Date().toISOString();
      }
      return mockData.tasks[index];
    },
    delete: async (taskId: string): Promise<{ success: boolean; message: string }> => {
      const index = mockData.tasks.findIndex(t => t.task_id === taskId);
      if (index === -1) throw new Error('Task not found');
      mockData.tasks.splice(index, 1);
      return { success: true, message: 'Task deleted' };
    },
  },

  expenses: {
    getAll: async (): Promise<Expense[]> => mockData.expenses,
    create: async (data: ExpenseFormData): Promise<Expense> => {
      const newExpense = {
        expense_id: `EXP-${String(mockData.expenses.length + 1).padStart(4, '0')}`,
        ...data,
        created_at: new Date().toISOString(),
      } as Expense;
      mockData.expenses.push(newExpense);
      return newExpense;
    },
    update: async (expenseId: string, data: Partial<ExpenseFormData>): Promise<Expense> => {
      const index = mockData.expenses.findIndex(e => e.expense_id === expenseId);
      if (index === -1) throw new Error('Expense not found');
      mockData.expenses[index] = { ...mockData.expenses[index], ...data } as Expense;
      return mockData.expenses[index];
    },
    delete: async (expenseId: string): Promise<{ success: boolean; message: string }> => {
      const index = mockData.expenses.findIndex(e => e.expense_id === expenseId);
      if (index === -1) throw new Error('Expense not found');
      mockData.expenses.splice(index, 1);
      return { success: true, message: 'Expense deleted' };
    },
  },
  
  dashboard: {
    getStats: async (): Promise<DashboardStats> => {
      // Recalculate stats
      const stats = { ...mockData.dashboardStats };
      stats.clients.total = mockData.clients.length;
      stats.clients.active = mockData.clients.filter(c => c.status === 'Active').length;
      stats.projects.total = mockData.projects.length;
      stats.projects.active = mockData.projects.filter(p => p.status === 'In Progress').length;
      stats.projects.completed = mockData.projects.filter(p => p.status === 'Completed').length;
      stats.projects.total_value = mockData.projects.reduce((sum, p) => sum + (p.project_value || 0), 0);
      stats.projects.total_paid = mockData.projects.reduce((sum, p) => sum + (p.paid_amount || 0), 0);
      stats.projects.total_remaining = mockData.projects.reduce((sum, p) => sum + (p.remaining_amount || 0), 0);
      stats.invoices.total = mockData.invoices.length;
      stats.invoices.pending = mockData.invoices.filter(i => i.invoice_status === 'Pending' || i.invoice_status === 'Draft').length;
      stats.invoices.total_invoiced = mockData.invoices.reduce((sum, i) => sum + (i.total || 0), 0);
      stats.invoices.total_due = mockData.invoices.reduce((sum, i) => sum + (i.amount_due || 0), 0);
      stats.payments.total = mockData.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      stats.payments.pending = mockData.projects.reduce((sum, p) => sum + (p.remaining_amount || 0), 0);
      stats.expenses.total = mockData.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      stats.profit.total = stats.payments.total - stats.expenses.total;
      stats.tasks.total = mockData.tasks.length;
      stats.tasks.pending = mockData.tasks.filter(t => t.status === 'Pending').length;
      stats.tasks.in_progress = mockData.tasks.filter(t => t.status === 'In Progress').length;
      stats.tasks.completed = mockData.tasks.filter(t => t.status === 'Completed').length;
      stats.tasks.high_priority = mockData.tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;
      stats.recent.projects = mockData.projects.slice(-5).reverse();
      stats.recent.invoices = mockData.invoices.slice(-5).reverse();
      stats.recent.tasks = mockData.tasks.filter(t => t.status !== 'Completed').slice(0, 5);
      
      // Calculate revenue by service type
      const revenueByServiceType: Record<string, number> = {};
      mockData.projects.forEach(p => {
        revenueByServiceType[p.service_type] = (revenueByServiceType[p.service_type] || 0) + p.paid_amount;
      });
      stats.revenueByServiceType = Object.entries(revenueByServiceType).map(([service_type, revenue]) => ({
        service_type,
        revenue,
      }));
      
      // Calculate project status distribution
      const statusDistribution: Record<string, number> = {};
      mockData.projects.forEach(p => {
        statusDistribution[p.status] = (statusDistribution[p.status] || 0) + 1;
      });
      stats.projectStatusDistribution = Object.entries(statusDistribution).map(([status, count]) => ({
        status,
        count,
      }));
      
      return stats;
    },
  },
  
  lists: {
    getAll: async (): Promise<Lists> => mockData.lists,
  },
};

// ============================================
// EXPORT UNIFIED API
// ============================================
export const api = useMockApi ? mockApi : {
  clients: clientsApi,
  projects: projectsApi,
  invoices: invoicesApi,
  payments: paymentsApi,
  tasks: tasksApi,
  expenses: expensesApi,
  dashboard: dashboardApi,
  lists: listsApi,
};
