/**
 * Freelance OS - Expenses Module
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
import { EXPENSE_CATEGORIES } from '@/types';
import type { Expense, ExpenseFormData } from '@/types';

const categoryOptions = EXPENSE_CATEGORIES.map(cat => ({
  value: cat,
  label: cat === 'Ads' ? 'إعلانات' :
         cat === 'Tools' ? 'أدوات' :
         cat === 'Subscriptions' ? 'اشتراكات' :
         cat === 'Hosting' ? 'استضافة' : 'أخرى',
  color: cat === 'Ads' ? 'bg-red-100 text-red-800' :
        cat === 'Tools' ? 'bg-blue-100 text-blue-800' :
        cat === 'Subscriptions' ? 'bg-purple-100 text-purple-800' :
        cat === 'Hosting' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
}));

const initialFormData: ExpenseFormData = {
  title: '',
  amount: 0,
  category: 'Other',
  date: new Date().toISOString().split('T')[0],
  notes: '',
};

function formatCurrency(amount: number, currency = 'SAR') {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface ExpenseRow extends Record<string, unknown> {
  expense_id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
  created_at: string;
}

export function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState<ExpenseFormData>(initialFormData);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await api.expenses.getAll();
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const handleAdd = () => {
    setEditingExpense(null);
    setFormData(initialFormData);
    setModalOpen(true);
  };

  const handleEdit = (expense: ExpenseRow) => {
    const fullExpense = expenses.find(e => e.expense_id === expense.expense_id);
    if (fullExpense) {
      setEditingExpense(fullExpense);
      setFormData({
        title: fullExpense.title,
        amount: fullExpense.amount,
        category: fullExpense.category,
        date: fullExpense.date,
        notes: fullExpense.notes,
      });
      setModalOpen(true);
    }
  };

  const handleDelete = async (expense: ExpenseRow) => {
    if (!confirm('هل أنت متأكد من حذف هذه المصروفات؟')) return;
    
    try {
      await api.expenses.delete(expense.expense_id);
      await loadExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingExpense) {
        await api.expenses.update(editingExpense.expense_id, formData);
      } else {
        await api.expenses.create(formData);
      }
      await loadExpenses();
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const columns = [
    { key: 'expense_id', header: 'الرمز', width: 'w-24' },
    { 
      key: 'title', 
      header: 'البند',
      render: (expense: ExpenseRow) => (
        <div>
          <p className="font-medium">{expense.title}</p>
          {expense.notes && (
            <p className="text-sm text-slate-500">{expense.notes}</p>
          )}
        </div>
      ),
    },
    { 
      key: 'amount', 
      header: 'المبلغ',
      render: (expense: ExpenseRow) => (
        <span className="font-medium text-red-600">
          {formatCurrency(expense.amount)}
        </span>
      ),
    },
    {
      key: 'category',
      header: 'التصنيف',
      render: (expense: ExpenseRow) => (
        <Badge className={categoryOptions.find(c => c.value === expense.category)?.color || ''}>
          {categoryOptions.find(c => c.value === expense.category)?.label || expense.category}
        </Badge>
      ),
    },
    { 
      key: 'date', 
      header: 'التاريخ',
      render: (expense: ExpenseRow) => new Date(expense.date).toLocaleDateString('ar-SA'),
    },
  ];

  const tableData: ExpenseRow[] = expenses.map(e => ({ ...e }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">المصروفات</h1>
        <p className="text-slate-500">تتبع مصروفات العمل</p>
      </div>

      {/* Total Card */}
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800">إجمالي المصروفات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
        </CardContent>
      </Card>

      {/* Data Table */}
      <DataTable
        title=""
        columns={columns}
        data={tableData}
        searchFields={['title', 'notes']}
        statusField="category"
        statusOptions={categoryOptions}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonLabel="مصروف جديد"
        idKey="expense_id"
      />

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingExpense ? 'تعديل مصروف' : 'مصروف جديد'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">البند *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="مثال: اشتراك Canva"
                required
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
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
                <Label htmlFor="date">التاريخ</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">التصنيف</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="أي ملاحظات إضافية"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                {editingExpense ? 'حفظ التغييرات' : 'إضافة المصروف'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
