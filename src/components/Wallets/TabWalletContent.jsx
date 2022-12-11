import * as React from 'react';
import TabPanel from '@mui/lab/TabPanel';
import Wallet from './Wallet';


export default function TabWalletContent(props) {

  const exchanges = props.exchanges;
  const results = [];

  exchanges.forEach((exchange, index) => {
    // console.log('exchange', exchange);
    results.push(
      <TabPanel key={index} value={index.toString()}>
        <Wallet
          exchanges={exchanges}
          exchange={exchange}
          arrayAmountWallets={props.arrayAmountWallets}
          setArrayAmountWallets={props.setArrayAmountWallets}
          // setTotalAllWallet={props.setTotalAllWallet}
          wallet={props.wallet}
          setWallet={props.setWallet}
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