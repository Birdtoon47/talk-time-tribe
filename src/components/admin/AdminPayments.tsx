
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CreditCard } from "lucide-react";
import { safeGetItem, safeSetItem } from "@/utils/storage";
import { v4 as uuidv4 } from "uuid";
import AddPaymentMethodModal from "./AddPaymentMethodModal";
import PaymentDetailsModal from "./PaymentDetailsModal";

// Define Payment type
interface Payment {
  id: string;
  date: string;
  amount: number;
  status: string;
  method: string;
  customer: string;
}

// Define PaymentMethod type
interface PaymentMethod {
  id: string;
  name: string;
  processingFee: string;
  isDefault: boolean;
  isEnabled: boolean;
  dateAdded: string;
}

// Initial payments data
const INITIAL_PAYMENTS_DATA: Payment[] = [
  {
    id: "INV-001",
    date: "2023-09-01",
    amount: 120.00,
    status: "Completed",
    method: "Credit Card",
    customer: "John Davis",
  },
  {
    id: "INV-002",
    date: "2023-09-03",
    amount: 75.50,
    status: "Completed",
    method: "PayPal",
    customer: "Sara Johnson",
  },
  {
    id: "INV-003",
    date: "2023-09-05",
    amount: 200.00,
    status: "Pending",
    method: "Bank Transfer",
    customer: "Michael Brown",
  },
  {
    id: "INV-004",
    date: "2023-09-10",
    amount: 45.99,
    status: "Completed",
    method: "Credit Card",
    customer: "Emily Wilson",
  },
  {
    id: "INV-005",
    date: "2023-09-15",
    amount: 350.00,
    status: "Failed",
    method: "Credit Card",
    customer: "Robert Miller",
  },
];

// Initial payment methods
const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm-1",
    name: "Credit Card",
    processingFee: "2.9",
    isDefault: true,
    isEnabled: true,
    dateAdded: "2023-01-15",
  },
  {
    id: "pm-2",
    name: "PayPal",
    processingFee: "3.5",
    isDefault: false,
    isEnabled: true,
    dateAdded: "2023-02-20",
  },
  {
    id: "pm-3",
    name: "Bank Transfer",
    processingFee: "1.0",
    isDefault: false,
    isEnabled: true,
    dateAdded: "2023-03-10",
  },
];

const AdminPayments = () => {
  // State for payments and payment methods
  const [payments, setPayments] = useState<Payment[]>(
    safeGetItem('admin_payments', INITIAL_PAYMENTS_DATA)
  );
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    safeGetItem('admin_payment_methods', INITIAL_PAYMENT_METHODS)
  );
  
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [addPaymentMethodOpen, setAddPaymentMethodOpen] = useState(false);
  const [viewPaymentOpen, setViewPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  
  // Calculate summary stats
  const totalRevenue = payments
    .filter(p => p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);
    
  const pendingPayments = payments
    .filter(p => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);
    
  const failedPayments = payments
    .filter(p => p.status === "Failed")
    .reduce((sum, p) => sum + p.amount, 0);
  
  // Filter payments based on search query
  const filteredPayments = payments.filter(
    (payment) =>
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers for payment operations
  const handleAddPaymentMethod = (data: any) => {
    // If new method is set as default, update all others
    let updatedMethods = [...paymentMethods];
    
    if (data.isDefault) {
      updatedMethods = updatedMethods.map(method => ({
        ...method,
        isDefault: false,
      }));
    }
    
    const newMethod: PaymentMethod = {
      id: uuidv4(),
      name: data.name,
      processingFee: data.processingFee,
      isDefault: data.isDefault,
      isEnabled: data.isEnabled,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    
    const newMethods = [...updatedMethods, newMethod];
    setPaymentMethods(newMethods);
    safeSetItem('admin_payment_methods', newMethods);
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setViewPaymentOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment Management</h2>
        <Button onClick={() => setAddPaymentMethodOpen(true)}>
          <CreditCard className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingPayments.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${failedPayments.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search payments..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                <TableCell>{payment.customer}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    payment.status === "Completed" 
                      ? "bg-green-100 text-green-800" 
                      : payment.status === "Pending" 
                      ? "bg-yellow-100 text-yellow-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {payment.status}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewPayment(payment)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Modals */}
      <AddPaymentMethodModal 
        open={addPaymentMethodOpen} 
        onOpenChange={setAddPaymentMethodOpen} 
        onAddPaymentMethod={handleAddPaymentMethod} 
      />
      
      <PaymentDetailsModal 
        open={viewPaymentOpen} 
        onOpenChange={setViewPaymentOpen} 
        payment={selectedPayment} 
      />
    </div>
  );
};

export default AdminPayments;
