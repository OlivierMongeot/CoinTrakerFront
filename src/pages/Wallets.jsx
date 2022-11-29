import React from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Title from '../Dashboard/Title';
import Grid from '@mui/material/Grid';
import TabWallets from '../Dashboard/TabWallets';
import TabPanelWallet from '../Dashboard/TabPanelWallet';
import formatValues from '../helpers/formatValues';
import Container from '@mui/material/Container';
import Chart from '../Dashboard/Chart';
import Deposits from '../Dashboard/Deposits';
// import Loader from '../helpers/Loader';
// import { height } from '@mui/system';
// import TokenService from '../helpers/TokenService';
// import jwsTester from '../api/jwsTester';

import AuthenticationService from '../helpers/AuthService';

const Wallets = (props) => {

    const [exchanges] = React.useState(
        ['all', 'crypto-com', 'gateio', 'coinbase', 'binance', 'kucoin']
    );

    const [totalExchange, setTotalExchange] = React.useState(0);

    const [value, setValue] = React.useState('0');

    const [updatedAt, setUpdatedAt] = React.useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // TokenService();
    // const isItUserKey = TokenService();
    // let isItUserKey = localStorage.getItem('user');
    // if (isItUserKey !== null) {
    //     // Check if token is allways enable
    //     // try make a cal api 

    // }
    // jwsTester();


    if (!AuthenticationService.isAuthenticated) {
        console.log('isAuthenticated ', AuthenticationService.isAuthenticated);
        alert('not loged');
        // window.location.href = '/login';
        return (
            <Container className="container" maxWidth="xlg"
                sx={{ mt: 4, mb: 4 }}>
            </Container>
        )
    } else {


    }


    return (
        <Container className="container" maxWidth="xlg"
            sx={{ mt: 4, mb: 4 }}>

            <Grid container spacing={2} columns={12}>

                <Grid item xs={12} md={10} lg={8}>
                    <Paper>

                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Box id="box-wallet" sx={{ width: '100%', height: '100%', typography: 'body1' }}>
                                    {/* <Loader /> */}

                                    <TabContext value={value} >

                                        <Box className="tabMenuWallets" sx={{ borderBottom: 1, borderColor: 'divider' }}>

                                            <TabWallets exchanges={exchanges} handleChange={handleChange} />

                                            <Title>
                                                <div className='display-top-table'>
                                                    <span className="title-wallet"></span>
                                                    {/* <Loader /> */}
                                                    <Tooltip title={updatedAt}>
                                                        <span >Total {formatValues('price', totalExchange)} $
                                                        </span>
                                                    </Tooltip>

                                                </div>
                                            </Title>
                                        </Box>

                                        <TabPanelWallet
                                            exchanges={exchanges}
                                            arrayAmountWallets={props.arrayAmountWallets}
                                            setArrayAmountWallets={props.setArrayAmountWallets}
                                            setTotalAllWallet={props.setTotalAllWallet}
                                            setTotalExchange={setTotalExchange}
                                            setUpdatedAt={setUpdatedAt}
                                        />
                                    </TabContext>
                                </Box>
                            </Paper >
                        </Grid>



                    </Paper>
                </Grid >

                <Grid item xs={12} md={2} lg={4}>
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


                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 200,
                            marginTop: 2
                        }}>
                        <Deposits totalAllWallet={props.totalAllWallet} arrayAmountWallets={props.arrayAmountWallets} />
                    </Paper>
                </Grid>

            </Grid >
        </Container >

    );
};

export default Wallets;