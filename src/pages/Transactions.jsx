import React from 'react';
import AuthenticationService from '../helpers/AuthService';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableTransactions from '../components/Transactions/TableTransactions';
import getNewWithdrawalsKucoin from '../transactions/kucoin/withdrawals/getNewWithdraws'
// import eraseDoublon from '../helpers/eraseDoublon';
import getNewDepositsKucoin from '../transactions/kucoin/deposits/getNewDeposits';

import getNewTradesKucoin from '../transactions/kucoin/trades/getNewTradesKucoin';


import getTransactionsDB from '../transactions/getTransactionsDB';
import getAllNewTransactionsCoinbase from '../transactions/coinbase/getNewTransactionsCoinbase';
import getSingleQuote from '../transactions/getSingleQuote';
import TrxLoader from '../components/Transactions/TrxLoader';
import addUrlImage from '../helpers/addUrlImage';
import rebuildDataCoinbase from '../transactions/coinbase/rebuildDataCoinbase';
import saveNewTransactions from '../transactions/saveNewTransactionsDB';
import getQuote from '../transactions/getQuoteHistory';
import updateTransactionDB from '../transactions/updateTransactionDB';
// import getQuote from '../transactions/getQuoteHistory';
// import { useCallback } from 'react';


const Transactions = () => {


    let navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    const [transactions, setTransactions] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const [pageLoader, setPageLoader] = React.useState(false)


    const getAllNewTransactions = async (coinbaseTransactionsDB) => {

        let state = null
        // KUCOIN PART
        // do {
        //     let [newDeposits, st] = await getNewDepositsKucoin(userData);
        //     let newDepots = newDeposits
        //     state = st
        //     if (newDeposits.length > 0) {
        //         setTransactions(previousTransactions => {
        //             return [...previousTransactions, ...newDepots]
        //         })
        //     }
        // } while (state === 'continue');

        // do {
        //     let [newWithdrawals, st] = await getNewWithdrawalsKucoin(userData, false);
        //     let newWithdraws = newWithdrawals
        //     state = st
        //     if (newWithdraws.length > 0) {
        //         setTransactions(previousTransactions => {
        //             return [...previousTransactions, ...newWithdraws]
        //         })
        //     }
        // } while (state === 'continue');


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
        // let newTrxsCoinbase = await getNewTransactionsCoinbase(coinbaseTransactionsDB, userData);

        // setTransactions(previousTransactions => {
        //     return [...previousTransactions, ...newTrxsCoinbase]
        // })
        console.log('getNewTransactionsCoinbase ')

        let newTrxsCoinbase = await getAllNewTransactionsCoinbase(
            coinbaseTransactionsDB, userData, false, false);
        // console.log('new trx coinbase ', newTrxsCoinbase)

        if (newTrxsCoinbase.length > 0) {
            let index = 0
            newTrxsCoinbase = await addUrlImage(newTrxsCoinbase, 'coinbase')
            newTrxsCoinbase = await rebuildDataCoinbase(newTrxsCoinbase, userData);
            console.log('rebuilded element', newTrxsCoinbase)

            while (index < newTrxsCoinbase.length && index < 5000) {

                let newTrx = await getSingleQuote(newTrxsCoinbase[index])
                // await delay(500)
                let newCurrencyTrx = JSON.parse(localStorage.getItem('newTokenNotification'))
                index++
                let tx = [newTrx]
                if (newCurrencyTrx !== newTrx.currency) {
                    toast('New transaction for ' + newTrx.currency)
                }


                saveNewTransactions(tx, userData)
                setTransactions(previousTransactions => {
                    return [...previousTransactions, ...tx]
                })
                localStorage.setItem('newTokenNotification', JSON.stringify(false))
            }
        }


        // console.log('Set Transactions  updateLocalStorageTransaction for', transactions[index].exchange)
        // // updateLocalStorageTransaction(transactions[index]);
        // const rowToUpdateIndex = index;

        // setTransactions(prevTransactions => {
        //     return prevTransactions.map((trx, prevIndex) =>
        //         prevIndex === rowToUpdateIndex ? { ...trx } : trx
        //     );
        // })



        // Verifie transaction without amount 

        console.log('CHECK IF ALL TRX have quotation ', transactions)
        let index = 0
        while (index < transactions.length) {
            if (transactions[index].quote_transaction === null) {

                let trxQuoted = await getSingleQuote(transactions[index])

                let updatedTrx = trxQuoted
                console.log('updated trx ', updatedTrx)
                updateTransactionDB(transactions[index].id_transaction, transactions[index].quote_transaction, userData)
                const rowToUpdateIndex = index;
                setTransactions(prevTransactions => {
                    return prevTransactions.map((trx, prevIndex) =>
                        prevIndex === rowToUpdateIndex ? { ...updatedTrx } : trx
                    );
                })
            }
            index++
        }

        setPageLoader(false)
    }



    const getAllTransactionsDB = async () => {
        setIsLoading(true)
        setPageLoader(true)
        let coinbaseTransactionsDB = []

        // COINBASE 
        coinbaseTransactionsDB = await getTransactionsDB(userData, null, 'coinbase');
        // console.log('all Trx Coinbase In DB', coinbaseTransactionsDB);

        // KUCOIN
        let transactionsKucoinDB = []
        transactionsKucoinDB = await getTransactionsDB(userData, null, 'kucoin')

        let allTrx = [...transactionsKucoinDB, ...coinbaseTransactionsDB];

        allTrx.sort((a, b) => {
            return b.created_at - a.created_at;
        })

        console.log('All Exchanges trx in DB', allTrx.length)

        if (allTrx.length > 0) {
            setTransactions(allTrx);
        }

        setIsLoading(false)
        return [coinbaseTransactionsDB, transactionsKucoinDB]

    }


    const process = async () => {
        console.clear()
        let [trxDBCoinbase, trxKuCoin] = await getAllTransactionsDB()
        getAllNewTransactions(trxDBCoinbase)
        // console.log('State trx', transactions)
    }



    React.useEffect(() => {

        if (!AuthenticationService.isAuthenticated) {
            navigate("/login");
        } else {
            process()
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
                position="top-center"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                theme="dark"
            />
            <Grid item xs={12} md={8} lg={9} mt={2} sx={{ display: 'flex', alignItems: "center", justifyContent: "flex-end" }}>
                <TrxLoader fontSize='30' display={pageLoader} />
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