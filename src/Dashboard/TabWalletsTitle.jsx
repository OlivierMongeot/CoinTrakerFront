import * as React from 'react';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';

export default function TabWalletsTitle(props) {

  const exchanges = props.exchanges;
  const results = [];

  exchanges.forEach((exchange, index) => {
    results.push(
      < Tab key={index} label={exchange} value={index.toString()} />
    );
  });

  return (
    <TabList onChange={props.handleChange}>
      {results}
    </TabList>
  )

}