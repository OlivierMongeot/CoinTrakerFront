import React from 'react';
// import { useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SideMenu from './main/SideMenu';
import TopBar from './main/TopBar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from './Dashboard/Chart';
import Deposits from './Dashboard/Deposits';
import Wallets from './pages/Wallets';
import Home from './pages/Home';


export default function AppRoots(props) {

  let localStorageWalletsAmmount = JSON.parse(localStorage.getItem('wallets-amount'));
  let localStorageWalletsTotal = JSON.parse(localStorage.getItem('wallets-total'));
  const [open, setOpen] = React.useState(true);
  const [totalAllWallet, setTotalAllWallet] = React.useState(localStorageWalletsTotal ? localStorageWalletsTotal : 0);
  const [arrayAmountWallets, setArrayAmountWallets] = React.useState(localStorageWalletsAmmount ? localStorageWalletsAmmount : [])
  // const [page] = React.useState('wallets');
  const page = props.page.area;
  // console.log('page ', page);
  // console.log('page ', page);
  // console.log('props ', props);
  // localStorage.setItem('theme', JSON.stringify(props.mode));


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
          <Container className="container" maxWidth="xlg"
            sx={{ mt: 4, mb: 4 }}>

            <Grid container spacing={2} columns={12}>

              <Grid item xs={12} md={10} lg={8}>
                <Paper>



                  <Wallets
                    sx={{ height: '40vh' }}
                    setTotalAllWallet={setTotalAllWallet}
                    arrayAmountWallets={arrayAmountWallets}
                    setArrayAmountWallets={setArrayAmountWallets} >
                  </Wallets>



                </Paper>
              </Grid >

              <Grid item xs={12} md={2} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 200,
                  }}
                >
                  <Chart />
                </Paper>


                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 200,
                    marginTop: 2
                  }}>
                  <Deposits totalAllWallet={totalAllWallet} arrayAmountWallets={arrayAmountWallets} />
                </Paper>
              </Grid>

            </Grid >
          </Container>
        )}

        {page === 'home' && (
          <Home></Home>

        )}


        {/* <Copyright sx={{ pt: 4 }} /> */}
      </Box>
    </Box >
  )
}