
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

const monthlyRevenue = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 4500 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 3500 },
  { name: "May", revenue: 4800 },
  { name: "Jun", revenue: 6000 },
  { name: "Jul", revenue: 5500 },
  { name: "Aug", revenue: 7000 },
  { name: "Sep", revenue: 6500 },
  { name: "Oct", revenue: 7500 },
  { name: "Nov", revenue: 8000 },
  { name: "Dec", revenue: 9500 }
];

const userStatistics = [
  { name: "Week 1", users: 100, creators: 12 },
  { name: "Week 2", users: 120, creators: 15 },
  { name: "Week 3", users: 130, creators: 18 },
  { name: "Week 4", users: 160, creators: 20 },
  { name: "Week 5", users: 180, creators: 22 },
  { name: "Week 6", users: 220, creators: 25 },
  { name: "Week 7", users: 250, creators: 30 },
  { name: "Week 8", users: 280, creators: 32 }
];

const paymentMethods = [
  { name: "Credit Card", value: 65 },
  { name: "PayPal", value: 20 },
  { name: "Bank Transfer", value: 10 },
  { name: "Other", value: 5 }
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const AdminAnalytics = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyRevenue}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={userStatistics}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" name="Users" />
                  <Line type="monotone" dataKey="creators" stroke="#82ca9d" name="Creators" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
