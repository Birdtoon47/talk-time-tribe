
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, UserRound } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface UserDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    joinedDate: string;
  } | null;
}

const UserDetailsModal = ({ open, onOpenChange, user }: UserDetailsProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            User details and account information.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge className={user.role === "Admin" 
                ? "bg-blue-100 text-blue-800" 
                : user.role === "Creator" 
                ? "bg-purple-100 text-purple-800" 
                : "bg-gray-100 text-gray-800"}>
                {user.role}
              </Badge>
              
              <Badge className={user.status === "Active" 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"}>
                {user.status}
              </Badge>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-3 py-2">
          <div className="flex items-center">
            <UserRound className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">User ID: {user.id}</span>
          </div>
          
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">Email: {user.email}</span>
          </div>
          
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">Joined: {new Date(user.joinedDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
