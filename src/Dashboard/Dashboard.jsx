import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SubApp from './SubApp'


const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

function DashboardContent(props) {

  const [mode, setMode] = React.useState(localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')) : 'dark');

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));

      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: { mode, },
      }), [mode],
  );


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <SubApp ColorModeContext={ColorModeContext} colorMode={colorMode} mode={mode} />
      </ThemeProvider >
    </ColorModeContext.Provider>
  );
}


export default function Dashboard(props) {
  return <DashboardContent area={props} />;
}

