import React from 'react';
// import HeaderInfos from '../components/HeaderInfos';
import axios from 'axios';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '../Dashboard/Chart';
// import formatValues from '../helpers/formatValues';
// import { width } from '@mui/system';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Logo from '../components/Logo';
import PourcentFormater from '../components/PourcentFormater';
// import { CenterFocusStrong } from '@mui/icons-material';
import PriceFormater from '../components/PriceFormater';
import BigNumberFormater from '../components/BigNumberFormater';

const Home = () => {

    const [coinsData, setCoinsData] = React.useState([]);

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
                // set in  LocalStorage
                localStorage.setItem('GekocoinsData', JSON.stringify(res.data));
                // console.log(res.data);

            }
            ).catch
            (err => {
                console.log(err);
            }
            )

    }, [])



    return (
        <Container className="container" maxWidth="xlg" sx={{ mt: 4, mb: 4 }}>



            <Grid item xs={12} md={8} lg={9}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 200,
                    }}
                >
                    <Chart />
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
                    <React.Fragment>
                        <div style={{ height: '100%', width: '100%' }}>
                            <DataGrid rows={coinsData} columns={columns}
                            // components={{
                            //     Toolbar: GridToolbar,
                            // }}
                            />
                        </div>
                        {/* <Table className="table-wallet" size="small" >
                            <TableHead>
                                <TableRow align="right" >
                                    <TableCell style={{ width: '10px' }}>#</TableCell>
                                    <TableCell >Token</TableCell>

                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">1h %</TableCell>
                                    <TableCell align="right">24h %</TableCell>
                                    <TableCell align="right">7j % </TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {coinsData && coinsData


                                    .map((token, key) => (
                                        <TableRow key={key}>
                                            <TableCell style={{ width: '10px' }}>
                                                {key + 1}
                                            </TableCell>
                                            <TableCell
                                                style={{
                                                    display: 'flex'
                                                }}
                                                className="table-row" >
                                                <div style={{
                                                    margin: '0'
                                                }}
                                                    className='token-display'>
                                                    <div className="image-token">
                                                        <img src={
                                                            token.image
                                                        } alt={token.name} />
                                                    </div>

                                                    <div style={{
                                                        fontSize: 'small'
                                                    }}
                                                        className="name-token">
                                                        {token.name}
                                                    </div>
                                                </div>
                                            </TableCell>


                                            <TableCell align="right" className="table-row">
                                                $
                                            </TableCell>

                                            <TableCell
                                                className="table-row change">
                                                %
                                            </TableCell>


                                            <TableCell
                                                className="table-row change">
                                                %
                                            </TableCell>
                                            <TableCell
                                                style={{

                                                    textAlign: 'right'
                                                }}
                                                className="table-row change">
                                                %
                                            </TableCell>

                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table> */}
                    </React.Fragment >
                </Paper>
            </Grid>
        </Container >
    );
};

export default Home;

// https://api.coingecko.com/api/v3/simple/price?vs_currency=usd,btc

// https://api.coingecko.com/api/v3/simple/supported_vs_currency