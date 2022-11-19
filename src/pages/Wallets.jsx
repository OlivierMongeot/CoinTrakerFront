import React from 'react';
import Box from '@mui/material/Box';
import TabContext from '@material-ui/lab/TabContext';
// import TabPanel from '@material-ui/lab/TabPanel';
import Paper from '@mui/material/Paper';
import Title from '../Dashboard/Title';
import Grid from '@mui/material/Grid';
import TabWallets from '../Dashboard/TabWallets';
import TabPanelWallet from '../Dashboard/TabPanelWallet';
import formatValues from '../helpers/formatValues';

const Wallets = (props) => {
    const [exchanges] = React.useState(
        ['kucoin', 'crypto-com', 'gateio', 'coinbase']
    );
    const [totalAllWallet, setTotalAllWallet] = React.useState(0);
    const [arrayAmountWallets, setArrayAmountWallets] = React.useState([])
    const [totalExchange, setTotalExchange] = React.useState(0);

    console.log('totalAllWallet', totalAllWallet);


    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>

                        <Box className="tabMenuWallets" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabWallets exchanges={exchanges} handleChange={handleChange} />
                            <Title>
                                <div className='display-top-table'>
                                    <span className="title-wallet"></span>
                                    <span >Total {formatValues('price', totalExchange)} $
                                    </span>
                                </div>
                            </Title>
                        </Box>

                        <TabPanelWallet
                            exchanges={exchanges}
                            arrayAmountWallets={arrayAmountWallets}
                            setArrayAmountWallets={setArrayAmountWallets}
                            setTotalAllWallet={setTotalAllWallet}
                            setTotalExchange={setTotalExchange}
                        />
                    </TabContext>
                </Box>
            </Paper >
        </Grid>

    );
};

export default Wallets;