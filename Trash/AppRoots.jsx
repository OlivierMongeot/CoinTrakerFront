import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
// import SideMenu from './layout/SideMenu';
// import TopBar from './layout/TopBar';
import WalletsBoard from '../src/pages/WalletsBoard';
import Home from '../src/pages/Home';
import Login from '../src/pages/Login';
import Customize from '../src/pages/Customize';
// import SignUp from '../Trash/SignUp';
import Registration from '../src/pages/Registration';
import Account from '../src/pages/Account';
import Exchanges from '../src/pages/Exchanges';
import Withdraws from '../src/pages/Withdraws';
import Transactions from '../src/pages/Transactions'
// import TopAndSideMenu from './layout/TopAndSideMenu';

export default function AppRoots(props) {

  const page = props.page.page;


  return (
    <React.Fragment>


      {/* <Box sx={{ display: 'flex' }}> */}

      {/* <TopAndSideMenu />
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
      > */}

      <div className="space-line"></div>

      {/* {page === 'wallets' && (<WalletsBoard></WalletsBoard>)}
      {page === 'home' && (<Home></Home>)}
      {page === 'login' && (<Login sx={{ height: '40vh' }}></Login>)}
      {page === 'registration' && (<Registration></Registration>)}
      {page === 'customize' && (<Customize></Customize>)}
      {page === 'account' && <Account></Account>}
      {page === 'exchanges' && <Exchanges></Exchanges>}
      {page === 'withdraws' && <Withdraws></Withdraws>}
      {page === 'transactions' && <Transactions></Transactions>} */}

      {/* </Box > */}
      {/* </Box > */}
    </React.Fragment>
  )
}