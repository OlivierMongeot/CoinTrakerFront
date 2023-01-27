

const config = {
  urlServer: 'localhost:4000',
  exchanges: ['kucoin', 'coinbase', 'gateio', 'binance', 'crypto-com'],
  timeTable: {
    'kucoin':
      { deposits: 1640908800000, withdrawals: 1640908800000, trades: 1640908800000 }
    ,
    'coinbase':
      { trades: 1640908800000 },
    'binance':
      { trades: 1640908800000 },
    'gateio':
      { deposits: 1640908800000, withdrawals: 1640908800000, trades: 1640908800000 },
    'crytpo-com':
      { trades: 1640908800000 }
  }
}

export default config;