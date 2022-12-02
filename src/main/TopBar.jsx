import React from 'react';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
// import { useTheme } from '@mui/material/styles';
// // import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Tooltip } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SignUp from '../components/SignUp';
// import SignIn from '../components/SignIn';
// import { useHistory } from 'react-router-dom';

import { Link } from 'react-router-dom';
const drawerWidth = 250;



const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));



export default function TopBar(props) {

  const theme = useTheme();

  const [openSignUp, setOpenSignUp] = React.useState(false);
  const handleOpenSignUp = () => setOpenSignUp(true);
  const handleCloseSignUp = () => setOpenSignUp(false);

  // const [openSignIn, setOpenSignIn] = React.useState(false);
  // const handleOpenSignIn = () => setOpenSignIn(true);
  // const handleCloseSignIn = () => setOpenSignIn(false);



  const style = {
    position: 'absolute',
    padding: '20px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    height: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
  };


  return (
    <AppBar position="absolute" open={props.open} >
      <Toolbar
        sx={{
          pr: '240px', // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={props.toggleDrawer}
          sx={{
            marginRight: '36px',
            ...(props.open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          CRYPTO WALLETS
        </Typography>

        <Stack spacing={2} direction="row">


          <Button variant="contained">
            <Link style={{ color: 'inherit', textDecoration: 'inherit' }} to='/login'>Log-in</Link>
          </Button>

          <Button variant="outlined" >
            <Link style={{ color: 'inherit', textDecoration: 'inherit' }} to='/registration'>Sign-up</Link>
          </Button>

        </Stack>

        {/* <ColorModeContext.Consumer> */}
        <Tooltip title={'Toogle to ' + ((theme.palette.mode === 'dark') ? 'light' : 'dark') + ' mode'}>
          <IconButton sx={{ ml: 1 }} onClick={props.colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
        {/* </ColorModeContext.Consumer> */}


        <IconButton color="inherit">
          <Badge badgeContent={2} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>


      </Toolbar>
    </AppBar >

  )



}