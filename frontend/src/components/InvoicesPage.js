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
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Download, 
  Eye,
  Calendar,
  Building2,
  Users,
  IndianRupee,
  Calculator
} from 'lucide-react';
import { mockInvoices, mockFirms, mockClients, gstRates, paymentStatuses } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const InvoicesList = () => {
  const { hasAccessToFirm } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    // Load invoices from localStorage or use mock data
    const storedInvoices = localStorage.getItem('invoices');
    const invoicesData = storedInvoices ? JSON.parse(storedInvoices) : mockInvoices;
    setInvoices(invoicesData.filter(invoice => hasAccessToFirm(invoice.firmId)));
  }, [hasAccessToFirm]);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getFirmName(invoice.firmId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClientName(invoice.clientId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.paymentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getFirmName = (firmId) => {
    const firm = mockFirms.find(f => f.id === firmId);
    return firm ? firm.name : 'Unknown Firm';
  };

  const getClientName = (clientId) => {
    const client = mockClients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
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

  const getPaymentStatusBadge = (status) => {
    const statusConfig = paymentStatuses.find(s => s.value === status);
    return (
      <Badge className={`${statusConfig?.color} border-0`}>
        {statusConfig?.label}
      </Badge>
    );
  };

  const handleDelete = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      const updatedInvoices = invoices.filter(i => i.id !== invoiceId);
      setInvoices(updatedInvoices);
      
      // Update localStorage
      const allInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const filteredAllInvoices = allInvoices.filter(i => i.id !== invoiceId);
      localStorage.setItem('invoices', JSON.stringify(filteredAllInvoices));
      
      toast({
        title: "Invoice Deleted",
        description: "The invoice has been successfully deleted.",
      });
    }
  };

  const handleDownloadPDF = (invoice) => {
    // Mock PDF download
    toast({
      title: "PDF Generated",
      description: `Invoice ${invoice.invoiceNumber} PDF is being generated.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-600 mt-1">Manage your invoices and billing</p>
        </div>
        <Link to="/invoices/new">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Create New Invoice
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search invoices, firms, or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {paymentStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {invoice.invoiceNumber}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-4 h-4" />
                            <span>{getFirmName(invoice.firmId)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{getClientName(invoice.clientId)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(invoice.invoiceDate)}</span>
                          </div>
                        </div>
                      </div>
                      {getPaymentStatusBadge(invoice.paymentStatus)}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        <p className="font-medium">{invoice.description}</p>
                        <p>{invoice.quantity} {invoice.unit} × {formatCurrency(invoice.rate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">
                          {formatCurrency(invoice.grandTotal)}
                        </p>
                        {invoice.paymentStatus !== 'paid' && (
                          <p className="text-sm text-red-600">
                            Pending: {formatCurrency(invoice.pendingAmount)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 lg:ml-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPDF(invoice)}
                      className="text-slate-600 hover:text-blue-600"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Link to={`/invoices/view/${invoice.id}`}>
                      <Button variant="outline" size="sm" className="text-slate-600 hover:text-green-600">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to={`/invoices/edit/${invoice.id}`}>
                      <Button variant="outline" size="sm" className="text-slate-600 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-slate-600 hover:text-red-600"
                      onClick={() => handleDelete(invoice.id)}
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
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No invoices found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'No invoices match your search criteria.' 
                : 'Get started by creating your first invoice.'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link to="/invoices/new">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Invoice
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InvoiceForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasAccessToFirm } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    firmId: '',
    clientId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    description: '',
    sacCode: '',
    rate: '',
    quantity: '',
    unit: 'Hours',
    gstRate: 18,
    extraDeductions: 0,
    extraCharges: 0
  });

  const [calculatedAmounts, setCalculatedAmounts] = useState({
    totalAmount: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 0,
    grandTotal: 0
  });

  const [firms, setFirms] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Load firms and clients
    const storedFirms = localStorage.getItem('firms');
    const firmsData = storedFirms ? JSON.parse(storedFirms) : mockFirms;
    setFirms(firmsData.filter(firm => hasAccessToFirm(firm.id)));

    const storedClients = localStorage.getItem('clients');
    const clientsData = storedClients ? JSON.parse(storedClients) : mockClients;
    setClients(clientsData);
  }, [hasAccessToFirm]);

  useEffect(() => {
    // Calculate amounts when relevant fields change
    const rate = parseFloat(formData.rate) || 0;
    const quantity = parseFloat(formData.quantity) || 0;
    const gstRate = parseFloat(formData.gstRate) || 0;
    const extraDeductions = parseFloat(formData.extraDeductions) || 0;
    const extraCharges = parseFloat(formData.extraCharges) || 0;

    const totalAmount = (rate * quantity) + extraCharges - extraDeductions;
    
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    if (gstRate > 0) {
      // For simplicity, assuming same state (CGST + SGST)
      // In real app, this would be determined by comparing firm and client states
      cgstAmount = (totalAmount * gstRate) / 200; // Half of GST
      sgstAmount = (totalAmount * gstRate) / 200; // Half of GST
    }

    const grandTotal = totalAmount + cgstAmount + sgstAmount + igstAmount;

    setCalculatedAmounts({
      totalAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      grandTotal
    });
  }, [formData.rate, formData.quantity, formData.gstRate, formData.extraDeductions, formData.extraCharges]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newInvoice = {
        id: Date.now().toString(),
        ...formData,
        ...calculatedAmounts,
        paymentStatus: 'pending',
        paidAmount: 0,
        pendingAmount: calculatedAmounts.grandTotal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const updatedInvoices = [...existingInvoices, newInvoice];
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));

      toast({
        title: "Invoice Created Successfully",
        description: "Your new invoice has been created and saved.",
      });

      navigate('/invoices');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save invoice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/invoices')} className="p-2">
          <FileText className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEdit ? 'Edit Invoice' : 'Create New Invoice'}
          </h1>
          <p className="text-slate-600 mt-1">
            {isEdit ? 'Update invoice information' : 'Enter invoice details and billing information'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>
                Fill in the invoice information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                    <Input
                      id="invoiceNumber"
                      placeholder="e.g., KDJ/LHR/24-25/19"
                      value={formData.invoiceNumber}
                      onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoiceDate">Invoice Date *</Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={formData.invoiceDate}
                      onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                      required
                    />
                  </div>

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
                    <Label htmlFor="clientId">Client *</Label>
                    <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Input
                      id="description"
                      placeholder="e.g., SAC(Services)/Total Hour(s)"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sacCode">SAC Code</Label>
                    <Input
                      id="sacCode"
                      placeholder="e.g., 9954"
                      value={formData.sacCode}
                      onChange={(e) => handleInputChange('sacCode', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hours">Hours</SelectItem>
                        <SelectItem value="Days">Days</SelectItem>
                        <SelectItem value="Pieces">Pieces</SelectItem>
                        <SelectItem value="Kg">Kg</SelectItem>
                        <SelectItem value="Meters">Meters</SelectItem>
                        <SelectItem value="Job">Job</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate (₹) *</Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 2000"
                      value={formData.rate}
                      onChange={(e) => handleInputChange('rate', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 88.9"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gstRate">GST Rate (%)</Label>
                    <Select value={formData.gstRate.toString()} onValueChange={(value) => handleInputChange('gstRate', parseFloat(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {gstRates.map((rate) => (
                          <SelectItem key={rate.value} value={rate.value.toString()}>
                            {rate.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="extraDeductions">Extra Deductions (₹)</Label>
                    <Input
                      id="extraDeductions"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 5000 (for diesel payment)"
                      value={formData.extraDeductions}
                      onChange={(e) => handleInputChange('extraDeductions', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="extraCharges">Extra Charges (₹)</Label>
                    <Input
                      id="extraCharges"
                      type="number"
                      step="0.01"
                      placeholder="Additional charges"
                      value={formData.extraCharges}
                      onChange={(e) => handleInputChange('extraCharges', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/invoices')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.firmId || !formData.clientId}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <span>{isEdit ? 'Update Invoice' : 'Create Invoice'}</span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Calculation Summary */}
        <div>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>Calculation Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Base Amount:</span>
                  <span className="font-medium">{formatCurrency(calculatedAmounts.totalAmount - (parseFloat(formData.extraCharges) || 0) + (parseFloat(formData.extraDeductions) || 0))}</span>
                </div>
                
                {formData.extraCharges > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Extra Charges:</span>
                    <span className="font-medium text-green-600">+{formatCurrency(parseFloat(formData.extraCharges))}</span>
                  </div>
                )}
                
                {formData.extraDeductions > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Deductions:</span>
                    <span className="font-medium text-red-600">-{formatCurrency(parseFloat(formData.extraDeductions))}</span>
                  </div>
                )}
                
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm text-slate-600">Taxable Amount:</span>
                  <span className="font-medium">{formatCurrency(calculatedAmounts.totalAmount)}</span>
                </div>
                
                {calculatedAmounts.cgstAmount > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">CGST ({formData.gstRate/2}%):</span>
                      <span className="font-medium">{formatCurrency(calculatedAmounts.cgstAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">SGST ({formData.gstRate/2}%):</span>
                      <span className="font-medium">{formatCurrency(calculatedAmounts.sgstAmount)}</span>
                    </div>
                  </>
                )}
                
                {calculatedAmounts.igstAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">IGST ({formData.gstRate}%):</span>
                    <span className="font-medium">{formatCurrency(calculatedAmounts.igstAmount)}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-900">Total Amount:</span>
                  <span className="text-xl font-bold text-slate-900">{formatCurrency(calculatedAmounts.grandTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const InvoicesPage = () => {
  return (
    <Routes>
      <Route index element={<InvoicesList />} />
      <Route path="new" element={<InvoiceForm />} />
      <Route path="edit/:id" element={<InvoiceForm isEdit />} />
      <Route path="view/:id" element={<div>Invoice View (Coming Soon)</div>} />
    </Routes>
  );
};

export default InvoicesPage;
