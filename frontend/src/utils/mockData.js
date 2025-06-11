// Mock data for the application
export const mockFirms = [
  {
    id: '1',
    name: 'MAA DURGA ENGINEERING',
    description: 'MECHANICAL, ELECTRICAL & CIVIL CONTRACTOR',
    gstNumber: 'SBINO010243',
    permanentAddress: 'At-Sarbhara, P.O.-Niundi, Dist-Keonjhar, Odisha - 758032',
    presentAddress: 'At-Jarali, Jajang, Bamebari, Keonjhar (Mayurbhanja), P.O.-Jajang, Dist-Keonjhar, Odisha - 758032',
    phone: '9437240540',
    proprietor: 'Prop. Jogendra Mahanta',
    accountNumber: '30383830248',
    ifscCode: 'SBIN0010243',
    letterheadType: 'template',
    letterheadUrl: null,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'JASOBANTA MAHANTA',
    description: 'A CLASS (DEGREE ENGG.) CONTRACTOR',
    gstNumber: null,
    permanentAddress: 'JAROLI, JAJANG, BAMEBARI, KEONJHAR, ODISHA, 758034',
    presentAddress: 'JAROLI, JAJANG, BAMEBARI, KEONJHAR, ODISHA, 758034',
    phone: '8763221699, 9337021898',
    proprietor: 'Jasobanta Mahanta',
    accountNumber: null,
    ifscCode: null,
    letterheadType: 'template',
    letterheadUrl: null,
    createdAt: '2024-02-10T14:20:00Z',
    updatedAt: '2024-02-10T14:20:00Z'
  }
];

export const mockClients = [
  {
    id: '1',
    name: 'U.K. ENTERPRISES',
    address: 'JAROLI, JAJANG, BAMEBARI, KEONJHAR',
    phone: '9876543210',
    email: 'uk.enterprises@email.com',
    gstNumber: 'GSTIN123456789',
    state: 'Odisha',
    pincode: '758034',
    createdAt: '2024-01-20T09:15:00Z'
  },
  {
    id: '2',
    name: 'BALAJI CONSTRUCTION',
    address: 'KEONJHAR TOWN, ODISHA',
    phone: '9123456789',
    email: 'balaji.const@email.com',
    gstNumber: 'GSTIN987654321',
    state: 'Odisha',
    pincode: '758001',
    createdAt: '2024-02-05T11:30:00Z'
  },
  {
    id: '3',
    name: 'MODERN BUILDERS',
    address: 'BHUBANESWAR, ODISHA',
    phone: '9988776655',
    email: 'modern.builders@email.com',
    gstNumber: 'GSTIN456789123',
    state: 'Odisha',
    pincode: '751001',
    createdAt: '2024-02-12T16:45:00Z'
  }
];

export const mockInvoices = [
  {
    id: '1',
    invoiceNumber: 'KDJ/LHR/24-25/19',
    firmId: '1',
    clientId: '1',
    invoiceDate: '2025-01-02',
    description: 'SAC(Services)/Total Hour(s)',
    sacCode: '9954',
    rate: 2000,
    quantity: 88.9,
    unit: 'Hours',
    totalAmount: 177800,
    gstRate: 18,
    cgstAmount: 16002,
    sgstAmount: 16002,
    igstAmount: 0,
    grandTotal: 209804,
    paymentStatus: 'pending',
    paidAmount: 0,
    pendingAmount: 209804,
    createdAt: '2025-01-02T10:30:00Z',
    updatedAt: '2025-01-02T10:30:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'JM/2025/001',
    firmId: '2',
    clientId: '2',
    invoiceDate: '2025-01-15',
    description: 'Construction Services',
    sacCode: null,
    rate: 50000,
    quantity: 1,
    unit: 'Job',
    totalAmount: 50000,
    gstRate: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 0,
    grandTotal: 50000,
    paymentStatus: 'paid',
    paidAmount: 50000,
    pendingAmount: 0,
    createdAt: '2025-01-15T14:20:00Z',
    updatedAt: '2025-01-15T14:20:00Z'
  }
];

export const mockExpenses = [
  {
    id: '1',
    firmId: '1',
    description: 'Diesel Payment',
    amount: 5000,
    category: 'Fuel',
    date: '2025-01-05',
    attachments: [],
    createdAt: '2025-01-05T09:00:00Z'
  },
  {
    id: '2',
    firmId: '1',
    description: 'Equipment Maintenance',
    amount: 12000,
    category: 'Maintenance',
    date: '2025-01-10',
    attachments: [],
    createdAt: '2025-01-10T11:30:00Z'
  }
];

export const mockUsers = [
  {
    id: '1',
    name: 'Jogendra Mahanta',
    email: 'jogendra@email.com',
    role: 'admin',
    firmAccess: ['1', '2'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Assistant Manager',
    email: 'assistant@email.com',
    role: 'user',
    firmAccess: ['1'],
    createdAt: '2024-01-15T00:00:00Z'
  }
];

// GST rates configuration
export const gstRates = [
  { value: 0, label: '0% (Exempt)' },
  { value: 5, label: '5%' },
  { value: 12, label: '12%' },
  { value: 18, label: '18%' },
  { value: 28, label: '28%' }
];

// Indian states for GST calculation
export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Andaman and Nicobar Islands'
];

// Payment status options
export const paymentStatuses = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'partial', label: 'Partially Paid', color: 'bg-blue-100 text-blue-800' },
  { value: 'paid', label: 'Fully Paid', color: 'bg-green-100 text-green-800' }
];

// Expense categories
export const expenseCategories = [
  'Fuel', 'Maintenance', 'Equipment', 'Materials', 'Labor', 'Transport', 
  'Office Supplies', 'Professional Services', 'Utilities', 'Other'
];
