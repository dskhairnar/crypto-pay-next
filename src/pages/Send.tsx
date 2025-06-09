
'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send as SendIcon, Contact, CheckCircle, AlertCircle } from 'lucide-react';
import { useStellar } from '@/contexts/StellarContext';
import { useToast } from '@/hooks/use-toast';

export default function Send() {
  const { wallet, sendPayment, loading, contacts, balances } = useStellar();
  const { toast } = useToast();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedContact, setSelectedContact] = useState('');

  const handleContactSelect = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      setRecipient(contact.publicKey);
      setSelectedContact(contactId);
    }
  };

  const handleSend = async () => {
    if (!recipient || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    const success = await sendPayment(recipient, amount, memo);
    if (success) {
      toast({
        title: "Success!",
        description: "Payment sent successfully",
      });
      setRecipient('');
      setAmount('');
      setMemo('');
      setSelectedContact('');
    } else {
      toast({
        title: "Error",
        description: "Failed to send payment",
        variant: "destructive",
      });
    }
  };

  const nativeBalance = balances.find(b => b.asset_type === 'native')?.balance || '0';

  if (!wallet?.funded) {
    return (
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Send Payment
            </h1>
            <p className="text-muted-foreground mt-1">
              Send XLM to other Stellar addresses
            </p>
          </div>

          <Card className="stellar-card p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Wallet Not Funded</h3>
            <p className="text-muted-foreground">
              Please fund your wallet first to send payments
            </p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Send Payment
          </h1>
          <p className="text-muted-foreground mt-1">
            Send XLM to other Stellar addresses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send Form */}
          <div className="lg:col-span-2">
            <Card className="stellar-card p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 stellar-gradient rounded-lg flex items-center justify-center">
                    <SendIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Send Payment</h3>
                </div>

                {/* Quick Contact Selection */}
                {contacts.length > 0 && (
                  <div className="space-y-2">
                    <Label>Quick Select Contact</Label>
                    <Select value={selectedContact} onValueChange={handleContactSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contact" />
                      </SelectTrigger>
                      <SelectContent>
                        {contacts.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            <div className="flex items-center gap-2">
                              <Contact className="w-4 h-4" />
                              {contact.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Recipient */}
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Address *</Label>
                  <Input
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="G... (Stellar public key)"
                    className="font-mono text-xs"
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (XLM) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.0000001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: {parseFloat(nativeBalance).toFixed(7)} XLM
                  </p>
                </div>

                {/* Memo */}
                <div className="space-y-2">
                  <Label htmlFor="memo">Memo (Optional)</Label>
                  <Textarea
                    id="memo"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="Add a note to your payment"
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleSend}
                  disabled={loading || !recipient || !amount}
                  className="w-full stellar-gradient text-white hover:opacity-90"
                  size="lg"
                >
                  {loading ? "Sending..." : "Send Payment"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Balance Overview */}
          <Card className="stellar-card p-6">
            <h3 className="text-lg font-semibold mb-4">Account Balance</h3>
            
            <div className="space-y-3">
              {balances.map((balance, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div>
                    <p className="font-medium">{balance.asset_code}</p>
                    {balance.asset_issuer && (
                      <p className="text-xs text-muted-foreground">
                        {balance.asset_issuer.slice(0, 8)}...
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {parseFloat(balance.balance).toFixed(7)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
