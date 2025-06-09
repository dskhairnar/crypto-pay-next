
'use client';

import { useEffect } from 'react';
import Layout from '@/components/Layout';
import WalletCard from '@/components/WalletCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Send, TrendingUp, Wallet } from 'lucide-react';
import { useStellar } from '@/contexts/StellarContext';

export default function Index() {
  const { wallet, balances, transactions, refreshBalances, refreshTransactions, loading } = useStellar();

  useEffect(() => {
    if (wallet?.funded) {
      refreshBalances();
      refreshTransactions();
    }
  }, [wallet?.funded]);

  const handleRefresh = () => {
    refreshBalances();
    refreshTransactions();
  };

  const nativeBalance = balances.find(b => b.asset_type === 'native')?.balance || '0';

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your Stellar wallet and payments
            </p>
          </div>
          
          {wallet && (
            <Button onClick={handleRefresh} disabled={loading} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>

        {/* Wallet Section */}
        <WalletCard />

        {/* Dashboard Content */}
        {wallet?.funded && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Balance Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="stellar-card p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">XLM Balance</p>
                      <p className="text-2xl font-bold">{parseFloat(nativeBalance).toFixed(2)}</p>
                    </div>
                  </div>
                </Card>

                <Card className="stellar-card p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Assets</p>
                      <p className="text-2xl font-bold">{balances.length}</p>
                    </div>
                  </div>
                </Card>

                <Card className="stellar-card p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <Send className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transactions</p>
                      <p className="text-2xl font-bold">{transactions.length}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Transactions */}
              <Card className="stellar-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Transactions</h3>
                  <Badge variant="secondary">{transactions.length} total</Badge>
                </div>
                
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <Send className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Transaction</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={tx.successful ? "default" : "destructive"}>
                            {tx.successful ? "Success" : "Failed"}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {tx.operation_count} ops
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Send className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No transactions yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your transaction history will appear here
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Asset Balances */}
            <Card className="stellar-card p-6">
              <h3 className="text-lg font-semibold mb-4">Asset Balances</h3>
              
              {balances.length > 0 ? (
                <div className="space-y-3">
                  {balances.map((balance, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {balance.asset_code}
                        </p>
                        {balance.asset_issuer && (
                          <p className="text-xs text-muted-foreground">
                            {balance.asset_issuer.slice(0, 8)}...
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {parseFloat(balance.balance).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No assets found</p>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
