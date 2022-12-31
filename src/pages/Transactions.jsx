import React from 'react';
import AuthenticationService from '../helpers/AuthService';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TrxLoader from '../components/TrxLoader';
import proccesTransactionKucoin from '../transactions/kucoin';
import proccesTransactionCoinbase from '../transactions/coinbase';
import TableTransactions from '../components/Transactions/TableTransactions';

const Transactions = () => {

    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    const [transactions, setTransactions] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState('none');
    const [pourcentLoad] = React.useState(0);

    const quickUpdate = () => {
        proccesTransactionCoinbase('quick')
    }

    const fullUpdateCurrentAccountTrx = () => {
        console.log('full current update')
        proccesTransactionCoinbase('full-current')
    }



    const processAllTransactions = async () => {
        let allTrx = []
        const coinbaseTrx = await proccesTransactionCoinbase('start');
        setIsLoading('none');
        setTransactions(coinbaseTrx);

        const kucoinTrx = await proccesTransactionKucoin('start', userData);
        allTrx = [...coinbaseTrx, ...kucoinTrx];
        console.log(allTrx)
        setTransactions(allTrx);
    }


    React.useEffect(() => {

        if (!AuthenticationService.isAuthenticated) {
            navigate("/login");
        }
        processAllTransactions();
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const style = {
        marginLeft: '10px'
    }

    return (
        <div className="app-container">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                theme="dark"
            />
            <Grid item xs={12} md={8} lg={9} mt={5} sx={{ display: 'flex', alignItems: "center", justifyContent: "flex-end" }}>

                <Button sx={style} variant="outlined" onClick={quickUpdate} >
                    Quick Update
                </Button>
                <Button sx={style} variant="outlined" onClick={fullUpdateCurrentAccountTrx} >
                    Full Update
                </Button>
                <Button sx={style} variant="outlined" onClick={proccesTransactionKucoin} >
                    Kucoin Test
                </Button>
                {/* <Button sx={style} variant="outlined" onClick={findNewAccount} >
                    Find new account
                </Button> */}

                {/* <Button variant="outlined" onClick={deleteLastTrx} >
                    Delete  Last transactions
                </Button> */}
                <div style={{ display: 'flex', width: '200px', alignContent: "center", justifyContent: "center" }}>
                    <TrxLoader display={isLoading} >
                    </TrxLoader>
                    <div style={{ display: isLoading }}>
                        {pourcentLoad} %
                    </div>
                </div>
            </Grid>

            <Grid item xs={12} md={8} lg={9}>
                <TableTransactions transactions={transactions}>
                </TableTransactions>
            </Grid>
        </div >
    );
};

export default Transactions;