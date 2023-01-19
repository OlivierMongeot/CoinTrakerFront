import React from 'react';
import AuthenticationService from '../helpers/AuthService';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableTransactions from '../components/Transactions/TableTransactions';
import getNewWithdrawals from '../transactions/kucoin/withdrawals/getNewWithdraws'
// import eraseDoublon from '../helpers/eraseDoublon';
import getNewDeposits from '../transactions/kucoin/deposits/getNewDeposits';

import getNewTradesKucoin from '../transactions/kucoin/trades/getNewTradesKucoin';


import getTransactionsDB from '../transactions/getTransactionsDB';
import getNewTransactionsCoinbase from '../transactions/coinbase/getNewTransactions';
import getSingleQuote from '../transactions/getSingleQuote';
// import getQuote from '../transactions/getQuoteHistory';
// import getSingleQuote from '../transactions/getSingleQuote';
// import { useCallback } from 'react';


const Transactions = () => {

    // const updateQuote = async (transactions) => {
    //     console.log('Update Quote ', transactions)
    //     let index = 0

    //     while (index < transactions.length) {
    //         console.log('check ', index)
    //         if (transactions[index].quote_transaction === null) {

    //             let newTransacQuoted = await getSingleQuote(transactions[index], userData)

    //             if (newTransacQuoted !== null) {
    //                 console.log('update state')
    //                 const rowToUpdateIndex = index;

    //                 setTransactions(prevTransactions => {
    //                     return prevTransactions.map((trx, prevIndex) =>
    //                         prevIndex === rowToUpdateIndex ? { ...newTransacQuoted } : trx
    //                     );
    //                 })

    //             }

    //             // setTransactions(newTransacQuoted)
    //             console.log('New trx qoted ', newTransacQuoted)
    //         }
    //         index++

    //     }

    // }


    let navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    const [transactions, setTransactions] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    // const [coinbaseTrxDB, setCoinbaseTrxDB] = React.useState([])

    const getNewTransactions = async (coinbaseTransactionsDB) => {

        let state = null
        // KUCOIN PART
        do {
            let [newDeposits, st] = await getNewDeposits(userData);
            let newDepots = newDeposits
            state = st
            if (newDeposits.length > 0) {
                setTransactions(previousTransactions => {
                    return [...previousTransactions, ...newDepots]
                })
            }
        } while (state === 'continue');

        do {
            let [newWithdrawals, st] = await getNewWithdrawals(userData, false);
            let newWithdraws = newWithdrawals
            state = st
            if (newWithdraws.length > 0) {
                setTransactions(previousTransactions => {
                    return [...previousTransactions, ...newWithdraws]
                })
            }
        } while (state === 'continue');


        do {
            let [newTrades, st] = await getNewTradesKucoin(userData, false);
            let newTrs = newTrades
            // index++
            state = st
            if (newTrs.length > 0) {
                setTransactions(previousTransactions => {
                    return [...previousTransactions, ...newTrs]
                })
            }
        } while (state === 'continue');

        // COINBASE PART

        let newTrsCoinbase = await getNewTransactionsCoinbase(coinbaseTransactionsDB, userData);



        // setTransactions(previousTransactions => {
        //     return [...previousTransactions, ...newTrsCoinbase]
        // })
        // console.log('TRANSACTION ', transactions)


        // console.log('Set Transactions  updateLocalStorageTransaction for', transactions[index].exchange)
        // // updateLocalStorageTransaction(transactions[index]);
        // const rowToUpdateIndex = index;

        // setTransactions(prevTransactions => {
        //     return prevTransactions.map((trx, prevIndex) =>
        //         prevIndex === rowToUpdateIndex ? { ...trx } : trx
        //     );
        // })
    }



    const getAllTransactionsDB = async () => {
        setIsLoading(true)
        let coinbaseTransactionsDB = []

        // COINBASE 
        coinbaseTransactionsDB = await getTransactionsDB(userData, null, 'coinbase');
        // console.log('all Trx Coinbase In DB', coinbaseTransactionsDB);

        // KUCOIN
        let transactionsKucoinDB = await getTransactionsDB(userData, null, 'kucoin')

        let allTrx = [...transactionsKucoinDB, ...coinbaseTransactionsDB];

        allTrx.sort((a, b) => {
            return b.created_at - a.created_at;
        })

        console.log('All Exchanges trx in DB', allTrx.length)

        if (allTrx.length > 0) {
            setTransactions(allTrx);
        }

        setIsLoading(false)
        return [coinbaseTransactionsDB]

    }


    const process = async () => {

        let [trxDBCoinbase] = await getAllTransactionsDB()
        await getNewTransactions(trxDBCoinbase)
        console.log('State trx', transactions)
    }



    React.useEffect(() => {
        console.clear()
        if (!AuthenticationService.isAuthenticated) {
            navigate("/login");
        } else {
            // process()

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
                    process()
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