
import React from 'react';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CreditCard, Wallet, Banknote } from 'lucide-react';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import PaymentForm from '@/components/checkout/PaymentForm';

interface PaymentMethodCardProps {
  savedPaymentMethods: any[];
  selectedPaymentMethodId: string | null;
  setSelectedPaymentMethodId: (id: string) => void;
  showAddNewPayment: boolean;
  setShowAddNewPayment: (show: boolean) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  savePaymentMethod: () => void;
  // Form props
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardName: string;
  setCardName: (value: string) => void;
  expiryDate: string;
  setExpiryDate: (value: string) => void;
  cvv: string;
  setCvv: (value: string) => void;
  bankAccountNumber: string;
  setBankAccountNumber: (value: string) => void;
  bankName: string;
  setBankName: (value: string) => void;
  accountHolderName: string;
  setAccountHolderName: (value: string) => void;
  ewalletProvider: string;
  setEwalletProvider: (value: string) => void;
  ewalletNumber: string;
  setEwalletNumber: (value: string) => void;
  handleCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExpiryDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCvvChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  savedPaymentMethods,
  selectedPaymentMethodId,
  setSelectedPaymentMethodId,
  showAddNewPayment,
  setShowAddNewPayment,
  paymentMethod,
  setPaymentMethod,
  savePaymentMethod,
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
  bankAccountNumber,
  setBankAccountNumber,
  bankName,
  setBankName,
  accountHolderName,
  setAccountHolderName,
  ewalletProvider,
  setEwalletProvider,
  ewalletNumber,
  setEwalletNumber,
  handleCardNumberChange,
  handleExpiryDateChange,
  handleCvvChange,
  handleSubmit
}) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Payment Method</h2>
      
      {savedPaymentMethods.length > 0 && !showAddNewPayment && (
        <PaymentMethodSelector 
          paymentMethods={savedPaymentMethods}
          selectedId={selectedPaymentMethodId}
          onChange={setSelectedPaymentMethodId}
        />
      )}
      
      {(!savedPaymentMethods.length || showAddNewPayment) && (
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-4">
          <div className="flex items-center space-x-2 p-2 border rounded-md mb-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex-1 cursor-pointer">
              <div className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Credit/Debit Card
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-2 border rounded-md mb-2">
            <RadioGroupItem value="bank" id="bank" />
            <Label htmlFor="bank" className="flex-1 cursor-pointer">
              <div className="flex items-center">
                <Banknote className="mr-2 h-4 w-4" />
                Bank Transfer
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="ewallet" id="ewallet" />
            <Label htmlFor="ewallet" className="flex-1 cursor-pointer">
              <div className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                E-Wallet
              </div>
            </Label>
          </div>
        </RadioGroup>
      )}
      
      {(!savedPaymentMethods.length || showAddNewPayment) && (
        <form onSubmit={handleSubmit}>
          <PaymentForm
            paymentMethod={paymentMethod}
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            cardName={cardName}
            setCardName={setCardName}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            cvv={cvv}
            setCvv={setCvv}
            bankAccountNumber={bankAccountNumber}
            setBankAccountNumber={setBankAccountNumber}
            bankName={bankName}
            setBankName={setBankName}
            accountHolderName={accountHolderName}
            setAccountHolderName={setAccountHolderName}
            ewalletProvider={ewalletProvider}
            setEwalletProvider={setEwalletProvider}
            ewalletNumber={ewalletNumber}
            setEwalletNumber={setEwalletNumber}
            handleCardNumberChange={handleCardNumberChange}
            handleExpiryDateChange={handleExpiryDateChange}
            handleCvvChange={handleCvvChange}
          />
        </form>
      )}
      
      {savedPaymentMethods.length > 0 && !showAddNewPayment && (
        <Button 
          variant="outline" 
          onClick={() => setShowAddNewPayment(true)}
          className="mt-4"
        >
          Add New Payment Method
        </Button>
      )}
      
      {showAddNewPayment && (
        <div className="flex space-x-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowAddNewPayment(false);
              if (savedPaymentMethods.length > 0 && !selectedPaymentMethodId) {
                setSelectedPaymentMethodId(savedPaymentMethods[0].id);
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={savePaymentMethod}
          >
            Save Payment Method
          </Button>
        </div>
      )}
    </Card>
  );
};

export default PaymentMethodCard;
