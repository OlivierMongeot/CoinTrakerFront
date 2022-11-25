import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppRoots from './AppRoots'


const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

function ThemeContent(props) {

  const [mode, setMode] = React.useState(
    (localStorage.getItem('theme')) ?
      JSON.parse(localStorage.getItem('theme')) :
      'dark');

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
        <AppRoots ColorModeContext={ColorModeContext} colorMode={colorMode} mode={mode} />
      </ThemeProvider >
    </ColorModeContext.Provider>
  );
}


export default function ThemeExport(props) {
  return <ThemeContent area={props} />;
}

