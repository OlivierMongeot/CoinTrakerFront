import React from 'react';
import AuthenticationService from '../helpers/AuthService';
import { useNavigate } from "react-router-dom";
import config from '../config';
import DateFormater from '../helpers/DateFormater';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import TokenFormater from '../helpers/TokenFormater';
import BadgeFormater from '../helpers/BadgeFormater';
import getIdsCMC from '../api/getIdsCMC';
import TransactionFormater from '../helpers/TransactionFormater';
import NativeAmountormater from '../helpers/NativeAmountormater';
import DescriptionFormater from '../helpers/DescriptionFormater';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Transactions = () => {

    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    const [transactions, setTransactions] = React.useState([]);

    const columns: GridColDef[] = [
        {
            field: 'exchange', headerName: 'Exchange', align: 'center', headerAlign: 'center', minWidth: 90,
            flex: 1, maxWidth: 120,
            renderCell: (params) => (params.value)
        },
        {
            field: 'token', headerName: 'Token', width:
                160, align: 'left', headerAlign: 'center', hide: true,
            renderCell: (params) => <TokenFormater value={params.value} />
        },
        {
            field: 'transaction', headerName: 'Type', align: 'left', headerAlign: 'center', minWidth: 90,
            flex: 1,
            renderCell: (params) => <TransactionFormater value={params.value} />

        },
        {
            field: 'smartTitle', headerName: 'Info', minWidth: 80, align: 'center', flex: 1,
            headerAlign: 'center', renderCell: (params) => <DescriptionFormater value={params.value} />
        },
        {
            field: 'entry', headerName: 'Entrée(+)',
            minWidth: 160, align: 'right', headerAlign: 'center', flex: 1,
            renderCell: (params) => <BadgeFormater value={params.value} type='cashin' />
        },

        {
            field: 'exit', headerName: 'Sortie(-)', minWidth: 160, flex: 1, align: 'right', headerAlign: 'center',
            renderCell: (params) => <BadgeFormater value={params.value} type='cashout' />
        },
        {
            field: 'updated_at', headerName: 'Date', align: 'center', flex: 2, minWidth: 200,
            headerAlign: 'center', renderCell: (params) => <DateFormater value={params.value} />
        },

        {
            field: 'native_amount', headerName: 'Native Amount', minWidth: 100, align: 'right',
            headerAlign: 'center', flex: 1,
            renderCell: (params) => <NativeAmountormater value={params.value} />
        }
        // ,
        // {
        //     field: 'smartType', headerName: 'Info', minWidth: 120, align: 'center',
        //     headerAlign: 'center'
        // }
        ,

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

        const cmcTokensList = await getIdsCMC();

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

    const rebuildData = async (data, exchange) => {
        console.log('rebuild data');
        data.forEach(element => {

            element.exchange = exchange;

            if (element.details.subtitle !== null) {
                element.title = element.details.title + ' ' + (element.details.subtitle).toLowerCase();
            } else {
                element.title = element.details.title;
            }
            if (element.details.header !== null) {
                element.title = element.title + ' (' + element.details.header + ')';
            }

            element.smartType = getSmartType(element.type, element.amount.amount);
            element.smartTitle = { info: element.title, type: element.smartType }
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

            if (element.type === "buy") {
                element.buy_data = { price: 'eur' };
            }

        })

        return data;
    }

    const postProcess = async (data, exchange) => {
        let result = await addUrlImage(data)
        // rebuild data for table datagrid
        if (result.length > 0) {
            result = await rebuildData(result, exchange);
            setTransactions(result);
            localStorage.setItem('transactions', JSON.stringify(result));
        } else {
            toast('Proccess error')
            console.log('PostProccess error ')
        }
    }


    const getNewTransactions = async (currentTokensWithTransaction, findNewAccount, full) => {
        console.log('get New TRX');

        const exchange = 'coinbase'; //todo
        const data = {
            email: userData.email,
            exchange: exchange,
            lastCurrentTransaction: currentTokensWithTransaction,
            findNewAccount: findNewAccount,
            full: full
        };

        try {
            let response = await fetch('http://' + config.urlServer + '/coinbase/new-transactions', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userData.token
                },
                body: JSON.stringify(data)
            })
            console.log('response', response);
            if (response.ok) {
                return response.json()
            } else {
                console.log('error:', response)
                return ('error response ').json();
            }
        } catch (error) {
            console.log('error catched : ', error);
            return false;
        }
    }

    const findNewAccount = () => {
        completeProccesTransactionCoinbase(true, true)
    }

    const fullUpdateCurrentAccountTrx = () => {
        console.log('full current update')
        completeProccesTransactionCoinbase(true, false, true)
    }

    const updateCurrentAccountTrx = async () => {
        await completeProccesTransactionCoinbase(true, false);
    }


    const getLastestTransactions = (savedTrxs, exchange) => {

        let currentTokensWithTransaction = [];

        savedTrxs.forEach((transaction, index) => {

            // TODO selectionneer seulemment les exchanges
            if (transaction.exchange === exchange) {
                let resource = transaction.resource_path;
                let resourceArray = resource.split('/');
                let idAccount = resourceArray[3]

                if (!currentTokensWithTransaction.includes(idAccount)) {
                    currentTokensWithTransaction.push(idAccount)
                }
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
            const token = lastTransaction.amount.currency;
            const path = lastTransaction.resource_path;
            const pathArray = path.split('/');
            currentTokensWithTransaction[index] = { id_account: pathArray[3], id_last_trx: pathArray[5], token: token }
        })

        return currentTokensWithTransaction;
    }


    const completeProccesTransactionCoinbase = async (update, findNewAccount, full = false) => {


        const savedTrxs = JSON.parse(localStorage.getItem('transactions'));

        if ((savedTrxs && savedTrxs.length > 0)) {

            if (update === true) {
                // Recupere la liste des token deja la avec la derniere transac 
                const lastTokensWithTransaction = getLastestTransactions(savedTrxs, 'coinbase');
                console.log('currentTokensWithTransaction after ', lastTokensWithTransaction);

                // Verifier si de nouvelles transac sur ces tokens avec l'ID di token et l'id de la derniere transaction
                let newTransaction = await getNewTransactions(lastTokensWithTransaction, findNewAccount, full);

                console.log('new transac final to add ', newTransaction);

                if (newTransaction && newTransaction.length > 0) {
                    newTransaction = await addUrlImage(newTransaction)
                    newTransaction = rebuildData(newTransaction, 'coinbase');

                    // Ajouter les token au ancien en memoire
                    let updatedTransactions = [...savedTrxs, ...newTransaction]

                    // Verifie si doublon, il y a 
                    console.log('erase doublon')
                    updatedTransactions = eraseDoublon(updatedTransactions)
                    toast('New transaction added')
                    // make ckeck if new transaction 
                    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
                    setTransactions(updatedTransactions);
                } else {
                    toast('No new transaction')
                }

            } else {
                // let res = rebuildData(savedTrxs, 'coinbase');
                // localStorage.setItem('transactions', JSON.stringify(res));
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
                        postProcess(data, 'coinbase');
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


    const fetchAllAccount = async () => {


        let nexPageAccounUri = null;
        let accounts = [];

        async function fetchAccount(path) {

            const data = {
                email: userData.email,
                exchange: 'coinbase',
                path: path
            };

            const response = await fetch('http://' + config.urlServer + '/coinbase/accounts', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userData.token
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const message = `An error has occured: ${response.status}`;
                throw new Error(message);
            }
            const accountsPage = await response.json();
            console.log('Account Page', accountsPage);
            console.log('Account Page', accountsPage.pagination);
            nexPageAccounUri = accountsPage.pagination.next_uri;
            return accountsPage;

        }






        try {
            const data = await fetchAccount('/v2/accounts');
            accounts = accounts.concat(data.data);
        } catch (error) {
            console.log('error catched :', error);
        }

        while (nexPageAccounUri !== null) {
            const dataNextPage = await fetchAccount(nexPageAccounUri);
            accounts = accounts.concat(dataNextPage.data);
        }
        // Lenght of allAccounts
        console.log('Nbr de tokens', accounts.length);
        // console.log('accounts', accounts);
        // let tokenList = [];

        localStorage.setItem('accounts-coinbase', JSON.stringify(accounts));
        return accounts;
    }

    const fetchAllTransactions = async (accounts) => {



        async function fetchAllTransac(path) {

            let nexPageTrxUri = null;

            async function fetchTransac(path) {

                const data = {
                    email: userData.email,
                    exchange: 'coinbase',
                    path: path
                };

                const response = await fetch('http://' + config.urlServer + '/coinbase/transactions', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': userData.token
                    },
                    body: JSON.stringify(data)
                })

                if (!response.ok) {
                    const message = `An error has occured: ${response.status}`;
                    throw new Error(message);
                }
                const trxPage = await response.json();
                if (trxPage.data.length > 0) {
                    toast('New Transaction find for ' + trxPage.data[0].amount.currency);
                    console.log('trx data', trxPage.data);
                    console.log('trx Page', trxPage.pagination);
                }
                nexPageTrxUri = trxPage.pagination.next_uri;
                return trxPage;
            }

            let accountTransactions = [];

            // let path = '/v2/accounts/' + accountId + "/transactions";
            const data = await fetchTransac(path);
            accountTransactions = accountTransactions.concat(data.data);

            if (nexPageTrxUri !== null) {
                console.log('There is a next page');
            }
            while (nexPageTrxUri !== null) {
                const dataNextPage = await fetchTransac(nexPageTrxUri);
                accountTransactions = accountTransactions.concat(dataNextPage.data);
            }
            return accountTransactions;
        }


        let transactions = [];

        // Boucle sur toules account 
        let index = 0;

        while (index < accounts.length) {

            // console.log(accounts[index]);
            let account = accounts[index];
            try {
                let path = '/v2/accounts/' + account.id + "/transactions";
                const data = await fetchAllTransac(path);
                transactions = [...transactions, ...data]

            } catch (error) {
                console.log('error catched :', error);
            }
            index++;
        }

        return transactions;
    }

    const proccesTransactionCoinbase = async () => {

        const accountSaved = JSON.parse(localStorage.getItem('accounts-coinbase'));
        let accounts = []
        if (accountSaved && accountSaved.length > 0) {
            console.log(' get account saved LS')
            accounts = accountSaved;
        } else {
            accounts = await fetchAllAccount();
        }

        // recupere la liste des account ( wallet + fault );
        const trxSaved = JSON.parse(localStorage.getItem('transactions'));
        // const trxSaved = false;
        let transactions = null;
        if (trxSaved && trxSaved.length > 0) {
            transactions = trxSaved;
        } else {
            transactions = await fetchAllTransactions(accounts)
        }
        console.log('Final trx : ', transactions);
        if (transactions.length > 0) {

            await postProcess(transactions, "coinbase");
        }

        // Test 
        let lastTrx = getLastestTransactions(trxSaved, 'coinbase');
        console.log('last TRX', lastTrx)

        // 
        // Boucle sur les accounts activé avec la derbiere trx

        // let index = 0;
        // while (index < lastTrx.length) {



        //     index++;
        // }


    }

    const deleteLastTrx = () => {
        const trxSaved = JSON.parse(localStorage.getItem('transactions'));

        let idTrxToDelete = '';




    }



    const style = {
        marginLeft: '10px'
    }

    React.useEffect(() => {

        if (!AuthenticationService.isAuthenticated) {
            navigate("/login");
        }

        // proccesTransactionCoinbase();

        // completeProccesTransactionCoinbase(false, false);
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
                <Button sx={style} variant="outlined" onClick={proccesTransactionCoinbase} >
                    Quick Update
                </Button>
                <Button sx={style} variant="outlined" onClick={fullUpdateCurrentAccountTrx} >
                    Full Update
                </Button>
                <Button sx={style} variant="outlined" onClick={findNewAccount} >
                    Find new account
                </Button>

                <Button variant="outlined" onClick={deleteLastTrx} >
                    Delete  Last transactions
                </Button>
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
                            <DataGrid components={{ Toolbar: GridToolbar }} initialState={{
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