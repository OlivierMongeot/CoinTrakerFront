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
            <TableCell>Type</TableCell>
            <TableCell align="right">Produits</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Size</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {data.filter(order => {
            return order.status === 'OPEN';
          })
            .map((row) => (
              <TableRow
                key={row.order_id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.product_type}
                </TableCell>
                <TableCell align="right">{row.product_id}</TableCell>
                <TableCell align="right">{row.order_configuration.limit_limit_gtc.limit_price}</TableCell>
                <TableCell align="right">{row.order_configuration.limit_limit_gtc.base_size * row.order_configuration.limit_limit_gtc.limit_price} $</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
