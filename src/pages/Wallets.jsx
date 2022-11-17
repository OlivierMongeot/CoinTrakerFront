import React from 'react';
// import Navbar from '../components/Navbar';
// import Wallet from '../components/Wallet';
// import TotalBar from '../components/TotalBar';
// import '../styles/app.scss';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '../Dashboard/Chart';
import Deposits from '../Dashboard/Deposits';
import Ledger from '../Dashboard/Ledger';

const Wallets = () => {

    const [totalAllWallet, setTotalAllWallet] = React.useState(0);
    const [arrayAmountWallets, setArrayAmountWallets] = React.useState([])
    const [exchanges] = React.useState(
        [
            'kucoin',
            'crypto-com',
            // 'coinbase',
            'gateio'
        ]
    )


    return (

        <Grid container spacing={5}>

            <Grid item xs={12} md={8} lg={9}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                    }}
                >
                    <Chart />
                </Paper>
            </Grid>

            <Grid item xs={12} md={4} lg={3}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                    }}
                >
                    <Deposits />
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    {/* <Ledger exchange='kucoin'
                        arrayAmountWallets={arrayAmountWallets}
                        setArrayAmountWallets={setArrayAmountWallets}
                        setTotalAllWallet={setTotalAllWallet} /> */}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Wallets;