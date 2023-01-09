
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import TransactionFormater from '../../helpers/TransactionFormater';
import NativeAmountormater from '../../components/Transactions/NativeAmountormater';
import DescriptionFormater from '../../components/Transactions/DescriptionFormater';
import BadgeFormater from '../../components/Transactions/BadgeFormater';
import DateFormater from '../../components/Transactions/DateFormater';

const TableTransactions = (props) => {

  const transactions = props.transactions

  const columns: GridColDef[] = [
    {
      field: 'exchange', headerName: 'Exchange', align: 'center', headerAlign: 'center', minWidth: 90,
      flex: 1, maxWidth: 120,
      renderCell: (params) => (params.value.charAt(0).toUpperCase() + params.value.slice(1))
    },
    {
      field: 'token', headerName: 'Token', width:
        160, align: 'left', headerAlign: 'center', hide: true
    },
    {
      field: 'transaction', headerName: 'Type', align: 'left', headerAlign: 'center', minWidth: 110,
      flex: 1,
      renderCell: (params) => <TransactionFormater value={params.value} />
    },
    {
      field: 'smartType', headerName: 'Info', minWidth: 140, align: 'center', flex: 1,
      headerAlign: 'center',
      renderCell: (params) => (params?.value.charAt(0).toUpperCase() + params?.value.slice(1))
      // renderCell: (params) => <DescriptionFormater value={params.value} />
    }
    ,
    {
      field: 'entry', headerName: 'Entrée(+)',
      minWidth: 160, align: 'right', headerAlign: 'center', flex: 1,
      renderCell: (params) => <BadgeFormater value={params.value} type='cashin' />
    },
    {
      field: 'exit', headerName: 'Sortie(-)', minWidth: 160, flex: 1, align: 'right', headerAlign: 'center',
      renderCell: (params) => <BadgeFormater value={params.value} type='cashout' />
    },
    {
      field: 'createdAt', headerName: 'Date', align: 'center', flex: 2, minWidth: 140,
      headerAlign: 'center',
      renderCell: (params) => <DateFormater value={params.value} />
    },
    // {
    //   field: 'quote_transaction', headerName: 'Amount', minWidth: 180, align: 'right',
    //   headerAlign: 'center', flex: 1,
    //   renderCell: (params) => { value={params.value}} 
    // },
    {
      field: 'quote_transaction', headerName: 'Amount', minWidth: 230, align: 'right',
      headerAlign: 'center', flex: 1,
      renderCell: (params) => <NativeAmountormater value={params.value} />
    },
    // {
    //   field: 'quoteUSD', headerName: 'QUOTE USD', minWidth: 180, align: 'right',
    //   headerAlign: 'center', flex: 1
    // },
    {
      field: 'title', headerName: 'Details', minWidth: 40, align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <DescriptionFormater value={params.value} />
    }
    ,
    // {
    // field: 'id', headerName: 'ID', width:
    //     300, align: 'center', headerAlign: 'center'
    // }
  ];

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '80vh',
        marginTop: 3
      }} >
      {transactions && (
        <div style={{ height: '100%', width: '100%' }}>
          <DataGrid components={{ Toolbar: GridToolbar }} initialState={{
            sorting: {
              sortModel: [{ field: 'updated_at', sort: 'desc' }],
            },
          }} rows={transactions} columns={columns} />
        </div>
      )}
    </Paper>
  )
}


export default TableTransactions;