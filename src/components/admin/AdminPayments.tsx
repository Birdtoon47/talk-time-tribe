
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
import { Search, CreditCard, Plus } from "lucide-react";
import { useState } from "react";

const PAYMENTS_DATA = [
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

const AdminPayments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPayments = PAYMENTS_DATA.filter(
    (payment) =>
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment Management</h2>
        <Button>
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
            <div className="text-2xl font-bold">$48,294.00</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,200.00</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$350.00</div>
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
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPayments;
