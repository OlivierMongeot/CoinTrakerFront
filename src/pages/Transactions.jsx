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
import getWithdrawalsKucoin from '../withdrawals/kucoinWithdraw'
import getSimpleDate from '../helpers/getSimpleDate';
import getFiatValue from '../helpers/getFiatValue';
import getQuoteHistoric from '../api/getQuoteHistoric';


const Transactions = () => {

    let navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    const [transactions, setTransactions] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [pourcentLoad] = React.useState(0);


    const quickUpdate = () => {
        processAllTransactions('quick');
    }

    const fullUpdateCurrentAccountTrx = () => {
        proccesTransactionCoinbase('full-current')
    }

    const updateLocalStorageTransaction = (transaction) => {

        let exchange = transaction.exchange;
        console.log('update LOCAL STORAGE  trade', exchange)
        let transactions = JSON.parse(localStorage.getItem('transactions-all'))
        transactions.forEach((element, index) => {
            if (element.id === transaction.id) {
                transactions[index].quote_transaction = transaction.quote_transaction
            }
        });
        localStorage.setItem('transactions-all', JSON.stringify(transactions))
    }

    const backgroundFetchQuote = async (transactions) => {

        console.log('Background Fetch Quote')
        let index = 0;

        while (index < transactions.length && index < 4555555555555555) {

            let currency = null;
            let date = getSimpleDate(transactions[index].createdAt);

            if (!transactions[index].quote_transaction || transactions[index].quote_transaction.devises === null) {
                console.log('Transactions n°' + index, transactions[index])
                console.log('Get quotation for ', transactions[index].native_amount.currency)
                let amount = null;
                switch (transactions[index].exchange) {

                    case 'kucoin':
                        amount = transactions[index].native_amount.amount
                        currency = transactions[index].native_amount.currency
                        break
                    case 'coinbase':
                        const nativeAmount = parseFloat(transactions[index].native_amount.amount);
                        if (nativeAmount !== 0) {
                            amount = transactions[index].native_amount.amount
                            currency = transactions[index].native_amount.currency
                        } else {
                            amount = transactions[index].amount.amount
                            currency = transactions[index].amount.currency
                        }
                        break;

                    default:
                        break;
                }

                // // Part 2 : gestion du token 
                if (index > 0
                    && getSimpleDate(transactions[index - 1].createdAt) === date

                    && transactions[index].native_amount.currency === transactions[index - 1].native_amount.currency

                    && parseFloat(transactions[index].native_amount.amount) !== 0) {

                    console.log('take prev data quotation')

                    let prevDevises = transactions[index - 1]?.quote_transaction.devises;
                    if (prevDevises) {
                        transactions[index].quote_transaction = { devises: prevDevises, amount: amount, currency: currency };
                    }

                } else {

                    console.log('id trx ', transactions[index].id)
                    // currency = transactions[index].native_amount.currency;
                    let quoteFiat = null;

                    switch (currency) {
                        case 'USD':
                            console.log('Hack quote Fiat for usd')
                            quoteFiat = await getFiatValue('USDT', date);
                            for (let element in quoteFiat) {
                                quoteFiat[element] = quoteFiat[element] / quoteFiat["usd"]
                            }
                            break;

                        default:
                            quoteFiat = await getFiatValue(currency, date);
                            break;
                    }

                    console.log('Quote fiat for ' + currency + ' / ' + transactions[index].exchange, quoteFiat)

                    transactions[index].quote_transaction = {
                        amount: amount,
                        currency: currency,
                        devises: quoteFiat
                    }
                }

                console.log('Set Transactions  updateLocalStorageTransaction for', transactions[index].exchange)
                updateLocalStorageTransaction(transactions[index]);
                const rowToUpdateIndex = index;

                setTransactions(prevTransactions => {
                    return prevTransactions.map((trx, prevIndex) =>
                        prevIndex === rowToUpdateIndex ? { ...trx } : trx
                    );
                })
            } else {
                // console.log('Ever in place transactions n°' + index, transactions[index])
            }
            index++;
        }

    }


    const processAllTransactions = async (mode) => {
        setIsLoading(true);
        let allTrx = []
        let allCoinbaseTrx = []
        // COINBASE 
        allCoinbaseTrx = await proccesTransactionCoinbase(mode, userData);
        console.log('all Trx Coinbase', allCoinbaseTrx.length);

        // KUCOIN
        let kucoinTrade = []
        let transactionsKucoin = []
        let mouvements = []
        kucoinTrade = await proccesTradesKucoin('start', userData);
        console.log('Kucoin Trx : ', kucoinTrade.length);
        let depositsKucoin = []
        let withdrawalsKucoin = []
        depositsKucoin = (await depositKucoin('start', userData));
        console.log('Deposits total ', depositsKucoin.length)
        withdrawalsKucoin = await getWithdrawalsKucoin('start', userData);
        console.log('Withdrawals total ', withdrawalsKucoin.length)
        mouvements = [...depositsKucoin, ...withdrawalsKucoin]
        transactionsKucoin = [...kucoinTrade, ...mouvements];
        // allTrxKucoin = eraseDoublon(allTrxKucoin)

        allTrx = [...transactionsKucoin, ...allCoinbaseTrx];
        allTrx.sort((a, b) => {
            return b.createdAt - a.createdAt;
        })
        // ADD Number for devlopment 
        console.log('add index')
        allTrx.forEach((transaction, ix) => {
            transaction.range = ix;
        })
        localStorage.setItem('transactions-all', JSON.stringify(allTrx));
        console.log('All exchanges trx ', allTrx.length)
        console.log('-----------------------------------------')


        setTransactions(allTrx);

        setIsLoading(false)
        backgroundFetchQuote(allTrx)

    }



    React.useEffect(() => {
        if (!AuthenticationService.isAuthenticated) {
            navigate("/login");
        } else {
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

                <Button variant="outlined" onClick={processAllTransactions} >
                    Deposit test
                </Button>
                {/* <div style={{ display: 'flex', width: '200px', alignContent: "center", justifyContent: "center" }}>
                    <TrxLoader display={isLoading} >
                    </TrxLoader>
                    <div style={{ display: isLoading }}>
                        {pourcentLoad} %
                    </div>
                </div> */}
            </Grid>

            <Grid item xs={12} md={8} lg={9}>
                <TableTransactions transactions={transactions} isLoading={isLoading}>
                </TableTransactions>
            </Grid>
        </div >
    );
};

export default Transactions;