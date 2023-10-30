import React, { FC } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface BarGraphProps {
  data: Record<string, any>;
}

const BarGraph: FC<BarGraphProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  const categories = Object.keys(data);
  const seriesData = categories.flatMap((category) => {
    const topics = data[category];
    return topics.map((item: any) => {
      return {
        name: item.topic,
        stack: category,
        y: item.avg_likelihood,
      };
    });
  });

  const randomColors = seriesData.map(() => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  });

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      zooming: {
        type: 'xy',
        mouseWheel: true
      }
    },
    title: {
      text: 'Average Likelihood of Published by Topic',
    },
    xAxis: {
      categories: seriesData.map((item) => item.name),

      labels: {
        rotation: -45,
        style: {
          fontSize: '10px',
        },
      },
      scrollbar: {
        enabled: true,
      },
    },
    yAxis: {
      title: {
        text: 'Average Likelihood',
      },
      max: 4,
    },
    series: categories.map((category: any, index) => ({
      type: 'bar',
      name: category,
      data: data[category].map((item: any) => ({
        name: item.topic,
        stack: category,
        y: item.avg_likelihood,
        color: randomColors[index],
      })),
      showInLegend: true,
      cursor: 'pointer',
      events: {
        click: function (event) {
          const topic = event.point.name;
          const category = event.point.series.name;
          console.log(`Topic: ${topic}, Sector: ${category}`);
        },
      },
    })),
    plotOptions: {
      series: {
        stacking: 'normal',
      },
    },
    tooltip: {
      pointFormat:
        '<b>Topic: {point.name}</b><br>Sector: {point.stack}<br>Average Likelihood: {point.y}',
    },
    legend: {
      enabled: true,
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default BarGraph;
