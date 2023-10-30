import React, { FC, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface SectorGraphProps {
  data: Record<string, Array<{ topic: string; relevance_sum: number }>>;
  title: string;
}

const SectorGraph: FC<SectorGraphProps> = ({ data, title }) => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({});

  useEffect(() => {
    const dates = Object.keys(data);
    const topics = new Set<string>();

    dates.forEach((date) => {
      data[date].forEach((item) => {
        topics.add(item.topic);
      });
    });

    const seriesData = Array.from(topics).map((topic) => {
      const dataPoints = dates.map((date) => {
        const matchingData = data[date].find((item) => item.topic === topic);
        return matchingData ? matchingData.relevance_sum : 0;
      });

      return {
        name: topic,
        data: dataPoints,
        type: 'area',
      };
    });

    const options: Highcharts.Options = {
      chart: {
        type: 'line',
        zooming: {
          type: 'xy',
          mouseWheel: true,
        },
      },
      title: {
        text: `Relevance of Topics in ${title} Sector`,
      },
      xAxis: {
        categories: dates,
      },
      yAxis: {
        title: {
          text: 'Relevance',
        },
      },
      series: seriesData as any,
      tooltip: {
        shared: true,
        formatter: function () {
          const points = (this.points ?? []).map(
            (point) => `${point.series.name}: <b>${point.y}</b>`
          );
          return `${this.x}<br>${points.join('<br>')}`;
        },
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          cursor: 'pointer',
          events: {
            click: function (event) {
              const clickedTopics = event.point.series.chart.series.map(
                (series) => series.name
              );
              console.log('Clicked Topics:', clickedTopics);
            },
          },
        },
      },
    };

    setChartOptions(options);
  }, [data, title]);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default SectorGraph;
