

const config = {
  urlServer: 'localhost:4000',
  exchanges: ['kucoin', 'coinbase', 'gateio', 'binance', 'crypto-com'],
  timeTable: {
    'kucoin':
      { deposit: 1640908800000, withdrawals: 1640908800000, trade: 1640908800000 }
    ,
    'coinbase':
      { trade: 1640908800000 },
    'binance':
      { trade: 1640908800000 },
    'gateio':
      { trade: 1640908800000 },
    'crytpo-com':
      { trade: 1640908800000 }
  }
}

export default config;