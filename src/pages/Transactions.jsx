import React from 'react';
import AuthenticationService from '../helpers/AuthService';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TrxLoader from '../components/TrxLoader';

import proccesTransactionCoinbase from '../trades/coinbase';
import TableTransactions from '../components/Transactions/TableTransactions';
// import eraseDoublon from '../helpers/eraseDoublon';
import proccesTradesKucoin from '../trades/kucoin';
import depositKucoin from '../deposits/kucoin'
import withdrawalsKucoin from '../withdrawals/kucoinWithdraw'
import getSimpleDate from '../helpers/getSimpleDate';
import getFiatValue from '../helpers/getFiatValue';
import getQuoteHistoric from '../api/getQuoteHistoric';


const Transactions = () => {

    let navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    const [transactions, setTransactions] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState('none');
    const [pourcentLoad] = React.useState(0);

    const quickUpdate = () => {
        processAllTransactions('quick');
    }

    const fullUpdateCurrentAccountTrx = () => {
        proccesTransactionCoinbase('full-current')
    }

    const updateLocalStorageTransaction = (transaction) => {

        console.log('updateLocalStorageTransaction')

        let exchange = transaction.exchange;
        let transactions = JSON.parse(localStorage.getItem('transactions-' + exchange))

        transactions.forEach((element, index) => {
            if (element.id === transaction.id) {
                transactions[index].quote_transaction = transaction.quote_transaction
            }
        });

        localStorage.setItem('transactions-' + exchange, JSON.stringify(transactions))

    }

    const backgroundFetchQuote = async (transactions) => {

        console.log('background Fetch Quote')
        let index = 4;

        while (index < 6) {

            // let trx = transactions[index];

            let currency = null;
            let date = getSimpleDate(transactions[index].createdAt);

            let currencyUsed = null;
            // Pas de quote trx 
            // if (!transactions[index].quote_transaction) {
            // on check si dejé cherché avant
            console.log('Pas de quote pour ', transactions[index].amount.currency)
            let amount = null;
            switch (transactions[index].transaction) {

                case 'deposit':
                case 'trade':
                case 'withdraw':
                    const nativeAmount = parseFloat(transactions[index].native_amount.amount);
                    if (nativeAmount > 0) {
                        amount = transactions[index].native_amount.amount
                    } else {
                        amount = transactions[index].amount.amount
                    }
                    // amount = :
                    break;
                // case 'trade':
                //     break;
                // case 'withdraw':
                //     break;



                default:
                    break;
            }

            if (index > 0 && getSimpleDate(transactions[index - 1].createdAt) === date) {

                let prevDevises = transactions[index - 1].quote_transaction.devises;
                if (prevDevises) {

                    transactions[index].quote_transaction = { devises: prevDevises, amount: amount };
                }

            } else {

                console.log('id trx ', transactions[index].id)
                currency = transactions[index].native_amount.currency;

                if (currency === 'USD') {
                    currencyUsed = 'USDT';
                } else {
                    currencyUsed = currency
                }

                let quoteFiat = await getFiatValue(currencyUsed, date);
                console.log('quote fiat Coinbase', quoteFiat)

                if (currency === 'USD') {
                    // hack : map the date array because coinGeckon don't give USD/EUR quote 
                    for (let element in quoteFiat) {
                        quoteFiat[element] = quoteFiat[element] / quoteFiat["usd"]
                    }
                }

                console.log('quote fiat after', quoteFiat)


                transactions[index].quote_transaction = {
                    amount: amount,
                    devises: quoteFiat
                }



            }
            console.log('set Transactions  updateLocalStorageTransaction', transactions[index].exchange)
            updateLocalStorageTransaction(transactions[index]);
            const rowToUpdateIndex = index;
            // setTransactions(transactions)
            setTransactions(prevTransactions => {



                return prevTransactions.map((trx, prevIndex) =>
                    prevIndex === rowToUpdateIndex ? { ...trx } : trx
                );


            })
            // console.log('set Transactions Coinbase')
            // localStorage.setItem('transactions-coinbase', JSON.stringify(transactions));
            // } else {
            //     console.log('Quote trx déja present ')
            // }

            // transactions = getQuoteHistoric(transactions, index)



            index++;
        }

        // localStorage.setItem('transactions-coinbase', JSON.stringify(transactions));
    }


    const processAllTransactions = async (mode) => {
        let allTrx = []
        let allCoinbaseTrx = []
        // COINBASE 
        // allCoinbaseTrx = await proccesTransactionCoinbase(mode, userData);

        // BackgroundUpdate Quote Price by Date 


        console.log('all Trx Coinbase', allCoinbaseTrx.length);
        // KUCOIN
        let kucoinTrade = []
        let transactionsKucoin = []
        let mouvements = []
        kucoinTrade = await proccesTradesKucoin('start', userData);
        console.log('Kucoin Trx : ', kucoinTrade.length);

        // mouvements = await getMouvementsKucoin();
        console.log('all mouvement to add', mouvements.length);

        transactionsKucoin = [...kucoinTrade, ...mouvements];

        // allTrxKucoin = eraseDoublon(allTrxKucoin)
        localStorage.setItem('transactions-kucoin', JSON.stringify(transactionsKucoin));

        allTrx = [...transactionsKucoin, ...allCoinbaseTrx];
        // localStorage.setItem('transactions-all', JSON.stringify(allTrx));
        console.log('All exchanges trx ', allTrx.length)
        console.log('-----------------------------------------')

        setTransactions(allTrx);
        backgroundFetchQuote(allTrx);
    }


    const getMouvementsKucoin = async () => {

        let deposits = []
        let withdrawals = []
        deposits = (await depositKucoin('start', userData));
        console.log('Deposits to add ', deposits.length)
        withdrawals = (await withdrawalsKucoin('start', userData));
        console.log('Withdrawals to add ', withdrawals.length)

        let newMouvements = [...deposits, ...withdrawals]
        return newMouvements;
    }


    React.useEffect(() => {

        if (!AuthenticationService.isAuthenticated) {
            navigate("/login");
        } else {
            console.log(' ___ALL_TRANSACTION__START PROCCESS____')
            processAllTransactions('no-update');
        }


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
                <Button sx={style} variant="outlined" onClick={proccesTradesKucoin} >
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