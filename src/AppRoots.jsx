import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import SideMenu from './layout/SideMenu';
import TopBar from './layout/TopBar';
import WalletsBoard from './pages/WalletsBoard';
import Home from './pages/Home';
import Login from './pages/Login';
import Customize from './pages/Customize';
// import SignUp from '../Trash/SignUp';
import Registration from './pages/Registration';
import Account from './pages/Account';
import Exchanges from './pages/Exchanges';
import Withdraws from './pages/Withdraws';


export default function AppRoots(props) {

  const [open, setOpen] = React.useState(true);
  const page = props.page.page;

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (

    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar open={open} toggleDrawer={toggleDrawer}
      />
      <SideMenu open={open} toggleDrawer={toggleDrawer} />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <div className="space-line"></div>

        {page === 'wallets' && (<WalletsBoard></WalletsBoard>)}
        {page === 'home' && (<Home></Home>)}
        {page === 'login' && (<Login sx={{ height: '40vh' }}></Login>)}
        {page === 'registration' && (<Registration></Registration>)}
        {page === 'customize' && (<Customize></Customize>)}
        {page === 'account' && <Account></Account>}
        {page === 'exchanges' && <Exchanges></Exchanges>}
        {page === 'withdraws' && <Withdraws></Withdraws>}

      </Box >
    </Box >
  )
}