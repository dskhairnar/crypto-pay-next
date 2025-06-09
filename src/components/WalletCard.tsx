
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, Copy, Eye, EyeOff, Download, Upload } from 'lucide-react';
import { useStellar } from '@/contexts/StellarContext';
import { useToast } from '@/hooks/use-toast';

export default function WalletCard() {
  const { wallet, generateWallet, importWallet, fundWallet, clearWallet, loading } = useStellar();
  const { toast } = useToast();
  const [showSecret, setShowSecret] = useState(false);
  const [importKey, setImportKey] = useState('');
  const [showImport, setShowImport] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const handleFundWallet = async () => {
    const success = await fundWallet();
    if (success) {
      toast({
        title: "Success!",
        description: "Wallet funded with 10,000 XLM",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to fund wallet",
        variant: "destructive",
      });
    }
  };

  const handleImportWallet = () => {
    if (importWallet(importKey)) {
      setImportKey('');
      setShowImport(false);
      toast({
        title: "Success!",
        description: "Wallet imported successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid secret key",
        variant: "destructive",
      });
    }
  };

  if (!wallet) {
    return (
      <Card className="stellar-card p-6">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 stellar-gradient rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Create Your Stellar Wallet</h3>
            <p className="text-muted-foreground">
              Get started by creating a new wallet or importing an existing one
            </p>
          </div>

          <div className="space-y-3">
            {!showImport ? (
              <>
                <Button 
                  onClick={generateWallet}
                  className="w-full stellar-gradient text-white hover:opacity-90"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Create New Wallet
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowImport(true)}
                  className="w-full"
                  size="lg"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Existing Wallet
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                <Input
                  placeholder="Enter your secret key (S...)"
                  value={importKey}
                  onChange={(e) => setImportKey(e.target.value)}
                  type="password"
                />
                <div className="flex gap-2">
                  <Button onClick={handleImportWallet} className="flex-1">
                    Import
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowImport(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="stellar-card p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 stellar-gradient rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Stellar Wallet</h3>
              <p className="text-sm text-muted-foreground">
                {wallet.funded ? 'Active' : 'Unfunded'}
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearWallet}
          >
            Clear
          </Button>
        </div>

        <div className="space-y-4">
          {/* Public Key */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Public Key</label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={wallet.publicKey}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(wallet.publicKey, 'Public key')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Secret Key */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Secret Key</label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={showSecret ? wallet.secretKey : '•'.repeat(56)}
                readOnly
                className="font-mono text-xs"
                type={showSecret ? 'text' : 'password'}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(wallet.secretKey, 'Secret key')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {!wallet.funded && (
          <Button
            onClick={handleFundWallet}
            disabled={loading}
            className="w-full stellar-gradient text-white hover:opacity-90"
          >
            Fund Wallet (Testnet)
          </Button>
        )}
      </div>
    </Card>
  );
}
