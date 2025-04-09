
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CreditCard, Wallet, Banknote } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'ewallet';
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  provider?: string;
  number?: string;
}

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedId: string | null;
  onChange: (id: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethods,
  selectedId,
  onChange
}) => {
  if (!paymentMethods.length) return null;

  // Select first method by default if none selected
  React.useEffect(() => {
    if (paymentMethods.length > 0 && !selectedId) {
      onChange(paymentMethods[0].id);
    }
  }, [paymentMethods, selectedId, onChange]);

  const renderIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-5 w-5 text-app-purple" />;
      case 'bank':
        return <Banknote className="h-5 w-5 text-app-purple" />;
      case 'ewallet':
        return <Wallet className="h-5 w-5 text-app-purple" />;
      default:
        return <CreditCard className="h-5 w-5 text-app-purple" />;
    }
  };

  const renderMethodDetails = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return (
          <>
            <div className="font-medium">•••• {method.cardNumber}</div>
            <div className="text-sm text-gray-500">{method.cardName} • Expires {method.expiryDate}</div>
          </>
        );
      case 'bank':
        return (
          <>
            <div className="font-medium">{method.bankName}</div>
            <div className="text-sm text-gray-500">•••• {method.accountNumber} • {method.accountHolderName}</div>
          </>
        );
      case 'ewallet':
        return (
          <>
            <div className="font-medium">{method.provider}</div>
            <div className="text-sm text-gray-500">•••• {method.number}</div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <RadioGroup value={selectedId || ''} onValueChange={onChange} className="space-y-3">
      {paymentMethods.map((method) => (
        <div key={method.id} className="flex items-start space-x-2">
          <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
          <Label htmlFor={method.id} className="flex-1 cursor-pointer">
            <Card className={`p-3 ${selectedId === method.id ? 'border-app-purple' : ''}`}>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {renderIcon(method.type)}
                </div>
                <div className="flex-1">
                  {renderMethodDetails(method)}
                </div>
              </div>
            </Card>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default PaymentMethodSelector;
