import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link } from "react-router-dom";

export const mainListItems = (
  <React.Fragment>

    <Link to="/" style={{ color: 'inherit', textDecoration: 'inherit' }}>
      <ListItemButton >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon >
        <ListItemText className='link' primary="Markets" />
      </ListItemButton>
    </Link>

    <Link to="/wallets" style={{ color: 'inherit', textDecoration: 'inherit' }}>
      <ListItemButton>
        <ListItemIcon>
          <AccountBalanceWalletIcon />
        </ListItemIcon>
        <ListItemText primary="Wallets" />
      </ListItemButton>
    </Link>
    <Link to="/transactions" style={{ color: 'inherit', textDecoration: 'inherit' }}>
      <ListItemButton>
        <ListItemIcon>
          <SwapHorizIcon />
        </ListItemIcon>
        <ListItemText primary="Transactions" />
      </ListItemButton>
    </Link>
    <Link to="/exchanges" style={{ color: 'inherit', textDecoration: 'inherit' }}>
      <ListItemButton>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Exchanges" />
      </ListItemButton>
    </Link>
    <Link to="/withdraws" style={{ color: 'inherit', textDecoration: 'inherit' }}>
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Withdraws" />
      </ListItemButton>
    </Link>
    <Link to="/customize" style={{ color: 'inherit', textDecoration: 'inherit' }}>
      <ListItemButton>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Customize Wallet" />
      </ListItemButton>
    </Link>

  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    {/* <ListSubheader component="div" inset>
      Future Features reports
    </ListSubheader> */}


    <Link to="/account" style={{ color: 'inherit', textDecoration: 'inherit' }}>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="My account" />
      </ListItemButton>
    </Link>
    {/* <Link to="/params" style={{ color: 'inherit', textDecoration: 'inherit' }}>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Parametres" />
      </ListItemButton>
    </Link> */}
  </React.Fragment >
);
