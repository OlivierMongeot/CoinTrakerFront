import * as React from 'react';
import TabPanel from '@mui/lab/TabPanel';
import Wallet from './Ledger';


export default function TabWalletContent(props) {

  const exchanges = props.exchanges;
  const results = [];
  // const [totalExchange, setTotalExchange] = React.useState(0);

  exchanges.forEach((exchange, index) => {
    // console.log('exchange', exchange);
    results.push(
      <TabPanel key={index} value={index.toString()}>
        <Wallet
          exchanges={exchanges}
          exchange={exchange}
          arrayAmountWallets={props.arrayAmountWallets}
          setArrayAmountWallets={props.setArrayAmountWallets}
          setTotalAllWallet={props.setTotalAllWallet}
        // setTotalExchange={setTotalExchange}
        // setUpdatedAt={props.setUpdatedAt}
        />
      </TabPanel>
    );
  });

  return (
    <React.Fragment>
      {results}
    </React.Fragment>
  )

}