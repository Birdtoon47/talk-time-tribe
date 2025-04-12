
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, UserPlus } from "lucide-react";

const USERS_DATA = [
  {
    id: "1",
    name: "John Davis",
    email: "john.davis@example.com",
    role: "User",
    status: "Active",
    joinedDate: "2023-05-15",
  },
  {
    id: "2",
    name: "Sara Johnson",
    email: "sara.johnson@example.com",
    role: "Creator",
    status: "Active",
    joinedDate: "2023-06-20",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Admin",
    status: "Active",
    joinedDate: "2023-04-10",
  },
  {
    id: "4",
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    role: "Creator",
    status: "Inactive",
    joinedDate: "2023-07-22",
  },
  {
    id: "5",
    name: "Robert Miller",
    email: "robert.miller@example.com",
    role: "User",
    status: "Active",
    joinedDate: "2023-08-05",
  },
];

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredUsers = USERS_DATA.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.role === "Admin" 
                      ? "bg-blue-100 text-blue-800" 
                      : user.role === "Creator" 
                      ? "bg-purple-100 text-purple-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {user.role}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.status === "Active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {user.status}
                  </div>
                </TableCell>
                <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit user</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete user
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
