/**
 * Freelance OS - Data Table Component
 */

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T extends Record<string, unknown>> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  searchFields?: string[];
  statusField?: string;
  statusOptions?: { value: string; label: string; color?: string }[];
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  addButtonLabel?: string;
  idKey?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  title,
  subtitle,
  columns,
  data,
  searchFields = [],
  statusField,
  statusOptions = [],
  onAdd,
  onEdit,
  onDelete,
  onView,
  addButtonLabel = 'إضافة جديد',
  idKey = 'id',
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter data
  const filteredData = data.filter((item) => {
    // Search filter
    if (searchQuery && searchFields.length > 0) {
      const matchesSearch = searchFields.some((field) => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && statusField) {
      const itemStatus = item[statusField];
      if (itemStatus !== statusFilter) return false;
    }

    return true;
  });

  const getStatusBadgeColor = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        {onAdd && (
          <Button onClick={onAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            {addButtonLabel}
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {searchFields.length > 0 && (
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        )}
        {statusOptions.length > 0 && (
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="الحالة" />
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
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                {columns.map((column) => (
                  <TableHead key={column.key} className={cn('text-right', column.width)}>
                    {column.header}
                  </TableHead>
                ))}
                {(onEdit || onDelete || onView) && (
                  <TableHead className="text-left w-32">الإجراءات</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)}
                    className="h-32 text-center text-slate-500"
                  >
                    لا توجد بيانات
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={String(item[idKey as keyof T]) || index} className="hover:bg-slate-50">
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render ? (
                          column.render(item)
                        ) : statusField === column.key ? (
                          <Badge className={cn('font-medium', getStatusBadgeColor(String(item[column.key as keyof T])))}>
                            {statusOptions.find((opt) => opt.value === item[column.key as keyof T])?.label || String(item[column.key as keyof T])}
                          </Badge>
                        ) : (
                          String(item[column.key as keyof T] || '-')
                        )}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete || onView) && (
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {onView && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onView(item)}
                              className="h-8 w-8 text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(item)}
                              className="h-8 w-8 text-amber-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(item)}
                              className="h-8 w-8 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>إجمالي: {filteredData.length}</span>
      </div>
    </div>
  );
}
