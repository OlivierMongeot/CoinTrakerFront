import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppRoots from './AppRoots'


function ThemeContent(props) {

  let page = props.area;

  const [mode, setMode] = React.useState(
    (localStorage.getItem('colorMode')) ?
      JSON.parse(localStorage.getItem('colorMode')) :
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
        palette: { mode },
      }), [mode],
  );

  localStorage.setItem('colorMode', JSON.stringify(mode));


  return (
    // <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>

      <AppRoots page={page} colorMode={colorMode} mode={mode} />


    </ThemeProvider >
    // </ColorModeContext.Provider >
  );
}


export default function ThemeExport(props) {
  return <ThemeContent area={props} />;
}

