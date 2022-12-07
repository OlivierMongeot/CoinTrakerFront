import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppRoots from './AppRoots'

// export const ColorModeContext = React.createContext({ toggleColorMode: () => { } });


export const ColorModeContext = React.createContext({ toggleColorMode: () => { } });


function ThemeContent(props) {

  let page = props.area;

  const [mode, setMode] = React.useState(
    (localStorage.getItem('colorMode')) ?
      JSON.parse(localStorage.getItem('colorMode')) :
      'light');


  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        console.log('toggle colorMode');
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


  return (

    <ThemeProvider theme={theme}>
      <ColorModeContext.Provider value={colorMode}>
        <AppRoots page={page} mode={mode} />
      </ColorModeContext.Provider >
    </ThemeProvider >

  );
}


export default function ThemeExport(props) {
  return <ThemeContent area={props} />;
}

