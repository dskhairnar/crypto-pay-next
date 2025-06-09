
'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Wallet, Shield, Download, Trash2, Eye, EyeOff, Copy, AlertTriangle } from 'lucide-react';
import { useStellar } from '@/contexts/StellarContext';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { wallet, clearWallet } = useStellar();
  const { toast } = useToast();
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const exportWallet = () => {
    if (!wallet) return;
    
    const walletData = {
      publicKey: wallet.publicKey,
      secretKey: wallet.secretKey,
      network: 'testnet',
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(walletData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `stellar-wallet-${wallet.publicKey.slice(0, 8)}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success!",
      description: "Wallet exported successfully",
    });
  };

  const handleClearWallet = () => {
    if (confirm('Are you sure you want to clear your wallet? This action cannot be undone.')) {
      clearWallet();
      toast({
        title: "Wallet Cleared",
        description: "Your wallet has been removed from this device",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your wallet and app preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wallet Settings */}
          <Card className="stellar-card p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 stellar-gradient rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Wallet Settings</h3>
              </div>

              {wallet ? (
                <div className="space-y-4">
                  {/* Public Key */}
                  <div className="space-y-2">
                    <Label>Public Key</Label>
                    <div className="flex items-center gap-2">
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
                  <div className="space-y-2">
                    <Label>Secret Key</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={showSecretKey ? wallet.secretKey : '•'.repeat(56)}
                        readOnly
                        className="font-mono text-xs"
                        type={showSecretKey ? 'text' : 'password'}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                      >
                        {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

                  <Separator />

                  {/* Wallet Actions */}
                  <div className="space-y-3">
                    <Button
                      onClick={exportWallet}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Wallet
                    </Button>

                    <Button
                      onClick={handleClearWallet}
                      variant="destructive"
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Wallet
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No wallet connected</p>
                </div>
              )}
            </div>
          </Card>

          {/* App Settings */}
          <Card className="stellar-card p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <SettingsIcon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">App Settings</h3>
              </div>

              <div className="space-y-4">
                {/* Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for transactions
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                {/* Auto Refresh */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoRefresh">Auto Refresh</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically refresh balances and transactions
                    </p>
                  </div>
                  <Switch
                    id="autoRefresh"
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                  />
                </div>

                <Separator />

                {/* Network Info */}
                <div className="space-y-2">
                  <Label>Network</Label>
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <p className="font-medium">Stellar Testnet</p>
                    <p className="text-sm text-muted-foreground">
                      Test SDF Network ; September 2015
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Security Info */}
          <Card className="stellar-card p-6 lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold">Security Information</h3>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-800">Important Security Notes</h4>
                    <ul className="text-sm text-orange-700 mt-2 space-y-1">
                      <li>• Always keep your secret key safe and never share it with anyone</li>
                      <li>• This is a testnet application - do not use real funds</li>
                      <li>• Export your wallet regularly as a backup</li>
                      <li>• Clear your wallet when using shared computers</li>
                      <li>• Verify all transaction details before confirming</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
