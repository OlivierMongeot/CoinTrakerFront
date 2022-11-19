import * as React from 'react';
import TabPanel from '@material-ui/lab/TabPanel';
import Ledger from '../Dashboard/Ledger';

export default function TabPanelWallets(props) {

  const exchanges = props.exchanges;
  const results = [];

  exchanges.forEach((exchange, index) => {
    results.push(
      <TabPanel key={index} value={index.toString()}>
        <Ledger
          exchange={exchange}
          arrayAmountWallets={props.arrayAmountWallets}
          setArrayAmountWallets={props.setArrayAmountWallets}
          setTotalAllWallet={props.setTotalAllWallet}
          setTotalExchange={props.setTotalExchange}
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