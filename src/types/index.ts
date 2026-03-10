/**
 * Freelance OS - TypeScript Types
 */

// ============================================
// CLIENT TYPES
// ============================================
export interface Client {
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
  status: 'Active' | 'Inactive' | 'Prospect';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ClientFormData {
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
}

// ============================================
// PROJECT TYPES
// ============================================
export interface Project {
  project_id: string;
  client_id: string;
  project_name: string;
  project_type: string;
  service_type: ServiceType;
  description: string;
  start_date: string;
  due_date: string;
  delivery_date: string;
  project_value: number;
  paid_amount: number;
  remaining_amount: number;
  currency: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'On Hold';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  progress_percent: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectFormData {
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
  currency: string;
  status: string;
  priority: string;
  progress_percent: number;
  notes: string;
}

export const SERVICE_TYPES = [
  'Marketing Campaign',
  'Content Creation',
  'Shopify Store',
  'Salla Store',
  'Website Development',
  'Consulting',
  'SEO',
  'Automation',
  'Other',
] as const;

export type ServiceType = typeof SERVICE_TYPES[number];

// ============================================
// INVOICE TYPES
// ============================================
export interface Invoice {
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
  invoice_status: 'Draft' | 'Sent' | 'Pending' | 'Partial' | 'Paid' | 'Overdue' | 'Cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceFormData {
  invoice_number: string;
  client_id: string;
  project_id: string;
  invoice_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  amount_paid: number;
  currency: string;
  invoice_status: string;
  notes: string;
}

// ============================================
// PAYMENT TYPES
// ============================================
export interface Payment {
  payment_id: string;
  project_id: string;
  client_id: string;
  invoice_id: string;
  payment_date: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  reference_number: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentFormData {
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
}

// ============================================
// TASK TYPES
// ============================================
export interface Task {
  task_id: string;
  project_id: string;
  client_id: string;
  task_title: string;
  task_description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  due_date: string;
  assigned_to: string;
  created_at: string;
  completed_at: string;
  notes: string;
  updated_at: string;
}

export interface TaskFormData {
  project_id: string;
  client_id: string;
  task_title: string;
  task_description: string;
  status: string;
  priority: string;
  due_date: string;
  assigned_to: string;
  notes: string;
}

// ============================================
// EXPENSE TYPES
// ============================================
export interface Expense {
  expense_id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes: string;
  created_at: string;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
}

export const EXPENSE_CATEGORIES = ['Ads', 'Tools', 'Subscriptions', 'Hosting', 'Other'] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

// ============================================
// DASHBOARD TYPES
// ============================================
export interface DashboardStats {
  clients: {
    total: number;
    active: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    total_value: number;
    total_paid: number;
    total_remaining: number;
  };
  invoices: {
    total: number;
    pending: number;
    overdue: number;
    total_invoiced: number;
    total_due: number;
  };
  payments: {
    total: number;
    this_month: number;
    pending: number;
  };
  expenses: {
    total: number;
    this_month: number;
  };
  profit: {
    total: number;
    this_month: number;
  };
  tasks: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    high_priority: number;
  };
  recent: {
    projects: Project[];
    invoices: Invoice[];
    tasks: Task[];
  };
  // Chart data
  revenueByMonth: { month: string; revenue: number }[];
  revenueByServiceType: { service_type: string; revenue: number }[];
  projectStatusDistribution: { status: string; count: number }[];
}

// ============================================
// SETTINGS & LISTS
// ============================================
export interface Settings {
  [key: string]: string;
}

export interface Lists {
  [key: string]: string[];
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// UI TYPES
// ============================================
export type ViewType = 'dashboard' | 'clients' | 'projects' | 'invoices' | 'payments' | 'tasks' | 'expenses';

export interface FilterState {
  search: string;
  status: string;
  priority: string;
  client_id: string;
  project_id: string;
  date_from: string;
  date_to: string;
  service_type: string;
}

// ============================================
// PROJECT FILTERS
// ============================================
export interface ProjectFilters {
  client_id: string;
  service_type: string;
  status: string;
  date_from: string;
  date_to: string;
}

// ============================================
// PAYMENT FILTERS
// ============================================
export interface PaymentFilters {
  month: string;
  client_id: string;
  project_id: string;
}
