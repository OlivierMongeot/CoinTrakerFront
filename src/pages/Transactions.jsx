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
import eraseDoublon from '../helpers/eraseDoublon';
import depositKucoin from '../deposits/kucoin'
import withdrawalsKucoin from '../withdrawals/kucoinWithdraw'

const Transactions = () => {

    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    const [transactions, setTransactions] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState('none');
    const [pourcentLoad] = React.useState(0);

    const quickUpdate = () => {
        processAllTransactions('quick');

    }

    const fullUpdateCurrentAccountTrx = () => {
        console.log('full current update')
        proccesTransactionCoinbase('full-current')
    }


    const processAllTransactions = async (mode) => {
        let allTrx = []
        let allCoinbaseTrx = []
        let allTrxKucoin = []
        allCoinbaseTrx = await proccesTransactionCoinbase(mode, userData);
        const allTrxCoinbase = [...allCoinbaseTrx];

        console.log('all TrxCoinbase', allTrxCoinbase);
        // setIsLoading('none');
        // setTransactions(coinbaseTrx);

        const currentKucoinTrx = JSON.parse(localStorage.getItem('transactions-kucoin')) ? JSON.parse(localStorage.getItem('transactions-kucoin')) : [];
        let newKucoinTrx = []
        newKucoinTrx = await proccesTransactionKucoin('start', userData);


        const mouvements = await getMouvements();


        allTrxKucoin = [...newKucoinTrx, ...currentKucoinTrx, ...mouvements];
        allTrxKucoin = eraseDoublon(allTrxKucoin)
        localStorage.setItem('transactions-kucoin', JSON.stringify(allTrxKucoin));


        allTrx = [...allTrxKucoin, ...allTrxCoinbase]
        console.log('all trx ', allTrx)
        setTransactions(allTrx);
    }

    const getMouvements = async () => {
        let deposits = (await depositKucoin('start', userData));
        console.log('deposits', deposits)


        let withdrawals = (await withdrawalsKucoin('start', userData));
        console.log('deposits', withdrawals)

        let mouvements = [...deposits, ...withdrawals]
        return mouvements;
        // setTransactions(mouvements);

    }

    // 1672170593001
    // 1672775393001

    React.useEffect(() => {

        if (!AuthenticationService.isAuthenticated) {
            navigate("/login");
        }
        processAllTransactions('no-update');

        // const savedTrxKucoin = JSON.parse(localStorage.getItem('transactions-kucoin'));
        // const lastTransactionKucoin = savedTrxKucoin.reduce((r, o) => new Date(o.createdAt) > new Date(r.createdAt) ? o : r);
        // console.log(lastTransactionKucoin)

        // let savedDepositsKucoin = JSON.parse(localStorage.getItem('deposits-kucoin'));
        // setTransactions(savedDepositsKucoin);
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

                <Button variant="outlined" onClick={processAllTransactions} >
                    Deposit test
                </Button>
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