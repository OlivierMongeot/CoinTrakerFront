import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Wallets from '../pages/Wallets';
// import Copyright from './Copyright';
import SideMenu from './SideMenu';
import TopBar from './TopBar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '../Dashboard/Chart';
// import Deposits from '../Dashboard/Deposits';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

const mdTheme = createTheme();

function DashboardContent(props) {

  const [open, setOpen] = React.useState(true);


  const toggleDrawer = () => {
    setOpen(!open);
  };


  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <TopBar open={open} toggleDrawer={toggleDrawer} />
        {/* Barre Latérale  */}
        <SideMenu open={open} toggleDrawer={toggleDrawer} />

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? theme.palette.grey[100]
                : theme.palette.grey[500],
            flexGrow: 1,
            height: '150vh',
            overflow: 'auto',
          }}
        >
          <div className="space-line"></div>

          <Container className="container" maxWidth="xlg" sx={{ mt: 4, mb: 4 }}>

            <Grid container spacing={3}>

              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
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
                    height: 240,
                  }}
                >
                  {/* <Deposits totalExchangeSelected={totalExchangeSelected} /> */}

                  <React.Fragment>
                    <Title>Recent Deposits</Title>
                    <Typography component="p" variant="h4">
                      ${12235}
                    </Typography>
                    <Typography color="text.secondary" sx={{ flex: 1 }}>
                      on 15 March, 2019
                    </Typography>
                    <div>
                      <Link color="primary" href="#" >
                        View details balance
                      </Link>
                    </div>
                  </React.Fragment>


                </Paper>
              </Grid>
              <Wallets />
            </Grid >

          </Container>


          {/* <Copyright sx={{ pt: 4 }} /> */}
        </Box>
      </Box>
    </ThemeProvider >
  );
}


export default function Dashboard() {
  return <DashboardContent />;
}

