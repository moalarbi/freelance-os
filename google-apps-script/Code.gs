/**
 * Freelance OS - Google Apps Script Backend
 * Personal Freelance Operations System
 */

// ============================================
// CONFIGURATION
// ============================================
const SHEET_NAMES = {
  CLIENTS: 'Clients',
  PROJECTS: 'Projects',
  INVOICES: 'Invoices',
  PAYMENTS: 'Payments',
  TASKS: 'Tasks',
  EXPENSES: 'Expenses',
  SETTINGS: 'Settings',
  LISTS: 'Lists'
};

// CORS Headers for GitHub Pages
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// ============================================
// MAIN HANDLERS
// ============================================

function doGet(e) {
  const action = e.parameter.action;
  
  try {
    let result;
    
    switch (action) {
      case 'getClients':
        result = getClients();
        break;
      case 'getProjects':
        result = getProjects();
        break;
      case 'getInvoices':
        result = getInvoices();
        break;
      case 'getPayments':
        result = getPayments();
        break;
      case 'getTasks':
        result = getTasks();
        break;
      case 'getExpenses':
        result = getExpenses();
        break;
      case 'getDashboardStats':
        result = getDashboardStats();
        break;
      case 'getSettings':
        result = getSettings();
        break;
      case 'getLists':
        result = getLists();
        break;
      default:
        return jsonResponse({ error: 'Unknown action: ' + action }, 400);
    }
    
    return jsonResponse({ success: true, data: result });
    
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}

function doPost(e) {
  const action = e.parameter.action;
  const data = JSON.parse(e.postData.contents);
  
  try {
    let result;
    
    switch (action) {
      case 'createClient':
        result = createClient(data);
        break;
      case 'updateClient':
        result = updateClient(data);
        break;
      case 'createProject':
        result = createProject(data);
        break;
      case 'updateProject':
        result = updateProject(data);
        break;
      case 'createInvoice':
        result = createInvoice(data);
        break;
      case 'updateInvoice':
        result = updateInvoice(data);
        break;
      case 'createPayment':
        result = createPayment(data);
        break;
      case 'updatePayment':
        result = updatePayment(data);
        break;
      case 'createTask':
        result = createTask(data);
        break;
      case 'updateTask':
        result = updateTask(data);
        break;
      case 'updateTaskStatus':
        result = updateTaskStatus(data.task_id, data.status);
        break;
      case 'createExpense':
        result = createExpense(data);
        break;
      case 'updateExpense':
        result = updateExpense(data);
        break;
      case 'deleteClient':
        result = deleteClient(data.client_id);
        break;
      case 'deleteProject':
        result = deleteProject(data.project_id);
        break;
      case 'deleteInvoice':
        result = deleteInvoice(data.invoice_id);
        break;
      case 'deletePayment':
        result = deletePayment(data.payment_id);
        break;
      case 'deleteTask':
        result = deleteTask(data.task_id);
        break;
      case 'deleteExpense':
        result = deleteExpense(data.expense_id);
        break;
      default:
        return jsonResponse({ error: 'Unknown action: ' + action }, 400);
    }
    
    return jsonResponse({ success: true, data: result });
    
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(CORS_HEADERS);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function jsonResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    output.setHeader(key, value);
  }
  
  return output;
}

function getSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    initializeSheetHeaders(sheetName, sheet);
  }
  
  return sheet;
}

function initializeSheetHeaders(sheetName, sheet) {
  const headers = {
    [SHEET_NAMES.CLIENTS]: ['client_id', 'client_name', 'company_name', 'phone', 'whatsapp', 'email', 'city', 'country', 'source', 'client_type', 'status', 'notes', 'created_at', 'updated_at'],
    [SHEET_NAMES.PROJECTS]: ['project_id', 'client_id', 'project_name', 'project_type', 'service_type', 'description', 'start_date', 'due_date', 'delivery_date', 'project_value', 'paid_amount', 'remaining_amount', 'currency', 'status', 'priority', 'progress_percent', 'notes', 'created_at', 'updated_at'],
    [SHEET_NAMES.INVOICES]: ['invoice_id', 'invoice_number', 'client_id', 'project_id', 'invoice_date', 'due_date', 'subtotal', 'tax_rate', 'tax_amount', 'total', 'amount_paid', 'amount_due', 'currency', 'invoice_status', 'notes', 'created_at', 'updated_at'],
    [SHEET_NAMES.PAYMENTS]: ['payment_id', 'project_id', 'client_id', 'invoice_id', 'payment_date', 'amount', 'currency', 'payment_method', 'payment_status', 'reference_number', 'notes', 'created_at', 'updated_at'],
    [SHEET_NAMES.TASKS]: ['task_id', 'project_id', 'client_id', 'task_title', 'task_description', 'status', 'priority', 'due_date', 'assigned_to', 'created_at', 'completed_at', 'notes', 'updated_at'],
    [SHEET_NAMES.EXPENSES]: ['expense_id', 'title', 'amount', 'category', 'date', 'notes', 'created_at'],
    [SHEET_NAMES.SETTINGS]: ['setting_key', 'setting_value'],
    [SHEET_NAMES.LISTS]: ['list_name', 'list_value', 'sort_order', 'is_active']
  };
  
  if (headers[sheetName]) {
    sheet.getRange(1, 1, 1, headers[sheetName].length).setValues([headers[sheetName]]);
    sheet.getRange(1, 1, 1, headers[sheetName].length).setFontWeight('bold');
  }
}

function getNextId(prefix) {
  const sheet = getSheet('Settings');
  const data = sheet.getDataRange().getValues();
  let lastNumber = 0;
  
  const prefixKey = prefix.replace('-', '_').toLowerCase() + '_last_number';
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === prefixKey) {
      lastNumber = parseInt(data[i][1]) || 0;
      break;
    }
  }
  
  const newNumber = lastNumber + 1;
  return prefix + String(newNumber).padStart(4, '0');
}

function updateLastId(prefix) {
  const sheet = getSheet('Settings');
  const data = sheet.getDataRange().getValues();
  
  const prefixKey = prefix.replace('-', '_').toLowerCase() + '_last_number';
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === prefixKey) {
      const currentNumber = parseInt(data[i][1]) || 0;
      sheet.getRange(i + 1, 2).setValue(currentNumber + 1);
      return;
    }
  }
  
  // If not found, create it
  sheet.appendRow([prefixKey, 1]);
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function getTimestamp() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

function getMonthYear(date) {
  if (!date) return '';
  const d = new Date(date);
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM');
}

function getCurrentMonthYear() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM');
}

// ============================================
// CLIENTS MODULE
// ============================================

function getClients() {
  const sheet = getSheet(SHEET_NAMES.CLIENTS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const clients = [];
  
  for (let i = 1; i < data.length; i++) {
    const client = {};
    for (let j = 0; j < headers.length; j++) {
      client[headers[j]] = data[i][j] || '';
    }
    clients.push(client);
  }
  
  return clients;
}

function createClient(data) {
  const sheet = getSheet(SHEET_NAMES.CLIENTS);
  const clientId = getNextId('CL-');
  updateLastId('CL-');
  
  const timestamp = getTimestamp();
  const row = [
    clientId,
    data.client_name || '',
    data.company_name || '',
    data.phone || '',
    data.whatsapp || '',
    data.email || '',
    data.city || '',
    data.country || '',
    data.source || '',
    data.client_type || '',
    data.status || 'Active',
    data.notes || '',
    timestamp,
    timestamp
  ];
  
  sheet.appendRow(row);
  
  return { client_id: clientId, ...data, created_at: timestamp, updated_at: timestamp };
}

function updateClient(data) {
  const sheet = getSheet(SHEET_NAMES.CLIENTS);
  const data_values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data_values.length; i++) {
    if (data_values[i][0] === data.client_id) {
      const timestamp = getTimestamp();
      const headers = data_values[0];
      
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        if (data.hasOwnProperty(header) && header !== 'client_id' && header !== 'created_at') {
          sheet.getRange(i + 1, j + 1).setValue(data[header]);
        }
      }
      
      // Update updated_at
      const updatedAtIndex = headers.indexOf('updated_at');
      if (updatedAtIndex >= 0) {
        sheet.getRange(i + 1, updatedAtIndex + 1).setValue(timestamp);
      }
      
      return { ...data, updated_at: timestamp };
    }
  }
  
  throw new Error('Client not found: ' + data.client_id);
}

function deleteClient(clientId) {
  const sheet = getSheet(SHEET_NAMES.CLIENTS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === clientId) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Client deleted' };
    }
  }
  
  throw new Error('Client not found: ' + clientId);
}

// ============================================
// PROJECTS MODULE
// ============================================

function getProjects() {
  const sheet = getSheet(SHEET_NAMES.PROJECTS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const projects = [];
  
  for (let i = 1; i < data.length; i++) {
    const project = {};
    for (let j = 0; j < headers.length; j++) {
      project[headers[j]] = data[i][j] || '';
    }
    projects.push(project);
  }
  
  return projects;
}

function createProject(data) {
  const sheet = getSheet(SHEET_NAMES.PROJECTS);
  const projectId = getNextId('PR-');
  updateLastId('PR-');
  
  const projectValue = parseFloat(data.project_value) || 0;
  const paidAmount = parseFloat(data.paid_amount) || 0;
  const remainingAmount = projectValue - paidAmount;
  
  const timestamp = getTimestamp();
  const row = [
    projectId,
    data.client_id || '',
    data.project_name || '',
    data.project_type || '',
    data.service_type || 'Other',
    data.description || '',
    formatDate(data.start_date),
    formatDate(data.due_date),
    formatDate(data.delivery_date),
    projectValue,
    paidAmount,
    remainingAmount,
    data.currency || 'USD',
    data.status || 'Pending',
    data.priority || 'Medium',
    data.progress_percent || 0,
    data.notes || '',
    timestamp,
    timestamp
  ];
  
  sheet.appendRow(row);
  
  return { 
    project_id: projectId, 
    ...data, 
    remaining_amount: remainingAmount,
    created_at: timestamp, 
    updated_at: timestamp 
  };
}

function updateProject(data) {
  const sheet = getSheet(SHEET_NAMES.PROJECTS);
  const data_values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data_values.length; i++) {
    if (data_values[i][0] === data.project_id) {
      const timestamp = getTimestamp();
      const headers = data_values[0];
      
      // Calculate remaining amount if value or paid amount changed
      let projectValue = data_values[i][9];
      let paidAmount = data_values[i][10];
      
      if (data.project_value !== undefined) projectValue = parseFloat(data.project_value) || 0;
      if (data.paid_amount !== undefined) paidAmount = parseFloat(data.paid_amount) || 0;
      
      const remainingAmount = projectValue - paidAmount;
      
      // Update fields
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        if (header === 'remaining_amount') {
          sheet.getRange(i + 1, j + 1).setValue(remainingAmount);
        } else if (data.hasOwnProperty(header) && header !== 'project_id' && header !== 'created_at' && header !== 'remaining_amount') {
          sheet.getRange(i + 1, j + 1).setValue(data[header]);
        }
      }
      
      // Update updated_at
      const updatedAtIndex = headers.indexOf('updated_at');
      if (updatedAtIndex >= 0) {
        sheet.getRange(i + 1, updatedAtIndex + 1).setValue(timestamp);
      }
      
      return { ...data, remaining_amount: remainingAmount, updated_at: timestamp };
    }
  }
  
  throw new Error('Project not found: ' + data.project_id);
}

function deleteProject(projectId) {
  const sheet = getSheet(SHEET_NAMES.PROJECTS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === projectId) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Project deleted' };
    }
  }
  
  throw new Error('Project not found: ' + projectId);
}

// ============================================
// INVOICES MODULE
// ============================================

function getInvoices() {
  const sheet = getSheet(SHEET_NAMES.INVOICES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const invoices = [];
  
  for (let i = 1; i < data.length; i++) {
    const invoice = {};
    for (let j = 0; j < headers.length; j++) {
      invoice[headers[j]] = data[i][j] || '';
    }
    invoices.push(invoice);
  }
  
  return invoices;
}

function createInvoice(data) {
  const sheet = getSheet(SHEET_NAMES.INVOICES);
  const invoiceId = getNextId('INV-');
  updateLastId('INV-');
  
  const subtotal = parseFloat(data.subtotal) || 0;
  const taxRate = parseFloat(data.tax_rate) || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  const amountPaid = parseFloat(data.amount_paid) || 0;
  const amountDue = total - amountPaid;
  
  const timestamp = getTimestamp();
  const row = [
    invoiceId,
    data.invoice_number || invoiceId,
    data.client_id || '',
    data.project_id || '',
    formatDate(data.invoice_date),
    formatDate(data.due_date),
    subtotal,
    taxRate,
    taxAmount,
    total,
    amountPaid,
    amountDue,
    data.currency || 'USD',
    data.invoice_status || 'Draft',
    data.notes || '',
    timestamp,
    timestamp
  ];
  
  sheet.appendRow(row);
  
  return { 
    invoice_id: invoiceId, 
    ...data, 
    tax_amount: taxAmount,
    total: total,
    amount_due: amountDue,
    created_at: timestamp, 
    updated_at: timestamp 
  };
}

function updateInvoice(data) {
  const sheet = getSheet(SHEET_NAMES.INVOICES);
  const data_values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data_values.length; i++) {
    if (data_values[i][0] === data.invoice_id) {
      const timestamp = getTimestamp();
      const headers = data_values[0];
      
      // Recalculate totals if needed
      let subtotal = data_values[i][6];
      let taxRate = data_values[i][7];
      let amountPaid = data_values[i][10];
      
      if (data.subtotal !== undefined) subtotal = parseFloat(data.subtotal) || 0;
      if (data.tax_rate !== undefined) taxRate = parseFloat(data.tax_rate) || 0;
      if (data.amount_paid !== undefined) amountPaid = parseFloat(data.amount_paid) || 0;
      
      const taxAmount = subtotal * (taxRate / 100);
      const total = subtotal + taxAmount;
      const amountDue = total - amountPaid;
      
      // Update fields
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        if (header === 'tax_amount') {
          sheet.getRange(i + 1, j + 1).setValue(taxAmount);
        } else if (header === 'total') {
          sheet.getRange(i + 1, j + 1).setValue(total);
        } else if (header === 'amount_due') {
          sheet.getRange(i + 1, j + 1).setValue(amountDue);
        } else if (data.hasOwnProperty(header) && header !== 'invoice_id' && header !== 'created_at' && header !== 'tax_amount' && header !== 'total' && header !== 'amount_due') {
          sheet.getRange(i + 1, j + 1).setValue(data[header]);
        }
      }
      
      // Update updated_at
      const updatedAtIndex = headers.indexOf('updated_at');
      if (updatedAtIndex >= 0) {
        sheet.getRange(i + 1, updatedAtIndex + 1).setValue(timestamp);
      }
      
      return { 
        ...data, 
        tax_amount: taxAmount,
        total: total,
        amount_due: amountDue,
        updated_at: timestamp 
      };
    }
  }
  
  throw new Error('Invoice not found: ' + data.invoice_id);
}

function deleteInvoice(invoiceId) {
  const sheet = getSheet(SHEET_NAMES.INVOICES);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === invoiceId) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Invoice deleted' };
    }
  }
  
  throw new Error('Invoice not found: ' + invoiceId);
}

// ============================================
// PAYMENTS MODULE
// ============================================

function getPayments() {
  const sheet = getSheet(SHEET_NAMES.PAYMENTS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const payments = [];
  
  for (let i = 1; i < data.length; i++) {
    const payment = {};
    for (let j = 0; j < headers.length; j++) {
      payment[headers[j]] = data[i][j] || '';
    }
    payments.push(payment);
  }
  
  return payments;
}

function createPayment(data) {
  const sheet = getSheet(SHEET_NAMES.PAYMENTS);
  const paymentId = getNextId('PAY-');
  updateLastId('PAY-');
  
  const timestamp = getTimestamp();
  const row = [
    paymentId,
    data.project_id || '',
    data.client_id || '',
    data.invoice_id || '',
    formatDate(data.payment_date),
    parseFloat(data.amount) || 0,
    data.currency || 'USD',
    data.payment_method || '',
    data.payment_status || 'Pending',
    data.reference_number || '',
    data.notes || '',
    timestamp,
    timestamp
  ];
  
  sheet.appendRow(row);
  
  // Update related invoice and project
  if (data.invoice_id) {
    updateInvoicePayment(data.invoice_id, parseFloat(data.amount) || 0);
  }
  
  if (data.project_id) {
    updateProjectPayment(data.project_id, parseFloat(data.amount) || 0);
  }
  
  return { payment_id: paymentId, ...data, created_at: timestamp, updated_at: timestamp };
}

function updateInvoicePayment(invoiceId, amount) {
  try {
    const sheet = getSheet(SHEET_NAMES.INVOICES);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === invoiceId) {
        const currentPaid = parseFloat(data[i][10]) || 0;
        const total = parseFloat(data[i][9]) || 0;
        const newPaid = currentPaid + amount;
        const newDue = total - newPaid;
        
        // Update amount_paid (column 11)
        sheet.getRange(i + 1, 11).setValue(newPaid);
        // Update amount_due (column 12)
        sheet.getRange(i + 1, 12).setValue(newDue);
        
        // Update status if fully paid
        if (newDue <= 0) {
          sheet.getRange(i + 1, 15).setValue('Paid');
        } else if (newPaid > 0) {
          sheet.getRange(i + 1, 15).setValue('Partial');
        }
        
        break;
      }
    }
  } catch (e) {
    console.error('Error updating invoice payment: ' + e);
  }
}

function updateProjectPayment(projectId, amount) {
  try {
    const sheet = getSheet(SHEET_NAMES.PROJECTS);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === projectId) {
        const currentPaid = parseFloat(data[i][10]) || 0;
        const projectValue = parseFloat(data[i][9]) || 0;
        const newPaid = currentPaid + amount;
        const newRemaining = projectValue - newPaid;
        
        // Update paid_amount (column 11)
        sheet.getRange(i + 1, 11).setValue(newPaid);
        // Update remaining_amount (column 12)
        sheet.getRange(i + 1, 12).setValue(newRemaining);
        
        break;
      }
    }
  } catch (e) {
    console.error('Error updating project payment: ' + e);
  }
}

function updatePayment(data) {
  const sheet = getSheet(SHEET_NAMES.PAYMENTS);
  const data_values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data_values.length; i++) {
    if (data_values[i][0] === data.payment_id) {
      const timestamp = getTimestamp();
      const headers = data_values[0];
      
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        if (data.hasOwnProperty(header) && header !== 'payment_id' && header !== 'created_at') {
          sheet.getRange(i + 1, j + 1).setValue(data[header]);
        }
      }
      
      // Update updated_at
      const updatedAtIndex = headers.indexOf('updated_at');
      if (updatedAtIndex >= 0) {
        sheet.getRange(i + 1, updatedAtIndex + 1).setValue(timestamp);
      }
      
      return { ...data, updated_at: timestamp };
    }
  }
  
  throw new Error('Payment not found: ' + data.payment_id);
}

function deletePayment(paymentId) {
  const sheet = getSheet(SHEET_NAMES.PAYMENTS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === paymentId) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Payment deleted' };
    }
  }
  
  throw new Error('Payment not found: ' + paymentId);
}

// ============================================
// TASKS MODULE
// ============================================

function getTasks() {
  const sheet = getSheet(SHEET_NAMES.TASKS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const tasks = [];
  
  for (let i = 1; i < data.length; i++) {
    const task = {};
    for (let j = 0; j < headers.length; j++) {
      task[headers[j]] = data[i][j] || '';
    }
    tasks.push(task);
  }
  
  return tasks;
}

function createTask(data) {
  const sheet = getSheet(SHEET_NAMES.TASKS);
  const taskId = getNextId('TSK-');
  updateLastId('TSK-');
  
  const timestamp = getTimestamp();
  const row = [
    taskId,
    data.project_id || '',
    data.client_id || '',
    data.task_title || '',
    data.task_description || '',
    data.status || 'Pending',
    data.priority || 'Medium',
    formatDate(data.due_date),
    data.assigned_to || '',
    timestamp,
    '',
    data.notes || '',
    timestamp
  ];
  
  sheet.appendRow(row);
  
  return { task_id: taskId, ...data, created_at: timestamp, updated_at: timestamp };
}

function updateTask(data) {
  const sheet = getSheet(SHEET_NAMES.TASKS);
  const data_values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data_values.length; i++) {
    if (data_values[i][0] === data.task_id) {
      const timestamp = getTimestamp();
      const headers = data_values[0];
      
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        if (data.hasOwnProperty(header) && header !== 'task_id' && header !== 'created_at') {
          sheet.getRange(i + 1, j + 1).setValue(data[header]);
        }
      }
      
      // Update updated_at
      const updatedAtIndex = headers.indexOf('updated_at');
      if (updatedAtIndex >= 0) {
        sheet.getRange(i + 1, updatedAtIndex + 1).setValue(timestamp);
      }
      
      return { ...data, updated_at: timestamp };
    }
  }
  
  throw new Error('Task not found: ' + data.task_id);
}

function updateTaskStatus(taskId, status) {
  const sheet = getSheet(SHEET_NAMES.TASKS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === taskId) {
      const timestamp = getTimestamp();
      const headers = data[0];
      
      const statusIndex = headers.indexOf('status');
      if (statusIndex >= 0) {
        sheet.getRange(i + 1, statusIndex + 1).setValue(status);
      }
      
      // Update completed_at if status is Completed
      if (status === 'Completed') {
        const completedAtIndex = headers.indexOf('completed_at');
        if (completedAtIndex >= 0) {
          sheet.getRange(i + 1, completedAtIndex + 1).setValue(timestamp);
        }
      }
      
      // Update updated_at
      const updatedAtIndex = headers.indexOf('updated_at');
      if (updatedAtIndex >= 0) {
        sheet.getRange(i + 1, updatedAtIndex + 1).setValue(timestamp);
      }
      
      return { task_id: taskId, status: status, updated_at: timestamp };
    }
  }
  
  throw new Error('Task not found: ' + taskId);
}

function deleteTask(taskId) {
  const sheet = getSheet(SHEET_NAMES.TASKS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === taskId) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Task deleted' };
    }
  }
  
  throw new Error('Task not found: ' + taskId);
}

// ============================================
// EXPENSES MODULE
// ============================================

function getExpenses() {
  const sheet = getSheet(SHEET_NAMES.EXPENSES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const expenses = [];
  
  for (let i = 1; i < data.length; i++) {
    const expense = {};
    for (let j = 0; j < headers.length; j++) {
      expense[headers[j]] = data[i][j] || '';
    }
    expenses.push(expense);
  }
  
  return expenses;
}

function createExpense(data) {
  const sheet = getSheet(SHEET_NAMES.EXPENSES);
  const expenseId = getNextId('EXP-');
  updateLastId('EXP-');
  
  const timestamp = getTimestamp();
  const row = [
    expenseId,
    data.title || '',
    parseFloat(data.amount) || 0,
    data.category || 'Other',
    formatDate(data.date),
    data.notes || '',
    timestamp
  ];
  
  sheet.appendRow(row);
  
  return { expense_id: expenseId, ...data, created_at: timestamp };
}

function updateExpense(data) {
  const sheet = getSheet(SHEET_NAMES.EXPENSES);
  const data_values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data_values.length; i++) {
    if (data_values[i][0] === data.expense_id) {
      const headers = data_values[0];
      
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        if (data.hasOwnProperty(header) && header !== 'expense_id' && header !== 'created_at') {
          sheet.getRange(i + 1, j + 1).setValue(data[header]);
        }
      }
      
      return { ...data };
    }
  }
  
  throw new Error('Expense not found: ' + data.expense_id);
}

function deleteExpense(expenseId) {
  const sheet = getSheet(SHEET_NAMES.EXPENSES);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === expenseId) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Expense deleted' };
    }
  }
  
  throw new Error('Expense not found: ' + expenseId);
}

// ============================================
// SETTINGS MODULE
// ============================================

function getSettings() {
  const sheet = getSheet(SHEET_NAMES.SETTINGS);
  const data = sheet.getDataRange().getValues();
  const settings = {};
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      settings[data[i][0]] = data[i][1];
    }
  }
  
  return settings;
}

// ============================================
// LISTS MODULE
// ============================================

function getLists() {
  const sheet = getSheet(SHEET_NAMES.LISTS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const lists = {};
  
  for (let i = 1; i < data.length; i++) {
    const listName = data[i][0];
    const listValue = data[i][1];
    const isActive = data[i][3];
    
    if (listName && isActive !== false) {
      if (!lists[listName]) {
        lists[listName] = [];
      }
      lists[listName].push(listValue);
    }
  }
  
  return lists;
}

// ============================================
// DASHBOARD STATS
// ============================================

function getDashboardStats() {
  const clients = getClients();
  const projects = getProjects();
  const invoices = getInvoices();
  const payments = getPayments();
  const tasks = getTasks();
  const expenses = getExpenses();
  
  const currentMonth = getCurrentMonthYear();
  
  // Calculate stats
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Active').length;
  
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  
  const totalProjectValue = projects.reduce((sum, p) => sum + (parseFloat(p.project_value) || 0), 0);
  const totalPaid = projects.reduce((sum, p) => sum + (parseFloat(p.paid_amount) || 0), 0);
  const totalRemaining = projects.reduce((sum, p) => sum + (parseFloat(p.remaining_amount) || 0), 0);
  
  const totalInvoices = invoices.length;
  const pendingInvoices = invoices.filter(i => i.invoice_status === 'Pending' || i.invoice_status === 'Draft').length;
  const overdueInvoices = invoices.filter(i => {
    if (i.invoice_status === 'Paid') return false;
    const dueDate = new Date(i.due_date);
    return dueDate < new Date();
  }).length;
  
  const totalInvoiced = invoices.reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0);
  const totalInvoiceDue = invoices.reduce((sum, i) => sum + (parseFloat(i.amount_due) || 0), 0);
  
  const totalPayments = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const paymentsThisMonth = payments
    .filter(p => getMonthYear(p.payment_date) === currentMonth)
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const pendingPayments = totalRemaining;
  
  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const expensesThisMonth = expenses
    .filter(e => getMonthYear(e.date) === currentMonth)
    .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  
  const totalProfit = totalPayments - totalExpenses;
  const profitThisMonth = paymentsThisMonth - expensesThisMonth;
  
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;
  
  // Recent items
  const recentProjects = projects.slice(-5).reverse();
  const recentInvoices = invoices.slice(-5).reverse();
  const recentTasks = tasks.filter(t => t.status !== 'Completed').slice(0, 5);
  
  // Revenue by month (last 6 months)
  const revenueByMonth = [];
  const monthNames = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthYear = Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM');
    const monthName = monthNames[d.getMonth()];
    
    const monthRevenue = payments
      .filter(p => getMonthYear(p.payment_date) === monthYear)
      .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    
    revenueByMonth.push({ month: monthName, revenue: monthRevenue });
  }
  
  // Revenue by service type
  const revenueByServiceType = [];
  const serviceTypeRevenue = {};
  
  projects.forEach(p => {
    const serviceType = p.service_type || 'Other';
    if (!serviceTypeRevenue[serviceType]) {
      serviceTypeRevenue[serviceType] = 0;
    }
    serviceTypeRevenue[serviceType] += parseFloat(p.paid_amount) || 0;
  });
  
  for (const [service_type, revenue] of Object.entries(serviceTypeRevenue)) {
    revenueByServiceType.push({ service_type, revenue });
  }
  
  // Project status distribution
  const projectStatusDistribution = [];
  const statusCount = {};
  
  projects.forEach(p => {
    if (!statusCount[p.status]) {
      statusCount[p.status] = 0;
    }
    statusCount[p.status]++;
  });
  
  for (const [status, count] of Object.entries(statusCount)) {
    projectStatusDistribution.push({ status, count });
  }
  
  return {
    clients: {
      total: totalClients,
      active: activeClients
    },
    projects: {
      total: totalProjects,
      active: activeProjects,
      completed: completedProjects,
      total_value: totalProjectValue,
      total_paid: totalPaid,
      total_remaining: totalRemaining
    },
    invoices: {
      total: totalInvoices,
      pending: pendingInvoices,
      overdue: overdueInvoices,
      total_invoiced: totalInvoiced,
      total_due: totalInvoiceDue
    },
    payments: {
      total: totalPayments,
      this_month: paymentsThisMonth,
      pending: pendingPayments
    },
    expenses: {
      total: totalExpenses,
      this_month: expensesThisMonth
    },
    profit: {
      total: totalProfit,
      this_month: profitThisMonth
    },
    tasks: {
      total: totalTasks,
      pending: pendingTasks,
      in_progress: inProgressTasks,
      completed: completedTasks,
      high_priority: highPriorityTasks
    },
    recent: {
      projects: recentProjects,
      invoices: recentInvoices,
      tasks: recentTasks
    },
    revenueByMonth,
    revenueByServiceType,
    projectStatusDistribution
  };
}
