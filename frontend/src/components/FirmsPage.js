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
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MapPin, 
  Phone, 
  FileText,
  CreditCard,
  User
} from 'lucide-react';
import { mockFirms } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const FirmsList = () => {
  const { hasAccessToFirm } = useAuth();
  const [firms, setFirms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load firms from localStorage or use mock data
    const storedFirms = localStorage.getItem('firms');
    const firmsData = storedFirms ? JSON.parse(storedFirms) : mockFirms;
    setFirms(firmsData.filter(firm => hasAccessToFirm(firm.id)));
  }, [hasAccessToFirm]);

  const filteredFirms = firms.filter(firm =>
    firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    firm.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (firmId) => {
    if (window.confirm('Are you sure you want to delete this firm?')) {
      const updatedFirms = firms.filter(f => f.id !== firmId);
      setFirms(updatedFirms);
      
      // Update localStorage
      const allFirms = JSON.parse(localStorage.getItem('firms') || '[]');
      const filteredAllFirms = allFirms.filter(f => f.id !== firmId);
      localStorage.setItem('firms', JSON.stringify(filteredAllFirms));
      
      toast({
        title: "Firm Deleted",
        description: "The firm has been successfully deleted.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Firms</h1>
          <p className="text-slate-600 mt-1">Manage your business firms and letterheads</p>
        </div>
        <Link to="/firms/new">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Add New Firm
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search firms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200"
        />
      </div>

      {/* Firms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFirms.length > 0 ? (
          filteredFirms.map((firm) => (
            <Card key={firm.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900 leading-tight">
                        {firm.name}
                      </CardTitle>
                      {firm.gstNumber && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          GST Registered
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Link to={`/firms/edit/${firm.id}`}>
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-slate-500 hover:text-red-600"
                      onClick={() => handleDelete(firm.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm font-medium text-slate-700 mb-4">
                  {firm.description}
                </CardDescription>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <User className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600">{firm.proprietor}</span>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 line-clamp-2">
                      {firm.permanentAddress}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-600">{firm.phone}</span>
                  </div>
                  
                  {firm.gstNumber && (
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{firm.gstNumber}</span>
                    </div>
                  )}
                  
                  {firm.accountNumber && (
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="text-sm text-slate-600">
                        {firm.accountNumber} ({firm.ifscCode})
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No firms found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm ? 'No firms match your search criteria.' : 'Get started by adding your first firm.'}
            </p>
            {!searchTerm && (
              <Link to="/firms/new">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Firm
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const FirmForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    proprietor: '',
    gstNumber: '',
    permanentAddress: '',
    presentAddress: '',
    phone: '',
    accountNumber: '',
    ifscCode: '',
    letterheadType: 'template'
  });

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

      const newFirm = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingFirms = JSON.parse(localStorage.getItem('firms') || '[]');
      const updatedFirms = [...existingFirms, newFirm];
      localStorage.setItem('firms', JSON.stringify(updatedFirms));

      toast({
        title: "Firm Added Successfully",
        description: "Your new firm has been created and saved.",
      });

      navigate('/firms');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save firm. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/firms')} className="p-2">
          <Building2 className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEdit ? 'Edit Firm' : 'Add New Firm'}
          </h1>
          <p className="text-slate-600 mt-1">
            {isEdit ? 'Update firm information' : 'Enter your firm details and letterhead preferences'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Firm Information</CardTitle>
          <CardDescription>
            Fill in the details for your business firm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Firm Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., MAA DURGA ENGINEERING"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proprietor">Proprietor Name *</Label>
                <Input
                  id="proprietor"
                  placeholder="e.g., Prop. Jogendra Mahanta"
                  value={formData.proprietor}
                  onChange={(e) => handleInputChange('proprietor', e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Business Description *</Label>
                <Input
                  id="description"
                  placeholder="e.g., MECHANICAL, ELECTRICAL & CIVIL CONTRACTOR"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="e.g., 9437240540"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstNumber">GST Number</Label>
                <Input
                  id="gstNumber"
                  placeholder="e.g., SBINO010243"
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="permanentAddress">Permanent Address *</Label>
                <Textarea
                  id="permanentAddress"
                  placeholder="Enter permanent address"
                  value={formData.permanentAddress}
                  onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="presentAddress">Present Address</Label>
                <Textarea
                  id="presentAddress"
                  placeholder="Enter present address (leave blank if same as permanent)"
                  value={formData.presentAddress}
                  onChange={(e) => handleInputChange('presentAddress', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Bank Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="e.g., 30383830248"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  placeholder="e.g., SBIN0010243"
                  value={formData.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="letterheadType">Letterhead Type</Label>
                <Select value={formData.letterheadType} onValueChange={(value) => handleInputChange('letterheadType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="template">Use Template</SelectItem>
                    <SelectItem value="upload">Upload Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/firms')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <span>{isEdit ? 'Update Firm' : 'Create Firm'}</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const FirmsPage = () => {
  return (
    <Routes>
      <Route index element={<FirmsList />} />
      <Route path="new" element={<FirmForm />} />
      <Route path="edit/:id" element={<FirmForm isEdit />} />
    </Routes>
  );
};

export default FirmsPage;
