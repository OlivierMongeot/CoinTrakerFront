import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
// import Wallets from '../pages/Wallets';
import Copyright from './Copyright';
import SideMenu from './SideMenu';
import TopBar from './TopBar';

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
          <Toolbar />
          <Container maxWidth="xlg" sx={{ mt: 4, mb: 4 }}>

            {/* <Wallets /> */}
          </Container>


          <Copyright sx={{ pt: 4 }} />
        </Box>
      </Box>
    </ThemeProvider >
  );
}


export default function Dashboard() {
  return <DashboardContent />;
}

