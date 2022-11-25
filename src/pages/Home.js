import React from 'react';
// import HeaderInfos from '../components/HeaderInfos';
import axios from 'axios';
// import Table from '../components/Table';
// import Totop from '../components/Totop';
// import Navbar from '../components/Navbar';


const Home = () => {

    const [coinsData, setCoinsData] = React.useState([]);


    React.useEffect(() => {
        // axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C14d%2C30d%2C200d%2C1y`)
        //     .then(res => {
        //         setCoinsData(res.data);
        //         // set in  LocalStorage
        //         localStorage.setItem('GekocoinsData', JSON.stringify(res.data));
        //         // console.log(res.data);

        //     }
        //     ).catch
        //     (err => {
        //         console.log(err);
        //     }
        //     )

        // window.addEventListener('scroll', () => {
        //     if (window.scrollY > 145) {
        //         document.querySelector('.table-header').classList.add('active');
        //     } else {
        //         document.querySelector('.table-header').classList.remove('active');
        //     }
        // }
        // );
    }, [])



    return (
        <div className="app-container">
            <header>
                {/* <Navbar />
                <HeaderInfos /> */}
                {/* <GlobalChart coinsData={coinsData ? coinsData : []}  /> */}
            </header>
            {/* <Table coinsData={coinsData} />
            <Totop /> */}
        </div>
    );
};

export default Home;

// https://api.coingecko.com/api/v3/simple/price?vs_currency=usd,btc

// https://api.coingecko.com/api/v3/simple/supported_vs_currency