import React from 'react';
import SideMenu from './SideMenu';
import TopBar from './TopBar';
import CssBaseline from '@mui/material/CssBaseline';
export default function TopAndSideMenu(props) {

  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <TopBar open={open} toggleDrawer={toggleDrawer} />
      <SideMenu open={open} toggleDrawer={toggleDrawer} />
    </React.Fragment>
  )
}
