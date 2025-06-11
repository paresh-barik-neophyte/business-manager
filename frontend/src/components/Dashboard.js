import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Building2, 
  Users, 
  FileText, 
  Receipt, 
  Plus, 
  TrendingUp, 
  Clock, 
  IndianRupee,
  AlertCircle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { mockFirms, mockClients, mockInvoices, mockExpenses, paymentStatuses } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, hasAccessToFirm } = useAuth();
  const [stats, setStats] = useState({
    totalFirms: 0,
    totalClients: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingAmount: 0,
    thisMonthRevenue: 0,
    totalExpenses: 0
  });

  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    // Calculate statistics based on user access
    const accessibleFirms = mockFirms.filter(firm => hasAccessToFirm(firm.id));
    const accessibleInvoices = mockInvoices.filter(invoice => hasAccessToFirm(invoice.firmId));
    const accessibleExpenses = mockExpenses.filter(expense => hasAccessToFirm(expense.firmId));

    const totalRevenue = accessibleInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const pendingAmount = accessibleInvoices
      .filter(inv => inv.paymentStatus !== 'paid')
      .reduce((sum, inv) => sum + inv.pendingAmount, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthRevenue = accessibleInvoices
      .filter(inv => {
        const invDate = new Date(inv.invoiceDate);
        return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
      })
      .reduce((sum, inv) => sum + inv.grandTotal, 0);

    const totalExpenses = accessibleExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    setStats({
      totalFirms: accessibleFirms.length,
      totalClients: mockClients.length,
      totalInvoices: accessibleInvoices.length,
      totalRevenue,
      pendingAmount,
      thisMonthRevenue,
      totalExpenses
    });

    // Recent invoices (last 5)
    setRecentInvoices(
      accessibleInvoices
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    );

    // Recent expenses (last 5)
    setRecentExpenses(
      accessibleExpenses
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    );
  }, [user, hasAccessToFirm]);

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

  const getPaymentStatusBadge = (status) => {
    const statusConfig = paymentStatuses.find(s => s.value === status);
    return (
      <Badge className={`${statusConfig?.color} border-0`}>
        {statusConfig?.label}
      </Badge>
    );
  };

  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      description: 'All time revenue',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Amount',
      value: formatCurrency(stats.pendingAmount),
      icon: Clock,
      description: 'Outstanding payments',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'This Month',
      value: formatCurrency(stats.thisMonthRevenue),
      icon: Activity,
      description: 'Current month revenue',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(stats.totalExpenses),
      icon: Receipt,
      description: 'All expenses',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    }
  ];

  const quickActions = [
    {
      title: 'New Invoice',
      description: 'Create a new invoice',
      icon: FileText,
      href: '/invoices/new',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Add Client',
      description: 'Add new client',
      icon: Users,
      href: '/clients/new',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Add Firm',
      description: 'Register new firm',
      icon: Building2,
      href: '/firms/new',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Record Expense',
      description: 'Add new expense',
      icon: Receipt,
      href: '/expenses/new',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Welcome back, {user?.name}! Here's your business overview.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1">
            {user?.role === 'admin' ? 'Administrator' : 'User'}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className={`${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Common tasks to get you started quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-slate-200 cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Recent Invoices</span>
              </CardTitle>
              <CardDescription>Latest billing activity</CardDescription>
            </div>
            <Link to="/invoices">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.length > 0 ? (
                recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatDate(invoice.invoiceDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(invoice.grandTotal)}
                      </p>
                      {getPaymentStatusBadge(invoice.paymentStatus)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No invoices yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="w-5 h-5" />
                <span>Recent Expenses</span>
              </CardTitle>
              <CardDescription>Latest expense records</CardDescription>
            </div>
            <Link to="/expenses">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExpenses.length > 0 ? (
                recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {expense.description}
                      </p>
                      <p className="text-sm text-slate-500">
                        {expense.category} • {formatDate(expense.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">
                        -{formatCurrency(expense.amount)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No expenses yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
