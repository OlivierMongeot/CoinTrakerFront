import axios from 'axios';
import getIdsCMC from './getIdsCMC';
import addCoinMarketCapQuote from './getPricesQuoteCMC';
import setupBalanceStorage from '../helpers/setupBalanceStorage';
// import { FlashOnRounded } from '@mui/icons-material';

const timer = 360000;

const rotateSpinner = (exchangeName, parentData) => {
    if (parentData && parentData.find(e => e.exchange === exchangeName)) {
        // if (parentData) {
        const idElement = '#wallet-spinner-' + exchangeName;
        const spinnerElement = document.querySelector(idElement);
        // spinnerElement.classList.add('show');
        if (spinnerElement) {
            spinnerElement.classList.remove('hide');
        }
    }
}

const stopSpinner = (exchangeName, parentData) => {
    if (parentData && parentData.find(e => e.exchange === exchangeName)) {
        const idElement = '#wallet-spinner-' + exchangeName;
        const spinnerElement = document.querySelector(idElement);
        // spinnerElement.classList.remove('show');
        // console.log(spinnerElement);
        if (spinnerElement) {
            spinnerElement.classList.add('hide');
        }
    }
}

const completeDataWallet = async (wallet, exchange) => {



    const totalBalanceWallet = (wallet, exchange) => {
        let totalBalance = 0;
        for (let i = 0; i < wallet.length; i++) {
            let value = parseFloat(wallet[i].balance) * wallet[i].live_price;
            totalBalance += value;
            wallet[i].dollarPrice = value;
        }
        setupBalanceStorage(exchange, totalBalance);
    }



    const seturlLogo = (tokenCode, tokenId) => {
        if (tokenCode === 'ETH2') {
            return "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png";
        } else { return "https://s2.coinmarketcap.com/static/img/coins/64x64/" + tokenId + ".png"; }

    }



    const checkParticularName = (walletElement, token, exchange) => {
        switch (exchange) {
            case 'kucoin':
                if (token.symbol === 'POL') {
                    walletElement.urlLogo = seturlLogo(token.symbol, 6297);
                    walletElement.name = 'Proof of iquidity';
                }
                break;

            case 'gateio':
                if (token.symbol === 'POINT') {
                    walletElement.urlLogo = seturlLogo(token.symbol, 4269);
                    walletElement.name = 'Proof of iquidity';
                }
                break;
            default:
                break;
        }
        return walletElement;
    }


    const addCoinMarketCapIds = async (wallet) => {

        const cmcTokensList = await getIdsCMC();

        for (let i = 0; i < wallet.length; i++) {
            // cherche dans cmcTokensList le token avec le code wallet[i].code pour retrouver le prix live 
            cmcTokensList.filter(token => {

                switch (exchange) {
                    case 'kucoin':
                        if (token.symbol === wallet[i].currency) {

                            wallet[i].idCMC = token.id;
                            wallet[i].urlLogo = seturlLogo(token.symbol, token.id);
                            wallet[i].name = token.name;
                            wallet[i].code = token.symbol;
                            wallet[i].timestamp = new Date().getTime();
                            wallet[i] = checkParticularName(wallet[i], token, exchange);
                            wallet[i].exchange = exchange;

                        }
                        break;

                    case 'gateio':
                        if ((token.symbol).toLowerCase() === (wallet[i].currency).toLowerCase()) {
                            wallet[i].idCMC = token.id;
                            wallet[i].urlLogo = seturlLogo(wallet[i].code, token.id);
                            wallet[i].name = token.name;
                            wallet[i].code = token.symbol;
                            wallet[i].timestamp = new Date().getTime();
                            wallet[i] = checkParticularName(wallet[i], token, exchange);
                            wallet[i].balance = parseFloat(wallet[i].available) + parseFloat(wallet[i].locked);
                            wallet[i].exchange = exchange;
                        }
                        break;

                    case 'coinbase':
                        if (token.symbol === wallet[i].code) {
                            wallet[i].idCMC = token.id;
                            wallet[i].urlLogo = seturlLogo(wallet[i].code, token.id);
                            wallet[i].balance = wallet[i].amount;
                            wallet[i].exchange = exchange;
                        }
                        break;

                    case 'crypto-com':
                        if ((token.symbol).toLowerCase() === (wallet[i].currency).toLowerCase()) {
                            wallet[i].idCMC = token.id;
                            wallet[i].urlLogo = seturlLogo(wallet[i].code, token.id);
                            wallet[i].name = token.name;
                            wallet[i].code = token.symbol;
                            wallet[i].timestamp = new Date().getTime();
                            wallet[i].exchange = exchange;
                        }
                        break;

                    case 'binance':
                        if (token.symbol === wallet[i].currency) {

                            wallet[i].idCMC = token.id;
                            wallet[i].urlLogo = seturlLogo(token.symbol, token.id);
                            wallet[i].name = token.name;
                            wallet[i].code = token.symbol;
                            wallet[i].timestamp = new Date().getTime();
                            wallet[i].exchange = exchange;
                        }
                        break;

                    default:
                        break;
                }

                return token.symbol === wallet[i].currency;
            });
        }
        return wallet.filter(item => item.hasOwnProperty('idCMC'));
    }

    wallet = await addCoinMarketCapIds(wallet);
    wallet = await addCoinMarketCapQuote(wallet, exchange);
    console.log('Wallet after price update', wallet)
    totalBalanceWallet(wallet, exchange);
    return wallet;
}

const apiCall = async (exchange) => {
    console.log('APICALL');
    // axios.get('/foo')
    //     .catch(function (error) {
    //         if (error.response) {
    //             console.log(error.response.data);
    //             console.log(error.response.status);
    //             console.log(error.response.headers);
    //         }
    //     });

    let url = "http://192.168.0.46:4000/" + exchange + "/wallet";
    let user = JSON.parse(localStorage.getItem('user'));
    let jws = user.token;
    console.log('token used for connection', jws);

    let response = await axios.get(url,
        {
            headers: {
                'authorization': jws
            }
        }
    )

    // .then((response) => {

    console.log('api response', response);
    //     if (response.data) {
    //         return response.data;
    //     }


    // }).catch((error) => {
    //     if (error.response) {
    //         // console.log(error.response.data);
    //         console.log(error.response.status);
    //         // return error.response;
    //     }
    // });
    return response.data;
}

const updateWalletsAmount = (parentData, exchange, total, props) => {
    // console.log('updateWalletsAmount with this data : ', parentData, exchange, total)

    let exchangeInArray = false;
    for (let i = 0; i < parentData.length; i++) {
        if (parentData[i].exchange === exchange) {
            parentData[i].amount = total;
            exchangeInArray = true;
        }
    }
    if (exchangeInArray === false) {
        parentData.push({ exchange: exchange, amount: total });
    }
    // if (exchange !== 'all') {
    localStorage.setItem('wallets-amount', JSON.stringify(parentData));
    // }

}

const setAndSaveTotalAllExchanges = (parentData, props) => {
    let acc = 0;
    for (let i = 0; i < parentData.length; i++) {
        let value = parentData[i].amount;
        if (parentData[i].exchange !== 'all') {
            acc += value;
        }
    }
    // console.log('setTotalAllWallet', acc)
    localStorage.setItem('wallets-total', JSON.stringify(acc));
    props.setTotalAllWallet(acc);
}

const shouldIUpdateDataFromAPI = (exchangeName) => {

    // console.log('should call API for ?', exchangeName)
    // console.log(typeof (localStorage.getItem('wallet-' + exchangeName)));
    if ('wallet-' + exchangeName in localStorage && (typeof (localStorage.getItem('wallet-' + exchangeName)) === 'string')) {

        let walletLocalStorage = JSON.parse(localStorage.getItem('wallet-' + exchangeName));
        if (!walletLocalStorage) {
            console.log('Wallet vide Trouvé en local Store');
            return false;
        }
        console.log('Wallet in LocalStorage for ' + exchangeName + ', check timestamp creation');

        if (walletLocalStorage.length > 0) {

            let difference = new Date().getTime() - walletLocalStorage[0].timestamp // timestamp
            if (difference > timer) {

                console.log('Time > 6 min , Update Wallet from API');
                return true;
            } else {
                console.log('Recent Time update, Display Wallet ' + exchangeName + ' from Local Store');
                return false;
            }
        } else {
            console.log('Data: wallet-' + exchangeName + ' est un tableau vide');
            return true;
        }

    } else {
        console.log('Data: wallet-' + exchangeName + ' n\'existe pas');
        return true;
    }


}


const updateProcess = async (exchange) => {

    // console.log('updateProcess', exchange)
    let shoudIUpdate = shouldIUpdateDataFromAPI(exchange);
    if (shoudIUpdate) {
        let rowResult = await apiCall(exchange);
        console.log('row result', rowResult);
        if (rowResult) {
            return await completeDataWallet(rowResult, exchange)
        } else {
            console.log("erreur");
            console.log(rowResult);
            return false;
        }


    } else {
        // console.log("data from LOCAL STORE");
        return JSON.parse(localStorage.getItem('wallet-' + exchange));
    }
}

const totalWallet = (result) => {
    // Calcul le total pour les props
    let arrayTotalExchange = [];
    result.forEach(element => {
        arrayTotalExchange.push(element.balance * element.live_price);
    });

    let total = arrayTotalExchange.reduce((acc, val) => acc + val, 0)
    // console.log('Updated total exchange', total);
    return total;

}

const agregateWallet = (wallet) => {
    ;
    let result = [];
    // console.log('agregateWallet ', wallet);
    wallet.forEach(function (element) {
        if (!this[element.currency]) {
            this[element.currency] = {
                currency: element.currency,
                balance: 0,
                // code: element.code,
                live_price: element.live_price,
                // available: 0,
                urlLogo: element.urlLogo,
                quoteCMC: element.quoteCMC,
                name: element.name,
                idCMC: element.idCMC,
                dollarPrice: element.dollarPrice,
                // id: element.idCMC,
                timestamp: element.timestamp,
                exchanges: element.exchange

            };


            result.push(this[element.currency]);
        }
        this[element.currency].balance += parseFloat(element.balance);
        // this[element.currency].available += parseFloat(element.balance);
    }, Object.create(null));
    return result;
}


const updateWallet = async (exchangetoUp, exchanges, parentData, props, setWallets) => {



    if (exchangetoUp === 'all') {

        let allDataExchanges = [];

        for (let index = 0; index < exchanges.length; index++) {
            let exchange = exchanges[index];
            if (exchange !== 'all') {
                console.log(' Mise à jour de l exchange : ', exchange);
                rotateSpinner(exchange, parentData);
                let result = await updateProcess(exchange);
                if (result) {

                    let total = totalWallet(result);

                    localStorage.setItem('total-' + exchange, JSON.stringify(total));

                    updateWalletsAmount(parentData, exchange, total, props);

                    setAndSaveTotalAllExchanges(parentData, props);

                    localStorage.setItem('wallet-' + exchange, JSON.stringify(result));
                    allDataExchanges = allDataExchanges.concat(result);

                } else {
                    stopSpinner(exchange, parentData);
                    return false;
                }
                stopSpinner(exchange, parentData);
            }
        }

        props.setTotalExchange(JSON.parse(localStorage.getItem('wallets-total')));

        console.log('all Wallet to  Agregate', allDataExchanges)

        let interRes = agregateWallet(allDataExchanges);
        localStorage.setItem('wallet-all', JSON.stringify(interRes));

        return (interRes);

    } else if (exchangetoUp !== 'all') {
        // Process for individual update 
        rotateSpinner(exchangetoUp, parentData);
        let result = await updateProcess(exchangetoUp);
        if (result) {
            let total = totalWallet(result);
            // console.log('props', props);
            props.setTotalExchange(total);
            // Set Total In Local Storage 
            localStorage.setItem('total-' + exchangetoUp, JSON.stringify(total));

            updateWalletsAmount(parentData, exchangetoUp, total, props);

            setAndSaveTotalAllExchanges(parentData, props);

            localStorage.setItem('wallet-' + exchangetoUp, JSON.stringify(result));
            stopSpinner(exchangetoUp, parentData);
            return result;

        } else {
            stopSpinner(exchangetoUp, parentData);
            return false;
        }


    }

}

export default updateWallet;