import * as React from 'react';
import TabPanel from '@mui/lab/TabPanel';
import Ledger from '../Dashboard/Ledger';


export default function TabPanelWallets(props) {

  const exchanges = props.exchanges;
  const results = [];
  // console.log('TabPanelWallets exchanges ', exchanges)


  exchanges.forEach((exchange, index) => {
    // console.log('exchange', exchange);
    results.push(
      <TabPanel key={index} value={index.toString()}>
        <Ledger
          exchange={exchange}
          arrayAmountWallets={props.arrayAmountWallets}
          setArrayAmountWallets={props.setArrayAmountWallets}
          setTotalAllWallet={props.setTotalAllWallet}
          setTotalExchange={props.setTotalExchange}
          setUpdatedAt={props.setUpdatedAt}
        />
      </TabPanel>
    );
  });


  return (
    <div>
      {results}
    </div>
  )

}