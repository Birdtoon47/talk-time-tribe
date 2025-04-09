
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PaymentFormProps {
  paymentMethod: string;
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
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentMethod,
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
  handleCvvChange
}) => {
  return (
    <>
      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                type="password"
                value={cvv}
                onChange={handleCvvChange}
                required
              />
            </div>
          </div>
        </div>
      )}
      
      {paymentMethod === 'bank' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              placeholder="Bank Name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="accountHolderName">Account Holder Name</Label>
            <Input
              id="accountHolderName"
              placeholder="John Doe"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="bankAccountNumber">Account Number</Label>
            <Input
              id="bankAccountNumber"
              placeholder="1234567890"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
        </div>
      )}
      
      {paymentMethod === 'ewallet' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="ewalletProvider">E-Wallet Provider</Label>
            <Input
              id="ewalletProvider"
              placeholder="Provider (e.g. PayPal, Venmo)"
              value={ewalletProvider}
              onChange={(e) => setEwalletProvider(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="ewalletNumber">E-Wallet Number/ID</Label>
            <Input
              id="ewalletNumber"
              placeholder="Your account number or ID"
              value={ewalletNumber}
              onChange={(e) => setEwalletNumber(e.target.value)}
              required
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentForm;
