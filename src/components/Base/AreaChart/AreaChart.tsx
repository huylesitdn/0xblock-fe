import React from 'react';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { formatTimestamp } from 'helpers/formatTimestamp';
import { labelDate } from 'consts/dashboard';
import { convertCamelCaseToPascalCase } from 'helpers/convertCamelCaseToPascalCase';
import { formatReward } from 'helpers';
import './styles.css';
interface Props {
  id?: string;
  title?: string;
  color: string;
  data: Array<any>;
  dataKey?: string;
}

const AreaChartCustom: React.FC<Props> = ({ id, data, color, dataKey = 'close' }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer height={'90%'}>
      <ComposedChart width={732} height={540} data={data}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="40%" stopColor={color} stopOpacity={0.8} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          tickCount={5}
          tickLine={false}
          axisLine={false}
          fontSize="10px"
          fontFamily="Poppins"
          color={theme.palette.mode === 'light' ? '#000000' : '#4F4F4F'}
          dataKey="time"
          tickFormatter={(timestamp) => moment(timestamp).format('D MMM')}
        />
        <YAxis
          tick={{
            dx: 4,
          }}
          tickCount={6}
          axisLine={false}
          domain={['auto', 'auto']}
          tickLine={false}
          color={theme.palette.mode === 'light' ? '#000000' : '#4F4F4F'}
          fontSize="10px"
          fontFamily="Poppins"
          tickFormatter={(value) => `${formatReward(String(value))}`}
          orientation="left"
          textAnchor="end"
          width={60}
        />
        <Tooltip
          formatter={(value: string, name: string) => [formatReward(String(value)), convertCamelCaseToPascalCase(name)]}
          labelFormatter={(value: string) => formatTimestamp(value, labelDate)}
        />
        <Area type="monotone" dataKey={dataKey} stroke="#3864FF" strokeWidth={2} fillOpacity={1} fill={`url(#${id})`} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default AreaChartCustom;
