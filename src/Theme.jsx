import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppRoots from './AppRoots'


const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

function ThemeContent(props) {

  console.log('ThemeContent', props)

  let page = props.area;

  const [mode, setMode] = React.useState(
    (localStorage.getItem('theme')) ?
      JSON.parse(localStorage.getItem('theme')) :
      'dark');

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        localStorage.setItem('theme', JSON.stringify(mode));
      },
    }),
    [mode],
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
        <AppRoots page={page} ColorModeContext={ColorModeContext} colorMode={colorMode} mode={mode} />
      </ThemeProvider >
    </ColorModeContext.Provider >
  );
}


export default function ThemeExport(props) {
  return <ThemeContent area={props} />;
}

