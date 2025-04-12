
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, CreditCard, DollarSign, User } from "lucide-react";

interface PaymentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: {
    id: string;
    date: string;
    amount: number;
    status: string;
    method: string;
    customer: string;
  } | null;
}

const PaymentDetailsModal = ({ open, onOpenChange, payment }: PaymentDetailsModalProps) => {
  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>
            Payment information and transaction details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Invoice</p>
              <p className="font-semibold">{payment.id}</p>
            </div>
            <Badge
              className={`${
                payment.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : payment.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {payment.status}
            </Badge>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold">${payment.amount.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Transaction Amount</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Customer: <span className="font-medium">{payment.customer}</span></span>
            </div>

            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">
                Date: <span className="font-medium">
                  {new Date(payment.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </span>
            </div>

            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">
                Payment Method: <span className="font-medium">{payment.method}</span>
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>Download Receipt</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailsModal;
