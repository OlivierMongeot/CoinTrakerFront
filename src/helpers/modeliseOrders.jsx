
const modeliseOrders = (rawOrders, exchange) => {
  console.log('rawOrders', rawOrders);
  let modelisedOrder = []
  switch (exchange) {
    case 'coinbase':
      rawOrders.forEach(order => {
        order.exchange = 'Coinbase'
        // console.log(order.order_configuration)
        order.type = order.product_type + '/' + order.side
        order.id = order.order_id;
        order.currency = order.product_id;
        order.price = order.order_configuration.limit_limit_gtc.limit_price
        order.amount = order.order_configuration.limit_limit_gtc.base_size
        order.valueUSDT = order.order_configuration.limit_limit_gtc.base_size * order.order_configuration.limit_limit_gtc.limit_price
      })

      console.log('modelised orders Coinbase ', rawOrders)
      return rawOrders

    case 'gateio':

      rawOrders.forEach(currency => {

        console.log(currency.orders)

        currency.orders.forEach(order => {

          console.log(order)
          order.type = order.account + ' ' + order.side + ' ' + order.type
          order.currency = order.currencyPair;
          order.valueUSDT = order.amount * order.price
          order.exchange = 'Gate IO'
          modelisedOrder.push(order)

        })





      })
      console.log('modelised orders  Gateio', modelisedOrder)
      return modelisedOrder;

    default:
      break;
  }


}

export default modeliseOrders