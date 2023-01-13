import React from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Logo from '../components/Home/Logo';
import PourcentFormater from '../helpers/pourcentFormater';
import PriceFormater from '../helpers/priceFormater';
import BigNumberFormater from '../helpers/bigNumberFormater';
import CoinChart from '../components/Home/CoinChart';

const Home = () => {

    const [coinsData, setCoinsData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const columns: GridColDef[] = [
        {
            field: 'market_cap_rank', headerName: '#', width:
                20, align: 'center', headerAlign: 'center'
        },
        {
            field: 'image',
            headerName: 'Logo',
            width: 60,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => <Logo url={params.value} />
        },
        { field: 'name', headerName: 'Token', width: 180 },
        {
            field: 'current_price', headerName: 'Price', width: 120, align: 'right', headerAlign: 'right',
            renderCell: (params) => <PriceFormater value={params.value} />
        },
        {
            field: 'price_change_percentage_1h_in_currency', headerName: '1h %', width: 100, align: 'center', headerAlign: 'center',
            renderCell: (params) => <PourcentFormater value={params.value} />
        },
        {
            field: 'price_change_percentage_24h_in_currency', headerName: '24h %', width: 100, align: 'center', headerAlign: 'center',
            renderCell: (params) => <PourcentFormater value={params.value} />
        },
        {
            field: 'price_change_percentage_7d_in_currency', headerName: '7d %', width: 100, align: 'center', headerAlign: 'center',
            renderCell: (params) => <PourcentFormater value={params.value} />
        },
        {
            field: 'price_change_percentage_30d_in_currency', headerName: '30d %', width: 100, align: 'center', headerAlign: 'center',
            renderCell: (params) => <PourcentFormater value={params.value} />
        },
        {
            field: 'ath_change_percentage', headerName: 'ATH %', width: 100, align: 'center', headerAlign: 'center',
            renderCell: (params) => <PourcentFormater value={params.value} />
        },
        {
            field: 'market_cap', headerName: 'Market Cap', width: 150, align: 'center', headerAlign: 'center',
            renderCell: (params) => <PriceFormater value={params.value} />
        },
        // circulating_supply
        {
            field: 'market_cap_change_percentage_24h', headerName: 'Mc %', width: 90, align: 'center', headerAlign: 'center',
            renderCell: (params) => <PourcentFormater value={params.value} />
        },

        {
            field: 'circulating_supply', headerName: 'Suply', width: 110, align: 'right', headerAlign: 'right',
            renderCell: (params) => <BigNumberFormater value={params.value} />
        },




    ];

    React.useEffect(() => {

        axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C14d%2C30d%2C200d%2C1y`)
            .then(res => {
                setCoinsData(res.data);
                console.log('api GECKO DATA', res.data.length);
                localStorage.setItem('GekocoinsData', JSON.stringify(res.data))
                setIsLoading(false)
            }
            ).catch
            (err => {
                console.log(err);
            }
            )
    }, [])


    return (
        <Container className="container" maxWidth="xlg" sx={{ mt: 3, mb: 2 }}>

            <Grid item xs={12} md={8} lg={9}>
                <Paper
                    sx={{ p: 1 }}>
                    {/* <Chart /> */}
                    <div className="chart-container" >
                        <CoinChart coinId='bitcoin' coinName='bitcoin' />
                    </div>
                </Paper>
            </Grid>

            <Grid item xs={12} md={8} lg={9}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '60vh',
                        marginTop: 3
                    }}
                >

                    <div style={{ height: '100%', width: '100%' }}>
                        <DataGrid rows={coinsData} columns={columns} loading={isLoading} />
                    </div>

                </Paper>
            </Grid>
        </Container >
    );
};

export default Home;

