
// Stellar network configuration
export const STELLAR_CONFIG = {
  HORIZON_URL: 'https://horizon-testnet.stellar.org',
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
  FRIENDBOT_URL: 'https://friendbot.stellar.org',
  TESTNET: true,
  
  // Well-known anchors for testing
  ANCHORS: {
    testanchor: {
      name: 'Test Anchor',
      domain: 'testanchor.stellar.org',
      sep10Endpoint: 'https://testanchor.stellar.org/auth',
      sep12Endpoint: 'https://testanchor.stellar.org/kyc',
      sep6Endpoint: 'https://testanchor.stellar.org/transfer',
    }
  }
};

export const STELLAR_ASSETS = {
  NATIVE: 'XLM',
  USDC: {
    code: 'USDC',
    issuer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'
  }
};
