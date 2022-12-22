import React from 'react';
import AuthenticationService from '../helpers/AuthService';
import { useNavigate } from "react-router-dom";
import config from '../config';
import DateFormater from '../helpers/DateFormater';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import AmountFormater from '../helpers/AmountFormater';
import TokenFormater from '../helpers/TokenFormater';
import BadgeFormater from '../helpers/BadgeFormater';
import getIdsCMC from '../api/getIdsCMC';
import TransactionFormater from '../helpers/TransactionFormater';

import NativeAmountormater from '../helpers/NativeAmountormater';

const Transactions = () => {

    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    const [transactions, setTransactions] = React.useState([]);

    let exchange = 'coinbase';

    const columns: GridColDef[] = [
        {
            field: 'currency', headerName: 'Token', width:
                160, align: 'center', headerAlign: 'center', hide: true,
            renderCell: (params) => <TokenFormater value={params.value} />
        },

        {
            field: 'entry', headerName: 'Entrée(+)',
            minWidth: 200, align: 'right', headerAlign: 'center',
            renderCell: (params) => <BadgeFormater value={params.value} type='cashin' />

        },
        {
            field: 'transaction', headerName: 'Type', width:
                100, align: 'center', headerAlign: 'center',
            renderCell: (params) => <TransactionFormater value={params.value} />

        },
        {
            field: 'exit', headerName: 'Sortie(-)', minWidth: 180, align: 'right', headerAlign: 'center',
            renderCell: (params) => <BadgeFormater value={params.value} type='cashout' />
        },
        // {
        //     field: 'amount', headerName: 'Amount', minWidth: 140, align: 'right', headerAlign: 'center',
        //     renderCell: (params) => <AmountFormater value={params.value} />
        // },



        {
            field: 'updated_at', headerName: 'Date', width: 260, align: 'center',
            headerAlign: 'center', renderCell: (params) => <DateFormater value={params.value} />
        },

        {
            field: 'title', headerName: 'Description', minWidth: 450, align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'native_balance', headerName: 'Native Amount', width: 120, align: 'right',
            headerAlign: 'center',
            renderCell: (params) => <NativeAmountormater value={params.value} />
        },
        // {
        //     field: 'description', headerName: 'Short', minWidth: 140, align: 'right', headerAlign: 'center'
        // },
        {
            field: 'smartType', headerName: 'Status', width: 130, align: 'center', headerAlign: 'center'
        },


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



        let ip = 'localhost:4000'; //todo 
        const cmcTokensList = await getIdsCMC(ip);


        for (let i = 0; i < data.length; i++) {

            cmcTokensList.filter(token => {

                if (token.symbol.toLowerCase() === data[i].currency.toLowerCase()) {
                    data[i].urlLogo = seturlLogo(token.symbol, token.id);
                }
                if (data[i].currency.toLowerCase() === 'eur') {
                    data[i].urlLogo = seturlLogo(data[i].currency, 0);
                }


                return token.symbol.toLowerCase() === data[i].currency.toLowerCase();

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


    React.useEffect(() => {

        if (!AuthenticationService.isAuthenticated) {
            navigate("/login");
        }

        const data = {
            email: userData.email,
            exchange: exchange
        };
        // console.log(userData)

        const savedTransactions = JSON.parse(localStorage.getItem('transactions'));

        console.log('LocalStore transac : ', savedTransactions);
        if (savedTransactions) {

            const lastId = savedTransactions[0].id;
            console.log('lastID', lastId);
            data.lastIDtransaction = lastId;

            // make ckeck if new transaction 



            // savedTransactions.forEach(element => {
            //     //     //     // console.log(element)
            //     //     //     // element.smartType = getSmartType(element.type, element.amount);
            //     //     //     if (element.details.subtitle !== null) {
            //     //     //         element.title = element.details.title + ' ' + (element.details.subtitle).toLowerCase();
            //     //     //     } else {
            //     //     //         element.title = element.details.title;
            //     //     //     }
            //     // element.smartType = getSmartType(element.type, element.amount);
            //     //     element.native_balance = element.native_amount.amount;
            //     if (parseFloat(element.amount) > 0) {

            //         element.entry = {
            //             amount: element.amount,
            //             currency: element.currency,
            //             urlLogo: element.urlLogo
            //         }
            //         element.exit = {
            //             amount: element.native_amount.amount,
            //             currency: element.native_amount.currency,
            //             urlLogo: 'http://localhost:4000/images/usd.svg'
            //         }
            //         element.transaction = 'echange'
            //     } else {
            //         element.entry = {
            //             amount: -element.native_amount.amount,
            //             currency: element.native_amount.currency,
            //             urlLogo: 'http://localhost:4000/images/usd.svg'
            //         }
            //         element.exit = {
            //             amount: -element.amount,
            //             currency: element.currency,
            //             urlLogo: element.urlLogo
            //         }
            //         element.transaction = 'echange'
            //     }
            //     if ((
            //         element.description && (element.description).includes('Earn'))
            //         || (element.details.subtitle && (element.details.subtitle).includes('Earn'))
            //         || (element.details.subtitle && (element.details.subtitle).includes('De Coinbase'))
            //         || (element.type === "fiat_deposit")
            //         || (element.type === "interest")
            //         || (element.type === 'reward')
            //         || (element.type === 'inflation_reward')

            //     ) {
            //         // console.log(element.details.subtitle);
            //         element.exit = {
            //             amount: 0,
            //             currency: ''
            //         }
            //         element.transaction = 'deposit'
            //     }

            //     if (element.type === 'send' && parseFloat(element.amount) < 0) {
            //         element.entry = {
            //             amount: 0,
            //             currency: ''
            //         }
            //         element.transaction = 'withdraw'
            //     } else if (element.type === 'send') {
            //         element.transaction = 'deposit'
            //         element.exit = {
            //             amount: 0,
            //             currency: ''
            //         }
            //     }

            //     if (element.type === "vault_withdrawal" || element.type === "transfer") {
            //         if (parseFloat(element.amount) < 0) {
            //             // Retrait sur le wallet extern
            //             element.entry = {
            //                 amount: 0,
            //                 currency: ''
            //             }
            //             element.transaction = 'withdraw'

            //         } else {
            //             // depot du wallet externe 
            //             element.exit = {
            //                 amount: 0,
            //                 currency: ''
            //             }
            //             element.transaction = 'deposit'
            //         }



            //     }



            //     // element.test = { currency: element.currency, amount: element.amount };
            // })


            // addUrlImage(savedTransactions).then(result => {
            //     console.log(result)
            //     setTransactions(result);
            //     localStorage.setItem('transactions', JSON.stringify(result));

            // })



            // localStorage.setItem('transactions', JSON.stringify(savedTransactions));
            setTransactions(savedTransactions);
        } else {
            fetch('http://' + config.urlServer + '/coinbase/tokens-transactions', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userData.token
                },
                body: JSON.stringify(data)
            }).then(res => res.json())
                .then(data => {
                    console.log('response ', data);




                    // rebuild data for table datagrid
                    data.forEach(element => {
                        element.currency = element.amount.currency;
                        element.amount = element.amount.amount;
                        if (element.details.subtitle !== null) {
                            element.title = element.details.title + ' ' + element.details.subtitle;
                        } else {
                            element.title = element.details.title;
                        }
                        if (element.details.header !== null) {
                            element.title = element.title + '(' + element.details.header + ')';
                        }
                        element.native_balance = element.native_amount.amount;
                        element.native_currency = element.native_amount.currency;

                        element.smartType = getSmartType(element.details.type, element.details.amount);



                        // element.smartType = getSmartType(element.type, element.amount);
                        //     element.native_balance = element.native_amount.amount;
                        if (parseFloat(element.amount) > 0) {

                            element.entry = {
                                amount: element.amount,
                                currency: element.currency,
                                urlLogo: element.urlLogo
                            }
                            element.exit = {
                                amount: element.native_amount.amount,
                                currency: element.native_amount.currency,
                                urlLogo: 'http://localhost:4000/images/usd.svg'
                            }
                            element.transaction = 'echange'
                        } else {
                            element.entry = {
                                amount: -element.native_amount.amount,
                                currency: element.native_amount.currency,
                                urlLogo: 'http://localhost:4000/images/usd.svg'
                            }
                            element.exit = {
                                amount: -element.amount,
                                currency: element.currency,
                                urlLogo: element.urlLogo
                            }
                            element.transaction = 'echange'
                        }
                        if ((
                            element.description && (element.description).includes('Earn'))
                            || (element.details.subtitle && (element.details.subtitle).includes('Earn'))
                            || (element.details.subtitle && (element.details.subtitle).includes('De Coinbase'))
                            || (element.type === "fiat_deposit")
                            || (element.type === "interest")
                            || (element.type === 'reward')
                            || (element.type === 'inflation_reward')

                        ) {
                            // console.log(element.details.subtitle);
                            element.exit = {
                                amount: 0,
                                currency: ''
                            }
                            element.transaction = 'deposit'
                        }

                        if (element.type === 'send' && parseFloat(element.amount) < 0) {
                            element.entry = {
                                amount: 0,
                                currency: ''
                            }
                            element.transaction = 'withdraw'
                        } else if (element.type === 'send') {
                            element.transaction = 'deposit'
                            element.exit = {
                                amount: 0,
                                currency: ''
                            }
                        }

                        if (element.type === "vault_withdrawal" || element.type === "transfer") {
                            if (parseFloat(element.amount) < 0) {
                                // Retrait sur le wallet extern
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

                    // Add link image 
                    // recuperes un tableau de toutes les curencies 
                    addUrlImage(data).then(result => {
                        console.log(result)









                        setTransactions(result);
                        localStorage.setItem('transactions', JSON.stringify(result));

                    })





                })
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="app-container">
            <Grid item xs={12} md={8} lg={9}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '90vh',
                        marginTop: 3
                    }}
                >
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
        </div>
    );
};

export default Transactions;