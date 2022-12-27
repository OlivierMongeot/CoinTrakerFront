import React from 'react';
import AuthenticationService from '../helpers/AuthService';
import { useNavigate } from "react-router-dom";
import config from '../config';
import DateFormater from '../helpers/DateFormater';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import TokenFormater from '../helpers/TokenFormater';
import BadgeFormater from '../helpers/BadgeFormater';
import getIdsCMC from '../api/getIdsCMC';
import TransactionFormater from '../helpers/TransactionFormater';
import NativeAmountormater from '../helpers/NativeAmountormater';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Transactions = () => {

    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    const [transactions, setTransactions] = React.useState([]);

    const columns: GridColDef[] = [

        {
            field: 'token', headerName: 'Token', width:
                160, align: 'left', headerAlign: 'center', hide: true,
            renderCell: (params) => <TokenFormater value={params.value} />
        },
        {
            field: 'transaction', headerName: 'Type', width:
                100, align: 'left', headerAlign: 'center',
            renderCell: (params) => <TransactionFormater value={params.value} />

        },
        {
            field: 'entry', headerName: 'Entrée(+)',
            minWidth: 200, align: 'right', headerAlign: 'center',
            renderCell: (params) => <BadgeFormater value={params.value} type='cashin' />
        },

        {
            field: 'exit', headerName: 'Sortie(-)', minWidth: 180, align: 'right', headerAlign: 'center',
            renderCell: (params) => <BadgeFormater value={params.value} type='cashout' />
        },
        {
            field: 'updated_at', headerName: 'Date', width: 260, align: 'center',
            headerAlign: 'center', renderCell: (params) => <DateFormater value={params.value} />
        },
        {
            field: 'title', headerName: 'Description', minWidth: 550, align: 'right',
            headerAlign: 'center'
        },
        {
            field: 'native_amount', headerName: 'Native Amount', width: 120, align: 'right',
            headerAlign: 'center',
            renderCell: (params) => <NativeAmountormater value={params.value} />
        },
        {
            field: 'smartType', headerName: 'Status', width: 130, align: 'center', headerAlign: 'center'
        },
        {
            field: 'id', headerName: 'ID', width:
                300, align: 'center', headerAlign: 'center',
            renderCell: (params) => <TokenFormater value={params.value} />
        }
    ];


    const addUrlImage = async (data) => {

        const seturlLogo = (tokenCode, tokenId) => {
            if (tokenCode === 'ETH2') {
                return "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png";
            } else if (tokenCode === 'EUR') {
                return "http://localhost:4000/images/eur.svg";
            }
            else { return "https://s2.coinmarketcap.com/static/img/coins/64x64/" + tokenId + ".png"; }
        }

        let ip = config.urlServer;
        const cmcTokensList = await getIdsCMC(ip);

        for (let i = 0; i < data.length; i++) {
            cmcTokensList.filter(token => {
                if (token.symbol.toLowerCase() === data[i].amount.currency.toLowerCase()) {
                    data[i].urlLogo = seturlLogo(token.symbol, token.id);
                }
                if (data[i].amount.currency.toLowerCase() === 'eur') {
                    data[i].urlLogo = seturlLogo(data[i].currency, 0);
                }
                return token.symbol.toLowerCase() === data[i].amount.currency.toLowerCase();
            })
        }
        return data;
    }


    const getSmartType = (type, amount) => {

        switch (type) {
            case 'send':
                if (parseFloat(amount) < 0) {
                    return 'Retrait'
                } else {
                    return 'Dépôt'
                }

            case 'trade':
                return 'Swap'

            case 'interest':
            case 'inflation_reward':
            case 'reward':
            case 'staking_reward':
                return 'Intérêt'

            case 'vault_withdrawal':
                return 'Retrait Wallet Externe'

            case 'advanced_trade_fill':
                return 'Trade avancé'

            case 'buy':
                return 'Achat'

            case 'fiat_deposit':
                return 'Dépôt FIAT'

            case 'transfer':
                return 'Transfert'

            default:
                console.log(type, amount)
                return 'unknow Type'

        }
    }

    const rebuildData = (data) => {

        data.forEach(element => {

            if (element.details.subtitle !== null) {
                element.title = element.details.title + ' ' + (element.details.subtitle).toLowerCase();
            } else {
                element.title = element.details.title;
            }
            if (element.details.header !== null) {
                element.title = element.title + ' (' + element.details.header + ')';
            }

            element.smartType = getSmartType(element.type, element.amount.amount);
            element.token = element.amount.currency;

            if (parseFloat(element.amount.amount) > 0) {

                element.entry = {
                    amount: element.amount.amount,
                    currency: element.amount.currency,
                    urlLogo: element.urlLogo
                }
                element.exit = {
                    amount: element.native_amount.amount,
                    currency: element.native_amount.currency
                }
                element.transaction = 'trade'
            } else {
                element.entry = {
                    amount: -element.native_amount.amount,
                    currency: element.native_amount.currency,
                }
                element.exit = {
                    amount: -element.amount.amount,
                    currency: element.amount.currency,
                    urlLogo: element.urlLogo
                }
                element.transaction = 'trade'
            }

            // Supprime les sorties du wallet sur les cas suivants:
            // !!!! depend des message coinbase !!!! Trouveer une meilleur soluce 
            if ((
                element.description && (element.description).includes('Earn'))
                || (element.details.subtitle && (element.details.subtitle).includes('Earn'))
                || (element.details.subtitle && (element.details.subtitle).includes('De Coinbase'))
                || (element.type === "fiat_deposit")
                || (element.type === "interest")
                || (element.type === 'reward')
                || (element.type === 'inflation_reward')
            ) {
                element.exit = { amount: 0, currency: '' };
                element.transaction = 'deposit';
            }

            if (element.type === 'send' && parseFloat(element.amount.amount) < 0) {
                element.entry = {
                    amount: 0,
                    currency: ''
                }
                element.transaction = 'withdraw'

            } else if (element.type === 'send') {
                element.exit = {
                    amount: 0,
                    currency: ''
                }
                element.transaction = 'deposit'
            }

            if (element.type === "vault_withdrawal" || element.type === "transfer") {
                if (parseFloat(element.amount.amount) < 0) {
                    // Retrait sur wallet extern
                    element.entry = {
                        amount: 0,
                        currency: ''
                    }
                    element.transaction = 'withdraw'

                } else {
                    // depot du wallet externe 
                    element.exit = {
                        amount: 0,
                        currency: ''
                    }
                    element.transaction = 'deposit'
                }
            }

        })

        return data;
    }

    const postProcess = async (data) => {
        let result = await addUrlImage(data)
        // rebuild data for table datagrid
        if (result.length > 0) {
            result = rebuildData(result);
            setTransactions(result);
            localStorage.setItem('transactions', JSON.stringify(result));
        } else {
            toast('Proccess error')
            console.log('PostProccess error ')
        }
    }


    const getNewTransactions = async (currentTokensWithTransaction, findNewAccount, full) => {

        const exchange = 'coinbase'; //todo
        const data = {
            email: userData.email,
            exchange: exchange,
            lastCurrentTransaction: currentTokensWithTransaction,
            findNewAccount: findNewAccount,
            full: full
        };

        try {
            let result = await fetch('http://' + config.urlServer + '/coinbase/new-transactions', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userData.token
                },
                body: JSON.stringify(data)
            })
            console.log('result', result);
            if (result) {

                return result.json()
            } else {
                return ('error').json();
            }
        } catch (error) {
            console.log('error', error);
            return false;
        }
    }

    const findNewAccount = () => {
        completeProccesTransaction(true, true)
    }

    const fullUpdateCurrentAccountTrx = () => {
        console.log('full current update')
        completeProccesTransaction(true, false, true)
    }

    const updateCurrentAccountTrx = () => {
        completeProccesTransaction(true, false)
    }


    const getLastestTransactions = (savedTrxs) => {

        let currentTokensWithTransaction = [];

        savedTrxs.forEach((transaction, index) => {

            let resource = transaction.resource_path;
            let resourceArray = resource.split('/');
            let idAccount = resourceArray[3]

            if (!currentTokensWithTransaction.includes(idAccount)) {
                currentTokensWithTransaction.push(idAccount)
            }
        })

        currentTokensWithTransaction.forEach((id, index) => {

            let transactionsByToken = savedTrxs.filter(transaction => {

                const path = transaction.resource_path;
                const pathArray = path.split('/');
                let idAcc = pathArray[3]
                return idAcc === id;
            })

            const lastTransaction = transactionsByToken.reduce((r, o) => new Date(o.created_at) > new Date(r.created_at) ? o : r);

            const path = lastTransaction.resource_path;
            const pathArray = path.split('/');
            currentTokensWithTransaction[index] = { id_account: pathArray[3], id_last_trx: pathArray[5] }
        })

        return currentTokensWithTransaction;
    }


    const completeProccesTransaction = async (update, findNewAccount, full = false) => {

        const savedTrxs = JSON.parse(localStorage.getItem('transactions'));

        if ((savedTrxs && savedTrxs.length > 0)) {

            if (update === true) {
                // Recupere la liste des token deja la avec la derniere transac 
                const lastTokensWithTransaction = getLastestTransactions(savedTrxs);
                // console.log('currentTokensWithTransaction after ', lastTokensWithTransaction);

                // Verifier si de nouvelles transac sur ces tokens avec l'ID di token et l'id de la derniere transaction
                let newTransaction = await getNewTransactions(lastTokensWithTransaction, findNewAccount, full);

                console.log('new transac final to add ', newTransaction);

                if (newTransaction && newTransaction.length > 0) {
                    newTransaction = await addUrlImage(newTransaction)
                    newTransaction = rebuildData(newTransaction);

                    // Ajouter les token au ancien en memoire
                    let updatedTransactions = [...savedTrxs, ...newTransaction]

                    // Verifie si doublon, il y a 
                    updatedTransactions = eraseDoublon(updatedTransactions)
                    toast('New transaction added')
                    // make ckeck if new transaction 
                    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
                    setTransactions(updatedTransactions);
                } else {
                    toast('No new transaction')
                }

            } else {
                setTransactions(savedTrxs);
            }

        } else {

            const exchange = 'coinbase';
            const data = {
                email: userData.email,
                exchange: exchange
            };

            try {
                fetch('http://' + config.urlServer + '/coinbase/tokens-transactions', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': userData.token
                    },
                    body: JSON.stringify(data)
                }).then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error('Something went wrong');
                    }

                })
                    .then(data => {
                        console.log('data', data);
                        postProcess(data);
                    }).catch(error => {
                        console.log(error);
                    })

            } catch (error) {
                console.log(error);
            }
        }
    }

    const eraseDoublon = (transactions) => {
        // console.log('erase dblon ', transactions.length)
        let r = [...new Map(transactions.map((m) => {
            return [m.id, m]
        })).values()];
        // console.log('After erase ', r.length)
        return r;
    }

    // const deleteLastTrx = () => {

    //     let transactions = JSON.parse(localStorage.getItem('transactions'));

    //     const trxs = ['33602c97-2d22-5502-ba70-8a66daae0a7a'];

    //     console.log(transactions);

    //     transactions.forEach((trx, index) => {
    //         if (trx && trx.id) {
    //             if (trxs.includes(trx.id)) {
    //                 console.log('find', transactions[index], index)
    //                 delete transactions[index];
    //             }
    //         }
    //     })
    //     let compactArray = transactions.filter(function (item) {
    //         return item !== null;
    //     });
    //     localStorage.setItem('transactions', JSON.stringify(compactArray))
    // }


    const style = {
        marginLeft: '10px'
    }


    React.useEffect(() => {

        if (!AuthenticationService.isAuthenticated) {
            navigate("/login");
        }

        completeProccesTransaction(false, false);
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="app-container">
            <Grid item xs={12} md={8} lg={9} mt={5}>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
                <Button sx={style} variant="outlined" onClick={updateCurrentAccountTrx} >
                    Quick Update
                </Button>
                <Button sx={style} variant="outlined" onClick={fullUpdateCurrentAccountTrx} >
                    Full Update
                </Button>
                <Button sx={style} variant="outlined" onClick={findNewAccount} >
                    Find new account
                </Button>

                {/* <Button variant="outlined" onClick={deleteLastTrx} >
                    Delete  Last transactions
                </Button> */}
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '80vh',
                        marginTop: 3
                    }} >
                    {transactions && (
                        <div style={{ height: '100%', width: '100%' }}>
                            <DataGrid initialState={{
                                sorting: {
                                    sortModel: [{ field: 'updated_at', sort: 'desc' }],
                                },
                            }} rows={transactions} columns={columns} />
                        </div>
                    )}
                </Paper>
            </Grid>
        </div >
    );
};

export default Transactions;