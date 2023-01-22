import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './pages/Login';
import Home from './pages/Home';
import WalletsBoard from './pages/WalletsBoard';
import Customize from './pages/Customize';
// import SignUp from '../Trash/SignUp';
import Registration from './pages/Registration';
import Account from './pages/Account';
import Exchanges from './pages/Exchanges';
import Withdraws from './pages/Withdraws';
import Transactions from './pages/Transactions'
import TopAndSideMenu from './layout/TopAndSideMenu';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
// import { useDispatch, useSelector } from 'react-redux';
// import { setTheme } from './action/theme.action';
export const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

function App() {

  const [mode, setMode] = React.useState(
    (localStorage.getItem('colorMode')) ?
      JSON.parse(localStorage.getItem('colorMode')) :
      'light');

  // REDUX 
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(setTheme(mode))
  // }, [mode])

  // const reduxMode = useSelector(state => state.themeReducer);
  // console.log(' Test reduxMode', reduxMode);


  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        console.log('toggle');

      },
    }),
    [],
  );


  const theme = React.useMemo(
    () =>
      createTheme({
        palette: { mode },
      }), [mode],
  );

  localStorage.setItem('colorMode', JSON.stringify(mode));

  const styleMain = {
    backgroundColor: (theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
    flexGrow: 1,
    height: '100vh - 64px',
    overflow: 'auto',
    marginTop: '64px'
  }


  return (
    <Router>
      <ThemeProvider theme={theme}>
        <ColorModeContext.Provider value={colorMode}>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <TopAndSideMenu />
            <Box component="main" sx={styleMain}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/exchanges" element={<Exchanges />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/withdraws" element={<Withdraws />} />
                <Route path="/account" element={<Account />} />
                <Route path="/customize" element={<Customize />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/wallets" element={<WalletsBoard />} />
              </Routes>
            </Box >
          </Box >
        </ColorModeContext.Provider >
      </ThemeProvider>
    </Router >
  );
}

export default App;
