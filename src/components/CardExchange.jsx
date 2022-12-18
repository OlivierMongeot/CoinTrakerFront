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
// import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import axios from 'axios';
// import ButtonUnstyled, { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
// import { styled } from '@mui/system';
// import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import AuthenticationService from '../helpers/AuthService';

const CardExchange = (props) => {
  // console.log('props', props);
  const navigate = useNavigate();

  const exchangeData = props.exchange;
  // console.log(exchangeData);

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
  const [passPhrase, setPassPhrase] = React.useState('');
  const [showToken, setShowToken] = React.useState(false);


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

        console.log('Result DB request ', res);
        if (res.data === '') {
          // no api key : exchange not synchronised
          console.log('no api key : exchange not synchronised')
          return;
        }
        setApiSecret(res.data.apiSecret);
        setApiKey(res.data.apiKey);
        setPassPhrase(res.data.passPhrase);
      }
      )
      .catch(err => {
        console.log(err);
        if (err.response && err.response.request.status === 401) {

          AuthenticationService.isAuthenticated = false;
          navigate("/login");
        }
      }
      );
  }

  const handleShowToken = () => {
    setShowToken(showToken === true ? false : true)
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

  const handleInputPassPhrase = (e) => {
    if (e.target.value) {
      setPassPhrase(e.target.value);
    }
  }



  const saveData = (data) => {

    axios({
      url: config.urlServer + ':' + config.port + '/setapikeys',
      method: 'post',
      headers: {
        authorization: props.userData.token
      },
      data: data
    })
      .then(res => {
        // console.log('Res data save :', res.data);
        if (!res.data) {
          toast.error('Connection fail : API keys are not good')
        } else {
          toast.success('Connection API is OK', {
            position: "bottom-right"
          })
          handleClose();
          setShowToken(false);
        }
        // console.log('data save', res);

      }
      )
      .catch(err => {
        if (err.response) {
          toast.error('Error : ' + err.response.data.error, {
            position: "bottom-right"
          })
        }

        console.log('saveData error : ', err);
      }
      );
  }

  const submitApiKeys = (event) => {
    // console.log('submit : ');
    // console.log(apiKey, apiSecret, exchangeData.name);
    // Send Data to server
    const data = {
      apiKey: apiKey, apiSecret: apiSecret, name: exchangeData.name, email: props.userData.email, passPhrase: passPhrase
    }
    saveData(data)
  }


  React.useEffect(() => {

    // Chek if exchange is enable
    const exchangesEnable = props.userData.exchangesActive;


    if (exchangesEnable.includes(exchangeData.name)) {
      console.log('is enable: ', exchangeData.name)
      setEnable(true)
    }
    else {
      console.log('is disable: ', exchangeData.name)
      setEnable(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (

    <Box>
      <ToastContainer />
      <Card sx={{ width: 300, m: 1 }}>
        <CardMedia
          component="img"
          alt="exchange"
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
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }} >
            <Typography component={'span'} id="modal-modal-title" variant="h6" >
              Setup API keys {(exchangeData.name).toUpperCase()}
            </Typography>
            <FormGroup>
              {showToken && (
                <FormControlLabel
                  control={<VisibilityIcon onClick={handleShowToken} />}
                />
              )}
              {!showToken && (
                <FormControlLabel
                  control={<VisibilityOffIcon onClick={handleShowToken} />}
                />
              )}
            </FormGroup>
          </div>

          <Typography component={'span'} id="modal-modal-description" sx={{ mt: 1 }}>

            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {showToken && (
                    <TextField
                      name="apiKey"
                      // disabled
                      fullWidth
                      id="apiKey"
                      label="Api Key"
                      // autoFocus
                      // defaultValue=''
                      value={apiKey}
                      onChange={handleInputApiKey}
                    />)}
                  {!showToken && (
                    <TextField
                      name="apiKey"
                      // disabled
                      fullWidth
                      id="apiKey"
                      label="Api Key"
                      // autoFocus
                      // defaultValue=''
                      value={apiKey}
                      onChange={handleInputApiKey}
                      type="password"
                    />)}

                </Grid>
                <Grid item xs={12} sm={6}>
                  {showToken && (
                    <TextField
                      // required
                      fullWidth
                      id="apiSecret"
                      label="Api Secret"
                      name="apiSecret"
                      // defaultValue=''
                      value={apiSecret}
                      onChange={handleInputApiSecret}
                    />
                  )}
                  {!showToken && (
                    <TextField
                      // required
                      fullWidth
                      id="apiSecret"
                      label="Api Secret"
                      name="apiSecret"
                      // defaultValue=''
                      value={apiSecret}
                      onChange={handleInputApiSecret}
                      type="password"
                    />
                  )}

                </Grid>
                {exchangeData.data.passPhrase && (
                  <Grid item xs={12} sm={6}>
                    {showToken && (
                      <TextField
                        // required
                        fullWidth
                        id="passPhrase"
                        label="Pass Phrase"
                        name="passPhrase"
                        // defaultValue=''
                        value={passPhrase}
                        onChange={handleInputPassPhrase}
                      />
                    )}
                    {!showToken && (
                      <TextField
                        // required
                        fullWidth
                        id="passPhrase"
                        label="Pass Phrase"
                        name="passPhrase"
                        // defaultValue=''
                        value={passPhrase}
                        onChange={handleInputPassPhrase}
                        type="password"
                      />
                    )}
                  </Grid>
                )}


              </Grid>
              <Grid sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Button sx={{ mt: 2 }}
                  onClick={submitApiKeys} >
                  Valider
                </Button>
              </Grid>
            </Box>
          </Typography>
        </Box>
      </Modal >
    </Box >
  )
}

export default CardExchange;