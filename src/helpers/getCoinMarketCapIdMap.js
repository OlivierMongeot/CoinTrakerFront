import axios from 'axios';

const getCMCIdMap = async () => {

    // console.log(localStorage.getItem('cmcTokensList'));
    if (localStorage.getItem('cmcTokensList') == null) {
        console.log('get CMCData all-tokens');
        const response = await axios.get('/cmc/all-tokens');

        // save in LocalStorage
        localStorage.setItem('cmcTokensList', JSON.stringify(response.data));
        return response.data;
    } else {
        return JSON.parse(localStorage.getItem('cmcTokensList'));
    }
}


export default getCMCIdMap;