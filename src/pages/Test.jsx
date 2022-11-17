// import React from 'react';
// import Navbar from '../components/Navbar';
import axios from 'axios';
import Dashboard from '../Dashboard/Dashboard';

// import getCoinMarketCapTokens from '../api/CoinMarketCap';

const Test = () => {

    // const [coinmarketcapData, setCoinmarketcapData] = React.useState([]);

    React.useEffect(() => {
        console.log('Test useEffect');
        //     axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?symbol=HOPR,BTC', {
        //   headers: {
        //     'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c',
        //     'Content-Type': 'application/json',
        //     "Access-Control-Allow-Origin": "*",
        //     "Accept": "*/*",
        //     "Accept-Encoding": "gzip, deflate, br",
        //     "Connection": "keep-alive"
        //   },
        // }).then(res => {
        //     console.log('res', res);
        //     setCoinmarketcapData(res.data);
        // }).catch(err => {
        //     console.log('err', err);
        // })

        // Get CoinGecko list of tokens
        // get list of tokens from CoinGecko


        // });
    }, []);

    return (
        // <div className="app-container">
        // <div>

        <Dashboard />
        // </div>
        // </div>
    );
};

export default Test;