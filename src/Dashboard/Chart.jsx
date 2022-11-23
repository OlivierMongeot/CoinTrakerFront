import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { AreaChart, Area, CartesianGrid, Line, Tooltip, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';

// Generate Sales Data

const data = [
  {
    date: '01/22',
    price: 4000
  },
  {
    date: '02/22',
    price: 3000
  },
  {
    date: '03/22',
    price: 2000
  },
  {
    date: '04/22',
    price: Math.random() * 1000
  },
  {
    date: '05/22',
    price: 1890
  },
  {
    date: '06/22',
    price: Math.random() * 1000
  },
  {
    date: '07/22',
    price: 3490
  }, {
    date: '08/22',
    price: 2390
  },
  {
    date: '09/22',
    price: Math.random() * 1000
  }
];

export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Today</Title>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 0,
            right: 16,
            bottom: 5,
            left: 24,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Value ($)
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
          <Tooltip />
          <Area type="monotone" dataKey="price" stroke="#8184d8" fill="#2487d1" />
        </AreaChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
