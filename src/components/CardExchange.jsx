import React from 'react';
import config from '../config';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import ButtonUnstyled, { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import { styled } from '@mui/system';


const CardExchange = (props) => {
  // console.log('props', props);

  const blue = {
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
  };

  const grey = {
    100: '#eaeef2',
    300: '#afb8c1',
    900: '#24292f',
  };

  const CustomButton = styled(ButtonUnstyled)(
    ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-weight: bold;
    font-size: 0.875rem;
    background-color: ${blue[500]};
    padding: 12px 24px;
    margin-top: 15px;
    width: 100%;
    border-radius: 12px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    border: none;
    box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[100]};
  
    &:hover {
      background-color: ${blue[600]};
    }
  
    &.${buttonUnstyledClasses.active} {
      background-color: ${blue[700]};
    }
  
    &.${buttonUnstyledClasses.focusVisible} {
      box-shadow: 0 3px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 5px rgba(0, 127, 255, 0.5);
      outline: none;
    }
  
    &.${buttonUnstyledClasses.disabled} {
      opacity: 0.5;
      cursor: not-allowed;
    }
    `,
  );

  const exchangeData = props.exchange;

  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true)
    onOpenModal();


  }
  const handleClose = () => setOpen(false);

  const [enable, setEnable] = React.useState(false);
  const [apiKey, setApiKey] = React.useState('');
  const [apiSecret, setApiSecret] = React.useState('');

  const onOpenModal = () => {

    axios({
      url: config.urlServer + ':' + config.port + '/apikeys',
      method: 'post',
      headers: {
        authorization: props.userData.token
      },
      data: {
        email: props.userData.email,
        exchange: exchangeData.name
      }
    })
      .then(res => {
        // console.log('Result DB request ', res.data, res.data.apiSecret, res.data.apiKey);
        setApiSecret(res.data.apiSecret);
        setApiKey(res.data.apiKey);
      }
      )
      .catch(err => {
        console.log(err);
      }
      );
  }


  const handleInputApiKey = (e) => {
    if (e.target.value) {
      setApiKey(e.target.value);
    }
  }

  const handleInputApiSecret = (e) => {
    if (e.target.value) {
      setApiSecret(e.target.value);
    }

  }

  const sendData = (data) => {

    axios({
      url: config.urlServer + ':' + config.port + '/setapikeys',
      method: 'post',
      headers: {
        authorization: props.userData.token
      },
      data: data
    })
      .then(res => {
        // console.log(res.data);
        // setApiKey(res.data.apiKey);
        // setApiSecret(res.data.apiSecret);
      }
      )
      .catch(err => {
        console.log(err);
      }
      );
  }

  const submitApiKeys = (event) => {
    console.log('submit');
    console.log(apiKey, apiSecret, exchangeData.name);
    // Send Data to server
    const data = {
      apiKey: apiKey, apiSecret: apiSecret, name: exchangeData.name, email: props.userData.email
    }
    sendData(data)
  }


  React.useEffect(() => {

    // Chek if exchange is enable
    const exchangesEnable = props.userData.exchangesEnable.actived
    // console.log(exchangesEnable);

    if (exchangesEnable.includes(exchangeData.name)) {
      // console.log('is enable: ', exchange.name)
      setEnable(true)
    } else {
      setEnable(false)
    }
  }, []);


  return (
    <Box>
      <Card sx={{ width: 300, m: 1 }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="130"
          image={config.urlServer + ':' + config.port + "/images/" + exchangeData.name + ".png"}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="span">
            {exchangeData.name}
          </Typography>

        </CardContent>
        <CardActions sx={{ m: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {enable && (
            <span style={{ color: 'green' }}><PublishedWithChangesIcon /></span>
          )}
          {!enable && (
            <span ><CloudOffIcon /></span>
          )}

          <Button size="small" onClick={handleOpen}><ManageAccountsIcon /></Button>
        </CardActions>
      </Card>


      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModal}>
          <Typography component={'span'} id="modal-modal-title" variant="h6" component="h2">
            Setup API keys {(exchangeData.name).toUpperCase()}
          </Typography>
          <Typography component={'span'} id="modal-modal-description" sx={{ mt: 1 }}>

            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="apiKey"
                    // disabled
                    // fullWidth
                    id="apiKey"
                    label="Api Key"
                    // autoFocus
                    defaultValue=''
                    value={apiKey}
                    onChange={handleInputApiKey}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    // required
                    // fullWidth
                    id="apiSecret"
                    label="Api Secret"
                    name="apiSecret"
                    defaultValue=''
                    value={apiSecret}
                    onChange={handleInputApiSecret}
                  />
                </Grid>
              </Grid>
              <Button

                onClick={submitApiKeys} >
                Valider
              </Button>
            </Box>

          </Typography>
        </Box>
      </Modal>

    </Box>
  )
}

export default CardExchange;