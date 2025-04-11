
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BalanceCardProps {
  userData: any;
  isOwnProfile: boolean;
  handleWithdraw: () => void;
  formatCurrency: (amount: number) => string;
  setIsAddBalanceOpen: (isOpen: boolean) => void;
  isAddBalanceOpen: boolean;
  amountToAdd: number;
  setAmountToAdd: (amount: number) => void;
  handleAddBalance: () => void;
}

const BalanceCard = ({
  userData,
  isOwnProfile,
  handleWithdraw,
  formatCurrency,
  setIsAddBalanceOpen,
  isAddBalanceOpen,
  amountToAdd,
  setAmountToAdd,
  handleAddBalance
}: BalanceCardProps) => {
  return (
    <>
      <div className="mt-6">
        <h4 className="font-medium text-gray-700 mb-2">Earnings</h4>
        
        <Card className="p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Current Balance</p>
              <p className="font-bold text-xl">{formatCurrency(userData.balance || 0)}</p>
              {userData.totalWithdrawn > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Total withdrawn: {formatCurrency(userData.totalWithdrawn)}
                </p>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={handleWithdraw}
                disabled={userData.balance < 50000}
                className="bg-app-green"
              >
                Withdraw
              </Button>
              
              {isOwnProfile && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAddBalanceOpen(true)}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Balance (Test)
                </Button>
              )}
            </div>
          </div>
          
          {userData.balance < 50000 && (
            <p className="text-xs text-gray-500 mt-2">
              You need at least {formatCurrency(50000)} to withdraw
            </p>
          )}
          
          <div className="mt-3 text-xs text-gray-500 p-2 bg-gray-100 rounded-md">
            <p>Note: A 10% platform fee is applied to all withdrawals.</p>
          </div>
        </Card>
      </div>

      <Dialog open={isAddBalanceOpen} onOpenChange={setIsAddBalanceOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Balance (For Testing)</DialogTitle>
            <DialogDescription>
              Add funds to your creator balance for testing withdrawal functionality.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Add</Label>
              <Input 
                id="amount" 
                type="number"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500">
                This will add {formatCurrency(amountToAdd)} to your balance
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              className="bg-app-green" 
              onClick={handleAddBalance}
            >
              Add Balance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BalanceCard;
