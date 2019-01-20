import React from 'react';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import LineChart from 'recharts/lib/chart/LineChart';
import Line from 'recharts/lib/cartesian/Line';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';
import CartesianGrid from 'recharts/lib/cartesian/CartesianGrid';
import Tooltip from 'recharts/lib/component/Tooltip';
import Legend from 'recharts/lib/component/Legend';
import Label from 'recharts/lib/component/Label';

export const SimpleLineChart = ({ 
    data, 
    XAxisDataKey, 
    YAxisDataKey, 
    stroke, 
    YLabel, 
    YUnit, 
    XLabel, 
    XUnit,
    lineName
}) => {
  return (
    <ResponsiveContainer width="99%" height={320}>
      <LineChart data={data}>
        <XAxis 
            dataKey={XAxisDataKey}
            unit={XUnit}
            name={XLabel}
        >
            <Label value={XLabel} offset={0} position="insideBottom" />
        </XAxis>
        <YAxis
            name={YLabel} 
            unit={YUnit}
        >
            <Label value={YLabel} angle={-90} position="insideLeft" />
        </YAxis>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line name={lineName} type="monotone" dataKey={YAxisDataKey} stroke={stroke} />
      </LineChart>
    </ResponsiveContainer>
  );
}