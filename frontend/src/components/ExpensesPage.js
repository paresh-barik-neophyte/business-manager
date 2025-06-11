import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Receipt, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  Building2,
  Paperclip,
  Filter,
  TrendingDown
} from 'lucide-react';
import { mockExpenses, mockFirms, expenseCategories } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const ExpensesList = () => {
  const { hasAccessToFirm } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [firmFilter, setFirmFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    // Load expenses from localStorage or use mock data
    const storedExpenses = localStorage.getItem('expenses');
    const expensesData = storedExpenses ? JSON.parse(storedExpenses) : mockExpenses;
    setExpenses(expensesData.filter(expense => hasAccessToFirm(expense.firmId)));
  }, [hasAccessToFirm]);

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesFirm = firmFilter === 'all' || expense.firmId === firmFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const expenseDate = new Date(expense.date);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = expenseDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = expenseDate >= weekAgo;
          break;
        case 'month':
          matchesDate = expenseDate.getMonth() === today.getMonth() && 
                      expenseDate.getFullYear() === today.getFullYear();
          break;
        case 'year':
          matchesDate = expenseDate.getFullYear() === today.getFullYear();
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesFirm && matchesDate;
  });

  const getFirmName = (firmId) => {
    const firm = mockFirms.find(f => f.id === firmId);
    return firm ? firm.name : 'Unknown Firm';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTotalExpenses = () => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Fuel': 'bg-red-100 text-red-800',
      'Maintenance': 'bg-blue-100 text-blue-800',
      'Equipment': 'bg-purple-100 text-purple-800',
      'Materials': 'bg-green-100 text-green-800',
      'Labor': 'bg-yellow-100 text-yellow-800',
      'Transport': 'bg-indigo-100 text-indigo-800',
      'Office Supplies': 'bg-pink-100 text-pink-800',
      'Professional Services': 'bg-teal-100 text-teal-800',
      'Utilities': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  const handleDelete = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const updatedExpenses = expenses.filter(e => e.id !== expenseId);
      setExpenses(updatedExpenses);
      
      // Update localStorage
      const allExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const filteredAllExpenses = allExpenses.filter(e => e.id !== expenseId);
      localStorage.setItem('expenses', JSON.stringify(filteredAllExpenses));
      
      toast({
        title: "Expense Deleted",
        description: "The expense has been successfully deleted.",
      });
    }
  };

  const accessibleFirms = mockFirms.filter(firm => hasAccessToFirm(firm.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Expenses</h1>
          <p className="text-slate-600 mt-1">Track and manage your business expenses</p>
        </div>
        <Link to="/expenses/new">
          <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Add New Expense
          </Button>
        </Link>
      </div>

      {/* Summary Card */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-red-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">
                Total Expenses {categoryFilter !== 'all' && `(${categoryFilter})`}
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {formatCurrency(getTotalExpenses())}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
              <TrendingDown className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {expenseCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={firmFilter} onValueChange={setFirmFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Firms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Firms</SelectItem>
            {accessibleFirms.map((firm) => (
              <SelectItem key={firm.id} value={firm.id}>
                {firm.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <Card key={expense.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {expense.description}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-4 h-4" />
                            <span>{getFirmName(expense.firmId)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(expense.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getCategoryColor(expense.category)} border-0`}>
                          {expense.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {expense.attachments && expense.attachments.length > 0 && (
                          <div className="flex items-center space-x-1 text-sm text-slate-500">
                            <Paperclip className="w-4 h-4" />
                            <span>{expense.attachments.length} attachment{expense.attachments.length !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600">
                          -{formatCurrency(expense.amount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 lg:ml-6">
                    <Link to={`/expenses/edit/${expense.id}`}>
                      <Button variant="outline" size="sm" className="text-slate-600 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-slate-600 hover:text-red-600"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No expenses found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || categoryFilter !== 'all' || firmFilter !== 'all' || dateFilter !== 'all'
                ? 'No expenses match your search criteria.' 
                : 'Get started by recording your first expense.'}
            </p>
            {!searchTerm && categoryFilter === 'all' && firmFilter === 'all' && dateFilter === 'all' && (
              <Link to="/expenses/new">
                <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Record Your First Expense
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ExpenseForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasAccessToFirm } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firmId: '',
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    attachments: []
  });

  const [firms, setFirms] = useState([]);

  useEffect(() => {
    // Load firms
    const storedFirms = localStorage.getItem('firms');
    const firmsData = storedFirms ? JSON.parse(storedFirms) : mockFirms;
    setFirms(firmsData.filter(firm => hasAccessToFirm(firm.id)));
  }, [hasAccessToFirm]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const filePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            data: event.target.result
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(fileData => {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...fileData]
      }));
    });
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newExpense = {
        id: Date.now().toString(),
        ...formData,
        amount: parseFloat(formData.amount),
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const updatedExpenses = [...existingExpenses, newExpense];
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

      toast({
        title: "Expense Added Successfully",
        description: "Your expense has been recorded and saved.",
      });

      navigate('/expenses');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save expense. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/expenses')} className="p-2">
          <Receipt className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEdit ? 'Edit Expense' : 'Add New Expense'}
          </h1>
          <p className="text-slate-600 mt-1">
            {isEdit ? 'Update expense information' : 'Record a new business expense'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>
            Fill in the expense information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firmId">Firm *</Label>
                <Select value={formData.firmId} onValueChange={(value) => handleInputChange('firmId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select firm" />
                  </SelectTrigger>
                  <SelectContent>
                    {firms.map((firm) => (
                      <SelectItem key={firm.id} value={firm.id}>
                        {firm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  placeholder="e.g., Diesel Payment, Equipment Maintenance"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 5000"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="attachments">Attachments (Optional)</Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-slate-500">
                  Supported formats: Images, PDF, DOC, DOCX (Max 5MB each)
                </p>
              </div>

              {/* Attachments Preview */}
              {formData.attachments.length > 0 && (
                <div className="md:col-span-2 space-y-2">
                  <Label>Uploaded Files</Label>
                  <div className="space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Paperclip className="w-4 h-4 text-slate-500" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">{file.name}</p>
                            <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/expenses')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.firmId}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <span>{isEdit ? 'Update Expense' : 'Add Expense'}</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const ExpensesPage = () => {
  return (
    <Routes>
      <Route index element={<ExpensesList />} />
      <Route path="new" element={<ExpenseForm />} />
      <Route path="edit/:id" element={<ExpenseForm isEdit />} />
    </Routes>
  );
};

export default ExpensesPage;
