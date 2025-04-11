
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Check, Loader, X, Clock, ArrowDownToLine } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { safeGetItem, safeSetItem } from '@/utils/storage';

interface WithdrawalStatusProps {
  userId: string;
  formatCurrency: (amount: number) => string;
  currencyCode?: string;
}

type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  fee: number;
  status: WithdrawalStatus;
  createdAt: string;
  updatedAt: string;
  estimatedCompletionDate?: string;
  failureReason?: string;
}

export const WithdrawalStatus = ({ userId, formatCurrency, currencyCode = 'IDR' }: WithdrawalStatusProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  
  useEffect(() => {
    // Load withdrawals from storage
    const storedWithdrawals = safeGetItem(`talktribe_withdrawals_${userId}`, []);
    setWithdrawals(storedWithdrawals);
  }, [userId]);
  
  const getStatusIcon = (status: WithdrawalStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-500" />;
    }
  };
  
  const getStatusText = (status: WithdrawalStatus) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
    }
  };
  
  const getStatusColor = (status: WithdrawalStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
    }
  };
  
  return (
    <>
      <Button 
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1"
      >
        <ArrowDownToLine className="h-4 w-4 mr-1" />
        Withdrawal History
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Withdrawal History</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[400px] pr-4">
            {withdrawals.length > 0 ? (
              <div className="space-y-4">
                {withdrawals.map((withdrawal) => (
                  <Card key={withdrawal.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{formatCurrency(withdrawal.amount)}</p>
                        <p className="text-xs text-gray-500">
                          Fee: {formatCurrency(withdrawal.fee)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(withdrawal.createdAt).toLocaleString()}
                        </p>
                      </div>
                      
                      <Badge className={getStatusColor(withdrawal.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(withdrawal.status)}
                          {getStatusText(withdrawal.status)}
                        </span>
                      </Badge>
                    </div>
                    
                    {withdrawal.status === 'pending' && withdrawal.estimatedCompletionDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Estimated completion: {new Date(withdrawal.estimatedCompletionDate).toLocaleDateString()}
                      </p>
                    )}
                    
                    {withdrawal.status === 'failed' && withdrawal.failureReason && (
                      <p className="text-xs text-red-500 mt-2">
                        Reason: {withdrawal.failureReason}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No withdrawal history</p>
              </div>
            )}
          </ScrollArea>
          
          <DialogClose asChild>
            <Button variant="outline" className="w-full">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WithdrawalStatus;
