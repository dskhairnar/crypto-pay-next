
'use client';

import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History as HistoryIcon, RefreshCw, ExternalLink, Send, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useStellar } from '@/contexts/StellarContext';

export default function History() {
  const { wallet, transactions, refreshTransactions, loading } = useStellar();

  useEffect(() => {
    if (wallet?.funded) {
      refreshTransactions();
    }
  }, [wallet?.funded]);

  const handleRefresh = () => {
    refreshTransactions();
  };

  const getTransactionType = (tx: any) => {
    // This is a simplified type detection
    // In a real app, you'd need to parse the transaction operations
    return 'payment';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const openInStellarExplorer = (hash: string) => {
    const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${hash}`;
    window.open(explorerUrl, '_blank');
  };

  if (!wallet?.funded) {
    return (
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Transaction History
            </h1>
            <p className="text-muted-foreground mt-1">
              View your transaction history
            </p>
          </div>

          <Card className="stellar-card p-8 text-center">
            <HistoryIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Wallet Found</h3>
            <p className="text-muted-foreground">
              Please create and fund a wallet to view transaction history
            </p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Transaction History
            </h1>
            <p className="text-muted-foreground mt-1">
              View your transaction history
            </p>
          </div>

          <Button onClick={handleRefresh} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Transaction Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="stellar-card p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <HistoryIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
            </div>
          </Card>

          <Card className="stellar-card p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold">
                  {transactions.filter(tx => tx.successful).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="stellar-card p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">
                  {transactions.filter(tx => !tx.successful).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Transaction List */}
        {transactions.length > 0 ? (
          <Card className="stellar-card p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            
            <div className="space-y-4">
              {transactions.map((tx) => {
                const { date, time } = formatDate(tx.created_at);
                const type = getTransactionType(tx);
                
                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.successful 
                          ? 'bg-green-500/20' 
                          : 'bg-red-500/20'
                      }`}>
                        <Send className={`w-5 h-5 ${
                          tx.successful 
                            ? 'text-green-500' 
                            : 'text-red-500'
                        }`} />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium capitalize">{type}</p>
                          <Badge variant={tx.successful ? "default" : "destructive"}>
                            {tx.successful ? "Success" : "Failed"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {date} at {time}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {tx.hash.slice(0, 16)}...
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {tx.operation_count} operation{tx.operation_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openInStellarExplorer(tx.hash)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ) : (
          <Card className="stellar-card p-8 text-center">
            <HistoryIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Transactions Yet</h3>
            <p className="text-muted-foreground">
              Your transaction history will appear here once you start making payments
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
}
