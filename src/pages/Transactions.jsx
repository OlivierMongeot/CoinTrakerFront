import React from 'react';
import AuthenticationService from '../helpers/AuthService';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableTransactions from '../components/Transactions/TableTransactions';
import getTransactionsDB from '../transactions/getTransactionsDB';
import TrxLoader from '../components/Transactions/TrxLoader';
import getNewTransactionsGateIo from '../transactions/gateio/getAllNewTransactionsGateIo';
import setTimeTable from '../transactions/setTimeTable';
import resetGateioData from '../transactions/gateio/resetGateIoData';

import rebuild from '../transactions/gateio/rebuild';
import deleteCancelledTrx from '../transactions/gateio/deleteCancelledTrx';
import getAllNewTransactionsCoinbase from '../transactions/coinbase/getNewTransactionsCoinbase';
import addUrlImage from '../helpers/addUrlImage';
import rebuildDataCoinbase from '../transactions/coinbase/rebuildDataCoinbase';
import getSingleQuote from '../transactions/getSingleQuote';
import saveNewTransactions from '../transactions/saveNewTransactionsDB';


const Transactions = () => {

    let navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    const [transactions, setTransactions] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [pageLoader, setPageLoader] = React.useState(false)

    const getAllNewTransactions = async (coinbaseTransactionsDB, kucointrx, gateIoTrx) => {

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


        // COINBASE 


        let newTrxsCoinbase = await getAllNewTransactionsCoinbase(
            coinbaseTransactionsDB, userData, false, false);
        console.log('new trx coinbase ', newTrxsCoinbase)

        if (newTrxsCoinbase.length > 0) {
            let index = 0
            newTrxsCoinbase = await addUrlImage(newTrxsCoinbase, 'coinbase')
            newTrxsCoinbase = await rebuildDataCoinbase(newTrxsCoinbase, userData);
            console.log('rebuilded element', newTrxsCoinbase)
            let previousTransactions = null
            while (index < newTrxsCoinbase.length && index < 5000) {
                if (index > 0) {
                    previousTransactions = newTrxsCoinbase[index - 1]
                }

                let newTrx = await getSingleQuote(newTrxsCoinbase[index], previousTransactions)
                index++
                let tx = [newTrx]
                if (newTrx.currency !== previousTransactions?.currency) {
                    toast('New transaction for ' + newTrx.currency)
                }

                saveNewTransactions(tx, userData)
                setTransactions(previousTransactions => {
                    return [...previousTransactions, ...tx]
                })
            }
        }


        // //  NEW GATEIO 

        // let index = 0
        // do {
        //     console.log('start new Withdrawals GATEIO ')
        //     let [withdrawals, STATE, timeToSet] = await getNewTransactionsGateIo(userData, 'withdrawals')
        //     state = STATE
        //     console.log('new withdrawals', withdrawals)
        //     if (withdrawals.length > 0) {
        //         while (index < withdrawals.length) {
        //             let newTrx = await rebuild(withdrawals[index], userData, 'withdrawals')
        //             setTransactions(previousTransactions => {
        //                 return [...previousTransactions, ...[newTrx]]
        //             })
        //             index++
        //         }
        //     }

        //     index = 0
        //     console.log(state)
        //     await setTimeTable('gateio', 'withdrawals', parseInt(timeToSet), userData)
        // } while (state === 'continue');


        // index = 0
        // do {
        //     console.log('start new Deposits GATEIO ')
        //     let [deposits, STATE, timeToSet] = await getNewTransactionsGateIo(userData, 'deposits')
        //     state = STATE
        //     if (deposits.length > 0) {
        //         while (index < deposits.length) {
        //             let newQuotedTrx = await rebuild(deposits[index], userData, 'deposits')
        //             setTransactions(previousTransactions => {
        //                 return [...previousTransactions, ...[newQuotedTrx]]
        //             })
        //             index++
        //         }
        //     }
        //     index = 0
        //     await setTimeTable('gateio', 'deposits', parseInt(timeToSet), userData)
        // } while (state === 'continue');


        // index = 0
        // do {
        //     console.log('start new Trades GATE IO ')
        //     let [trades, STATE, timeToSet] = await getNewTransactionsGateIo(userData, 'trades')
        //     let previousTransactions = null
        //     state = STATE
        //     if (trades.length > 0) {
        //         while (index < trades.length) {
        //             index > 0 ? previousTransactions = trades[index - 1] : previousTransactions = null
        //             let newQuotedTrx = await rebuild(trades[index], userData, 'trades', previousTransactions)
        //             setTransactions(previousTransactions => {
        //                 return [...previousTransactions, ...[newQuotedTrx]]
        //             })
        //             index++
        //         }
        //     }
        //     index = 0
        //     await setTimeTable('gateio', 'trades', parseInt(timeToSet), userData)
        // } while (state === 'continue');




        setIsLoading(false)
        setPageLoader(false)
    }



    const getAllTransactionsDB = async () => {
        setIsLoading(true)
        setPageLoader(true)
        let coinbaseTransactionsDB = []

        // COINBASE 
        coinbaseTransactionsDB = await getTransactionsDB(userData, null, 'coinbase');
        console.log('Trx Coinbase In DB', coinbaseTransactionsDB);

        // KUCOIN
        let transactionsKucoinDB = []
        // transactionsKucoinDB = await getTransactionsDB(userData, null, 'kucoin')


        // Gateio 
        let transactionsGatioDB = []
        // transactionsGatioDB = await getTransactionsDB(userData, null, 'gateio')
        // localStorage.setItem('GateIo-transactions', JSON.stringify(transactionsGatioDB))

        let allTrx = [...transactionsKucoinDB, ...coinbaseTransactionsDB, ...transactionsGatioDB];

        allTrx.sort((a, b) => {
            return b.created_at - a.created_at;
        })

        console.log('All Exchanges trx in DB', allTrx.length)

        setTransactions(allTrx);

        setIsLoading(false)
        return [coinbaseTransactionsDB, transactionsKucoinDB, transactionsGatioDB]
    }


    const process = async () => {
        console.clear()
        let [trxDBCoinbase, trxKuCoin, trxGateIo] = await getAllTransactionsDB()
        console.log('DB trx GateIo ', trxGateIo)
        getAllNewTransactions(trxDBCoinbase, trxKuCoin, trxGateIo)
    }

    const helperFunction = () => {
        deleteCancelledTrx(userData)
    }

    const resetData = () => {
        resetGateioData('gateio', userData, 'deposit')
    }

    React.useEffect(() => {

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
                <Button sx={style} variant="outlined" onClick={() => {
                    resetData()
                }} >
                    Reset Data
                </Button>
                <Button sx={style} variant="outlined" onClick={() => {
                    helperFunction()
                }} >
                    HELPERS
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