import React, { useEffect } from 'react';
import axios from 'axios';
import { AreaChart } from 'recharts';
import { XAxis, YAxis, Tooltip, Area, ResponsiveContainer } from 'recharts';
// import colors from '../styles/_settings.scss';


const CoinChart = ({ coinId, CoinName }) => {

  const [duration, setDuration] = React.useState(30);

  const [coinData, setCoinData] = React.useState([]);

  const headerData = [
    [1, "1 jour"],
    [3, "3 jours"],
    [7, "7 jours"],
    [30, "30 jours"],
    [90, "90 jours"],
    [180, "180 jours"],
    [365, "365 jours"],
    [3000, "Max"]
  ];

  useEffect(() => {

    let dataArray = [];

    axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${duration}${duration > 32 ? "&interval=daily" : ""}`)
      .then(res => {

        for (let i = 0; i < res.data.prices.length; i++) {
          let price = res.data.prices[i][1];
          let options = {};
          if (duration >= 180) {
            options = {
              month: 'numeric',
              // day: 'numeric',
              year: 'numeric'
            }
          } else if (duration < 180 && duration >= 30) {
            options = {
              month: 'numeric',
              // day: 'numeric',
              year: 'numeric'

            }
          } else if (duration < 30 && duration > 3) {
            options = {
              month: 'numeric',
              day: 'numeric',
              // year: 'numeric'
              hour: 'numeric',
              minute: 'numeric'

            }
          }
          else {
            options = {
              // month: 'numeric',
              // day: 'numeric',
              // year: 'numeric'
              hour: 'numeric',
              minute: 'numeric'
            }
          }
          // }


          dataArray.push({
            date: new Date(res.data.prices[i][0]).toLocaleDateString('fr-FR', options),
            price: price < 50 ? price : parseInt(price),
          });
        }
        setCoinData(dataArray);
      }
      ).catch
      (err => {
        console.log(err);
      }
      )
  }, [coinId, duration])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // console.log('label ', label);
      // console.log('payload[0] ', payload[0])
      return (
        <div className="custom-tooltip">
          <p className="label">{` Le ${label}`}</p>
          <p className="intro">{`Valeur : ${payload[0].value} $`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="coin-chart">
      <p>{CoinName}</p>
      <div className="btn-container">
        {headerData.map((item, index) => {
          // console.log(duration);
          return (
            <div
              htmlFor={"btn" + item[0]}
              key={index}
              onClick={() => setDuration(item[0])}
              className={duration === item[0] ? "active-btn" : ""}>
              {item[1]}
            </div>
          )
        }
        )}
      </div>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <AreaChart data={coinData} margin={{
            top: 10, right: 0, left: 100, bottom: 0

          }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor='#166be0' stopOpacity={0.8} />
                <stop offset="95%" stopColor='rgb(219, 217, 217)' stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" dy={10} />
            <YAxis domain={["auto", "auto"]} />
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="price" stroke='#166be0'
              fill="url(#colorUv)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>


    </div>
  );
};

export default CoinChart;