import React, { FC } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface DotGraphProps {
  data: Record<string, any>;
}

const getRandomColor = () => {
  const MIN_COLOR = 100;
  const MAX_COLOR = 200;

  const randomColor = () =>
    Math.floor(Math.random() * (MAX_COLOR - MIN_COLOR + 1) + MIN_COLOR);

  const red = randomColor().toString(16);
  const green = randomColor().toString(16);
  const blue = randomColor().toString(16);

  return `#${red}${green}${blue}`;
};

const DotGraph: FC<DotGraphProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  const dataToArray = (data: Record<string, any>) => {
    const result: [string, number][] = [];
    const dates = Object.keys(data).sort();
    dates.forEach((date) => {
      const insights = data[date];
      const totalInsights = insights.length;
      result.push([date, totalInsights]);
    });
    return result;
  };

  const seriesColor = getRandomColor();

  const handlePointClick = (event: Highcharts.PointClickEventObject) => {
    const date = event.point.category;
    const insights = data[date];
    console.log(`Insights for ${date}:`, insights);
  };

  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      zooming: {
        type: 'xy',
        mouseWheel: true,
      },
    },
    title: {
      text: 'Total Insights for Each Date',
    },
    xAxis: {
      categories: dataToArray(data).map((item) => item[0]),
      labels: {
        rotation: -45,
        style: {
          fontSize: '12px',
          margin: 'auto',
        },
      },
    },
    yAxis: {
      title: {
        text: 'Total Insights',
      },
    },
    series: [
      {
        name: 'Total Insights Published',
        type: 'line',
        data: dataToArray(data).map((item) => item[1]),
        color: seriesColor,
        point: {
          events: {
            click: handlePointClick,
          },
        },
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default DotGraph;
