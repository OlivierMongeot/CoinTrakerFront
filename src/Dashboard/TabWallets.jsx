import * as React from 'react';
import Tab from '@mui/material/Tab';
import TabList from '@material-ui/lab/TabList';

export default function TabWallets(props) {

  const exchanges = props.exchanges;
  const results = [];

  exchanges.forEach((exchange, index) => {
    results.push(
      < Tab key={index} label={exchange} value={index.toString()} />
    );
  });

  return (
    <TabList onChange={props.handleChange} aria-label="lab API tabs example">
      {results}
    </TabList>
  )

}