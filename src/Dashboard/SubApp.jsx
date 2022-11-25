import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SideMenu from './SideMenu';
import TopBar from './TopBar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '../Dashboard/Chart';
import Deposits from '../Dashboard/Deposits';
import Wallets from '../pages/Wallets';


export default function SubApp(props) {

  let localStorageWalletsAmmount = JSON.parse(localStorage.getItem('wallets-amount'));
  let localStorageWalletsTotal = JSON.parse(localStorage.getItem('wallets-total'));
  const [open, setOpen] = React.useState(true);
  const [totalAllWallet, setTotalAllWallet] = React.useState(localStorageWalletsTotal ? localStorageWalletsTotal : 0);
  const [arrayAmountWallets, setArrayAmountWallets] = React.useState(localStorageWalletsAmmount ? localStorageWalletsAmmount : [])
  const [page] = React.useState('wallets');
  // console.log('page ', page);
  // console.log('props ', props);
  localStorage.setItem('theme', JSON.stringify(props.mode));



  const toggleDrawer = () => {
    setOpen(!open);
  };


  const theme = useTheme();
  const colorMode = React.useContext(props.ColorModeContext);

  return (

    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar open={open} toggleDrawer={toggleDrawer} props={props} theme={theme} colorMode={colorMode} />
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
          <Container className="container" maxWidth="xlg" sx={{ mt: 4, mb: 4 }}>

            <Grid container spacing={3}>

              <Grid item xs={12} md={8} lg={8}>
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
              </Grid>

              <Grid item xs={12} md={4} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 200,
                  }}>

                  <Deposits totalAllWallet={totalAllWallet} arrayAmountWallets={arrayAmountWallets} />


                </Paper>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Paper
                  sx={{
                    height: 'auto',
                  }}>

                  <Wallets
                    sx={{ height: '100%' }}
                    setTotalAllWallet={setTotalAllWallet}
                    arrayAmountWallets={arrayAmountWallets}
                    setArrayAmountWallets={setArrayAmountWallets} >
                  </Wallets>
                </Paper>
              </Grid >
            </Grid >

          </Container>
        )}

        {page === 'home' && (
          <Container className="container" maxWidth="xlg" sx={{ mt: 4, mb: 4 }}>

            <Grid container spacing={2}>

              <Grid item xs={12} md={8} lg={9}>
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
              </Grid>

              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 200,
                  }}>
                  <Deposits totalAllWallet={totalAllWallet} arrayAmountWallets={arrayAmountWallets} />
                </Paper>
              </Grid>
            </Grid >

          </Container>
        )}


        {/* <Copyright sx={{ pt: 4 }} /> */}
      </Box>
    </Box >
  )
}