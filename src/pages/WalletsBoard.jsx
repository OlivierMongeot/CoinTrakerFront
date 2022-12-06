import React from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
// import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
// import Title from '../Dashboard/Title';
import Grid from '@mui/material/Grid';
import TabWalletsTitle from '../Dashboard/TabWalletsTitle';
import TabWalletContent from '../Dashboard/TabWalletContent';
// import formatValues from '../helpers/formatValues';
import Container from '@mui/material/Container';
import Chart from '../Dashboard/Chart';
import Deposits from '../Dashboard/Deposits';
import AuthenticationService from '../helpers/AuthService';
import { useNavigate } from "react-router-dom";



const WalletsBoard = (props) => {

    const navigate = useNavigate();

    const [exchanges] = React.useState(
        ['all', 'crypto-com', 'gateio', 'binance', 'kucoin', 'coinbase']
    );

    const [totalExchange, setTotalExchange] = React.useState(0);

    const [value, setValue] = React.useState('0');

    // const [updatedAt, setUpdatedAt] = React.useState(0)
    // const [exchangeSelected, setExchangeSelected] = React.useState('all');


    const handleChange = (event, newValue) => {
        setValue(newValue);
        // setUpExchangeSelected(newValue);
        // setExchangeSelected(exchanges[newValue]);
    };


    React.useEffect(() => {
        console.log('use effect wallets');
        if (!AuthenticationService.isAuthenticated) {
            console.log('isAuthenticated ', AuthenticationService.isAuthenticated);
            navigate("/login");
            // return;
        }

    }, [navigate]);


    return (
        <Container className="container" maxWidth="xlg"
            sx={{ mt: 4, mb: 4 }}>

            <Grid container spacing={2} columns={12}>

                <Grid item xs={12} md={10} lg={8}>
                    <Paper>

                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Box id="box-wallet" sx={{ width: '100%', height: '100%', typography: 'body1' }}>

                                    <TabContext value={value} >

                                        <Box className="tabMenuWallets" sx={{ borderBottom: 1, borderColor: 'divider' }}>

                                            <TabWalletsTitle exchanges={exchanges} handleChange={handleChange} />

                                            {/* {exchangeSelected !== 'all' && (
                                                <Title>
                                                    <div className='display-top-table'>
                                                        <span className="title-wallet"></span>

                                                        <Tooltip title={updatedAt}>
                                                            <span >Total {formatValues('price', totalExchange)} $
                                                            </span>
                                                        </Tooltip>

                                                    </div>
                                                </Title>
                                            )} */}

                                        </Box>

                                        <TabWalletContent
                                            exchanges={exchanges}
                                            arrayAmountWallets={props.arrayAmountWallets}
                                            setArrayAmountWallets={props.setArrayAmountWallets}
                                            setTotalAllWallet={props.setTotalAllWallet}
                                            setTotalExchange={setTotalExchange}
                                        // setUpdatedAt={setUpdatedAt}
                                        />
                                    </TabContext>
                                </Box>
                            </Paper >
                        </Grid>
                    </Paper>
                </Grid >
                {/* Colonne Droite */}
                <Grid item xs={12} md={2} lg={4} sx={{ display: "flex", flexDirection: 'column' }}>

                    <Paper
                        sx={{ p: 2, height: 200, flex: '1 1', paddingBottom: '50px' }}>
                        <Chart />
                    </Paper>

                    <Paper
                        sx={{ p: 2, height: 200, marginTop: 2, flex: '1 1' }}>
                        <Deposits totalAllWallet={props.totalAllWallet} arrayAmountWallets={props.arrayAmountWallets} />
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