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
import Loader from '../Dashboard/Loader';
// import { height } from '@mui/system';

const Wallets = (props) => {

    const [exchanges] = React.useState(
        ['crypto-com', 'gateio', 'binance', 'kucoin', 'all']
    );

    const [totalExchange, setTotalExchange] = React.useState(0);

    const [value, setValue] = React.useState('0');

    const [updatedAt, setUpdatedAt] = React.useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
                <Box id="box-wallet" sx={{ width: '100%', height: '100%', typography: 'body1' }}>
                    <Loader />

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

    );
};

export default Wallets;