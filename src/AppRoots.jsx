import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import SideMenu from './main/SideMenu';
import TopBar from './main/TopBar';
import WalletsBoard from './pages/WalletsBoard';
import Home from './pages/Home';
import Login from './pages/Login';
import Customize from './pages/Customize';
import SignUp from './components/SignUp';
// import Brightness4Icon from '@mui/icons-material/Brightness4';
// import Brightness7Icon from '@mui/icons-material/Brightness7';
// import IconButton from '@mui/material/IconButton';
// import { useTheme } from '@mui/material/styles';
export default function AppRoots(props) {


  const [open, setOpen] = React.useState(true);
  const page = props.page.area;

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // const theme = useTheme();

  return (

    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar open={open} toggleDrawer={toggleDrawer} props={props}
        colorMode={props.colorMode}
      />

      <SideMenu open={open} toggleDrawer={toggleDrawer} />
      {/* <IconButton sx={{ ml: 1 }} onClick={() => props.colorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton> */}
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
        {page === 'registration' && (<SignUp></SignUp>)}
        {page === 'customize' && (<Customize></Customize>)}
      </Box >
    </Box >
  )
}