import * as React from 'react';
// import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const Formater = (props) => {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  // console.log(props)
  if (props.value) {

    let feeCurrency = null

    // if (props.value.transaction === 'withdrawals') {
    //   feeCurrency = props.value.feeCurrency

    // } else if (props.value.transaction === 'deposits') {
    feeCurrency = props.value.feeCurrency
    // } else {
    //   feeCurrency = props.value.chain
    // }


    return (
      // <Tooltip title={props.value}>
      <React.Fragment>
        <InfoIcon onClick={handleOpen}>
        </InfoIcon>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"

        >
          <Box sx={style}>
            {props.value?.type && (
              <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ textAlign: 'center', mb: 5 }}>
                {props.value?.type.toUpperCase()}
              </Typography>
            )}
            {props.value?.idTx && (
              <Typography noWrap id="modal-modal-description" variant="h6" component="h2" sx={{ mt: 2, fontSize: '0.9rem' }}>
                ID : {props.value.idTx}
              </Typography>
            )}
            {props.value?.side && (
              <Typography id="modal-modal-description" variant="h6" component="h2" sx={{ mt: 2, fontSize: '0.9rem' }}>
                Side : {props.value.side.toUpperCase()}
              </Typography>
            )}
            {props.value?.typeTrade && (
              <Typography id="modal-modal-description" variant="h6" component="h2" sx={{ mt: 2, fontSize: '0.9rem' }}>
                Type : {props.value.typeTrade.toUpperCase()}
              </Typography>
            )}
            {props.value?.blockchain && (
              <Typography id="modal-modal-description" variant="h6" component="h2" sx={{ mt: 2, fontSize: '0.9rem' }}>
                BlockChain : {props.value.blockchain.toUpperCase()}
              </Typography>
            )}
            {props.value?.address && (
              <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: '0.9rem' }}>
                Address : {props.value.address}
              </Typography>
            )}
            {props.value?.details?.title && (
              <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: '0.9rem' }}>
                Details : {props.value.details.title} {
                  props.value.details?.subtitle ?
                    props.value.details.subtitle.toLowerCase() :
                    ''

                }  {
                  props.value.details?.header ?
                    '"' + props.value.details?.header + '"'
                    : ''
                }
              </Typography>
            )}



            {props.value?.fee && parseFloat(props.value.fee) > 0 && (
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Fee : {props.value.fee} {feeCurrency}
              </Typography>
            )}
            {/* 
            {props.value?.gtFee && parseFloat(props.value.gtFee) > 0 && (
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Fee : {props.value.gtFee} GT}
              </Typography>
            )} */}

            {props.value?.memo && (
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Memo : {props.value.memo.replaceAll('_', ' ')}
              </Typography>
            )}
            {props.value?.status && (
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Status : {props.value.status}
              </Typography>
            )}

            {props.value?.dollarPrice && (
              <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: '0.9rem' }}>
                1 {props.value.native_currency}  = {props.value.dollarPrice} $
              </Typography>
            )}
            {props.value?.euroPrice && (
              <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: '0.9rem' }}>
                1 {props.value.native_currency}  = {props.value.euroPrice} €
              </Typography>
            )}
            {props.value?.usdtPrice && (
              <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: '0.9rem' }}>
                1 {props.value?.currency} = {props.value.usdtPrice} $
              </Typography>
            )}

          </Box>
        </Modal>
      </React.Fragment>


      // </Tooltip>
    )
  }
};

export default Formater;