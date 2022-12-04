import axios from 'axios';

const getIdsCMC = async () => {

    // console.log(localStorage.getItem('cmcTokensList'));
    if (localStorage.getItem('cmcTokensList') == null) {
        console.log('get CMCData all-tokens from api');
        const response = await axios.get('http://192.168.0.46:4000/cmc/all-tokens');
        // let exchange = "http://192.168.0.46:4000/" + ex + "/wallet";
        // save in LocalStorage
        console.log("response CMC DATA ", response)
        response.data.push({
            "id": 0,
            "name": "Ethereum 2",
            "symbol": "ETH2",
            "slug": "eth2"
        });

        localStorage.setItem('cmcTokensList', JSON.stringify(response.data));
        return response.data;
    } else {
        // console.log('getTokenList From Store');
        return JSON.parse(localStorage.getItem('cmcTokensList'));
    }
}


export default getIdsCMC;