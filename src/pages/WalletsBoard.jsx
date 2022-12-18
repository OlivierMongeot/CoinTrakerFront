import React from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
// import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
// import Title from '../Dashboard/Title';
import Grid from '@mui/material/Grid';
import TabWalletsTitle from '../components/Wallets/TabWalletsTitle';
import TabWalletContent from '../components/Wallets/TabWalletContent';
// import formatValues from '../helpers/formatValues';
import Container from '@mui/material/Container';
import Chart from '../components/Wallets/Chart';
import Deposits from '../components/Wallets/Deposits';
// import AuthenticationService from '../helpers/AuthService';
// import { useNavigate } from "react-router-dom";

export const WalletsContext = React.createContext();


const WalletsBoard = () => {

    const localStorageWalletsAmmount = JSON.parse(localStorage.getItem('wallets-amount'));

    const [arrayAmountWallets, setArrayAmountWallets] = React.useState(localStorageWalletsAmmount ? localStorageWalletsAmmount : []);
    const [exchangesUser] = React.useState(
        ['all',
            'crypto-com',
            'gateio',
            'binance',
            'kucoin',
            'coinbase']
    );
    const [value, setValue] = React.useState('0');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [wallet, setWallet] = React.useState([]);

    return (
        <Container className="container" maxWidth="xlg"
            sx={{ mt: 4, mb: 4 }}>

            <Grid container spacing={2} columns={12}>

                <Grid item xs={12} md={8} lg={8}>
                    <Paper>

                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Box id="box-wallet" sx={{ width: '100%', height: '100%', typography: 'body1' }}>

                                    <TabContext value={value} >

                                        <Box className="tabMenuWallets" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabWalletsTitle exchanges={exchangesUser} handleChange={handleChange} />
                                        </Box>
                                        <WalletsContext.Provider value={{}}>
                                            <TabWalletContent
                                                exchanges={exchangesUser}
                                                arrayAmountWallets={arrayAmountWallets}
                                                setArrayAmountWallets={setArrayAmountWallets}
                                                wallet={wallet}
                                                setWallet={setWallet}
                                            />
                                        </WalletsContext.Provider>

                                    </TabContext>
                                </Box>
                            </Paper >
                        </Grid>
                    </Paper>
                </Grid >
                {/* Colonne Droite */}
                <Grid item xs={12} md={4} lg={4} sx={{ display: "flex", flexDirection: 'column' }}>

                    <Paper
                        sx={{ p: 2, height: "auto", marginTop: 1, flex: '1 1' }}>
                        <Deposits arrayAmountWallets={arrayAmountWallets} wallet={wallet} setWallet={setWallet} />
                    </Paper>


                    <Paper
                        sx={{ p: 2, height: 200, flex: '1 1', paddingBottom: '50px', mt: 2 }}>
                        <Chart />
                    </Paper>


                    <Paper
                        sx={{ p: 2, flex: '2 1', height: "auto", marginTop: 2 }}>
                    </Paper>
                </Grid>

            </Grid >
        </Container >
    );
};

export default WalletsBoard;