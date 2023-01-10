import React from 'react';
import SideMenu from './SideMenu';
import TopBar from './TopBar';

export default function TopAndSideMenu(props) {

  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <React.Fragment>

      <TopBar open={open} toggleDrawer={toggleDrawer} />
      <SideMenu open={open} toggleDrawer={toggleDrawer} />
    </React.Fragment>
  )
}
