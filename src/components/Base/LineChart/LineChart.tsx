import React from 'react';
import { useTheme } from '@mui/material/styles';
import { ComposedChart, XAxis, YAxis, ResponsiveContainer, Line } from 'recharts';
import { uniq } from 'lodash';

interface Props {
  title?: string;
  color?: string;
  id?: string;
  data?: Array<any>;
}

const LineChartCustom: React.FC<Props> = ({ data, color, id }) => {
  const theme = useTheme();

  const yAxisData = data?.map((i) => i.rewardRatio);

  // const getFill = (color: string | undefined) => {
  //   if (color === undefined) return;
  //   if (color === '#4F49DD') return 'shadow-0';
  //   if (color === '#5EF87A') return 'shadow-1';
  //   return 'shadow-2';
  // };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={300}
        height={200}
        data={data}
        className={`lineReward ${theme.palette.mode}ModeChart`}
        margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
      >
        <defs>
          <filter id={`shadow${id}`} height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
            <feOffset in="blur" dx="0" dy="6" result="offsetBlur" />
            <feFlood floodColor={color} floodOpacity="1" result="offsetColor" />
            <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <XAxis
          dataKey="month"
          type={'number'}
          tickLine={false}
          axisLine={false}
          fontSize="9px"
          fontFamily="Roboto"
          color={theme.palette.mode === 'light' ? '#293247' : '#FFFFFF'}
          tickFormatter={(value, index) => {
            if (index >= 4) return ``;
            return `${Number(value) + 1}`;
          }}
          interval={0}
        />
        <YAxis
          dataKey="rewardRatio"
          type={'number'}
          tickLine={false}
          axisLine={false}
          fontSize="9px"
          fontFamily="Roboto"
          color={theme.palette.mode === 'light' ? '#293247' : '#FFFFFF'}
          ticks={uniq(yAxisData)}
          domain={yAxisData ? yAxisData[0] : 0}
          interval={0}
        />
        <Line
          type="step"
          strokeLinecap="round"
          strokeWidth={1}
          filter={`url(#shadow${id})`}
          // style={{ strokeDasharray: `100% 60% 40%` }}
          dataKey="rewardRatio"
          stroke={color}
          dot={false}
          legendType="none"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default React.memo(LineChartCustom);
