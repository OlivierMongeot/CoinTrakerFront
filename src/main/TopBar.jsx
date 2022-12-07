import React from 'react';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Tooltip } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AuthenticationService from '../helpers/AuthService';
import { Link } from 'react-router-dom';
// import Profile from './Profile';
// import { ColorModeContext } from '../Theme';

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

  console.log('props Topbar', props);
  return (
    // <ColorModeContext.Consumer>
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
        {!AuthenticationService.isAuthenticated && (
          <Stack spacing={2} direction="row">

            <Button variant="contained">
              <Link style={{ color: 'inherit', textDecoration: 'inherit' }} to='/login'>Log-in</Link>
            </Button>
            <Button variant="outlined" >
              <Link style={{ color: 'inherit', textDecoration: 'inherit' }} to='/registration'>Sign-up</Link>
            </Button>
          </Stack>
        )}

        <Tooltip title={'Toogle to ' + ((theme.palette.mode === 'dark') ? 'light' : 'dark') + ' mode'}>

          <IconButton sx={{ ml: 1 }} onClick={props.colorMode.togleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        <IconButton color="inherit">
          <Badge badgeContent={2} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>

      </Toolbar>
    </AppBar >
    // </ColorModeContext.Consumer>
  )



}