import React from 'react';
// import { useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
import SideMenu from './main/SideMenu';
import TopBar from './main/TopBar';
// import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
// import Chart from './Dashboard/Chart';
// import Deposits from './Dashboard/Deposits';
import Wallets from './pages/Wallets';
import Home from './pages/Home';
import Login from './pages/Login';
// import Registration from './pages/Registration';
import SignUp from './components/SignUp';


export default function AppRoots(props) {

  let localStorageWalletsAmmount = JSON.parse(localStorage.getItem('wallets-amount'));
  let localStorageWalletsTotal = JSON.parse(localStorage.getItem('wallets-total'));
  const [open, setOpen] = React.useState(true);
  const [totalAllWallet, setTotalAllWallet] = React.useState(localStorageWalletsTotal ? localStorageWalletsTotal : 0);
  const [arrayAmountWallets, setArrayAmountWallets] = React.useState(localStorageWalletsAmmount ? localStorageWalletsAmmount : []);
  const page = props.page.area;

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (

    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar open={open} toggleDrawer={toggleDrawer} props={props} colorMode={props.colorMode} />
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

        {page === 'wallets' && (
          <Wallets
            sx={{ height: '40vh' }}
            setTotalAllWallet={setTotalAllWallet}
            arrayAmountWallets={arrayAmountWallets}
            setArrayAmountWallets={setArrayAmountWallets}
            totalAllWallet={totalAllWallet}>
          </Wallets>
        )
        }
        {page === 'home' && (<Home></Home>)}
        {page === 'login' && (<Login sx={{ height: '40vh' }}></Login>)}
        {page === 'registration' && (<SignUp></SignUp>)}
      </Box >
    </Box >
  )
}