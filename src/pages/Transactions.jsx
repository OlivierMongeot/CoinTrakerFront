import React from 'react';
import AuthenticationService from '../helpers/AuthService';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableTransactions from '../components/Transactions/TableTransactions';
import getNewWithdrawals from '../transactions/kucoin/withdrawals/getNewWithdraws'
import eraseDoublon from '../helpers/eraseDoublon';
import getNewDeposits from '../transactions/kucoin/deposits/getNewDeposits';

import getNewTradesKucoin from '../transactions/kucoin/trades/getNewTradesKucoin';


import getTransactionsDB from '../transactions/getTransactionsDB';
import getNewTransactions from '../transactions/coinbase/getNewTransactions';


const Transactions = () => {

    let navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    const [transactions, setTransactions] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [coinbaseTrxDB, setCoinbaseTrxDB] = React.useState([])

    const updateAllTransactions = async (currentTransactions) => {

        // let state = null
        // // KUCOIN PART
        // do {
        //     let [newDeposits, st] = await getNewDeposits(userData, false);
        //     let newDepots = newDeposits
        //     state = st
        //     if (newDeposits.length > 0) {
        //         setTransactions(previousTransactions => {
        //             return [...previousTransactions, ...newDepots]
        //         })
        //     }
        // } while (state === 'continue');

        // state = null
        // do {
        //     let [newWithdrawals, st] = await getNewWithdrawals(userData, false);
        //     let newWithdraws = newWithdrawals
        //     state = st
        //     if (newWithdraws.length > 0) {
        //         setTransactions(previousTransactions => {
        //             return [...previousTransactions, ...newWithdraws]
        //         })
        //     }
        // } while (state === 'continue');
        // state = null


        // do {
        //     let [newTrades, st] = await getNewTradesKucoin(userData, false);
        //     let newTrs = newTrades
        //     // index++
        //     state = st
        //     if (newTrs.length > 0) {
        //         setTransactions(previousTransactions => {
        //             return [...previousTransactions, ...newTrs]
        //         })
        //     }
        // } while (state === 'continue');

        // COINBASE PART

        let newTrs = await getNewTransactions(coinbaseTrxDB, userData);
        setTransactions(previousTransactions => {
            return [...previousTransactions, ...newTrs]
        })

    }

    const getAllTransactionsDB = async () => {
        setIsLoading(true)
        let coinbaseTransactions = []


        // COINBASE 
        coinbaseTransactions = await getTransactionsDB(userData, null, 'coinbase');
        setCoinbaseTrxDB(coinbaseTransactions)
        console.log('all Trx Coinbase', coinbaseTransactions.length);

        // KUCOIN
        let transactionsKucoin = []
        //  transactionsKucoin = await getTransactionsDB(userData, null, 'kucoin')

        // console.log('Kucoin Trx : ', tradesKucoin.length);
        // let depositsKucoin = await getTransactionsDB(userData, 'deposit', 'kucoin')
        // console.log('Deposits total ', depositsKucoin.length)
        // let withdrawalsKucoin = await getTransactionsDB(userData, 'withdrawals', 'kucoin')
        // console.log('Withdrawals total ', withdrawalsKucoin.length)
        // let mouvements = [...depositsKucoin, ...withdrawalsKucoin]
        // let transactionsKucoin = [...tradesKucoin, ...mouvements];

        let allTrx = [...transactionsKucoin, ...coinbaseTransactions];

        allTrx.sort((a, b) => {
            return b.created_at - a.created_at;
        })
        // ADD Number for devlopment 
        // console.log('add index for dev')
        // allTrx.forEach((transaction, ix) => {
        //     transaction.range = ix;
        // })
        console.log('All exchanges trx ', allTrx.length)
        // allTrx = eraseDoublon(allTrx)
        setTransactions(allTrx);
        // dispatch(setTransactionsState(allTrx))
        setIsLoading(false)
        // backgroundFetchQuote(allTrx)

        updateAllTransactions(allTrx)
    }


    React.useEffect(() => {
        if (!AuthenticationService.isAuthenticated) {
            navigate("/login");
        } else {
            // getAllTransactionsDB('no-update');
        }
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const style = {
        marginRight: '10px',
        marginTop: '0px'
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
            <Grid item xs={12} md={8} lg={9} mt={2} sx={{ display: 'flex', alignItems: "center", justifyContent: "flex-end" }}>

                <Button sx={style} variant="outlined" onClick={() => {
                    getAllTransactionsDB()
                }} >
                    Start
                </Button>


            </Grid>

            <Grid item xs={12} md={8} lg={9}>
                <TableTransactions transactions={transactions} isLoading={isLoading}>
                </TableTransactions>
            </Grid>
        </div >
    );
};

export default Transactions;