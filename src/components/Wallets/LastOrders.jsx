import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


export default function DenseTable(props) {

  const data = props.orders;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 200 }} size="small" >
        <TableHead>
          <TableRow>
            <TableCell>Exchange</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Produits</TableCell>
            <TableCell align="right">Target</TableCell>
            <TableCell align="right">Size</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.filter(order => {
            return (order.status === 'OPEN' || order.status === 'open');
            // return true
          })

            .map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right">{row.exchange}</TableCell>
                <TableCell component="th" scope="row">
                  {row.type}
                </TableCell>
                <TableCell align="right">{row.currency}</TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell align="right">{parseFloat(row.valueUSDT).toFixed(2)} $</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
