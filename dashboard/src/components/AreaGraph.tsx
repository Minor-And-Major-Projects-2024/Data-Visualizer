import React, { FC } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCBoost from 'highcharts/modules/boost';

interface AreaGraphProps {
  data: Record<string, Array<{ sector: string; intensity_sum: number }>>;
  title: string;
}
HCBoost(Highcharts);
const AreaGraph: FC<AreaGraphProps> = ({ data, title }) => {
  
  
  if (!data) {
    return null;
  }

  const dates = Object.keys(data);
  const sectors = dates.flatMap((date) =>
    data[date].map((item) => item.sector)
  );

  const uniqueSectors = Array.from(new Set(sectors));

  const seriesData = uniqueSectors.map((sector) => {
    const dataPoints = dates.map((date) => {
      const sectorData = data[date].find((item) => item.sector === sector);
      return sectorData ? sectorData.intensity_sum : 0;
    });

    return {
      name: sector,
      data: dataPoints,
    };
  });

  const options: Highcharts.Options = {
    chart: {
      type: 'area',
      panKey: 'shift',
      zooming: {
        type: 'xy',
        mouseWheel: true
      }
    },
    title: {
      text: `Intensity of Publishments in ${title} by sectors`,
    },
    xAxis: {
      type: 'category',
      categories: dates,
    },
    yAxis: {
      title: {
        text: 'Intensity Average',
      },
    },
    navigation: {
      buttonOptions: {
        enabled: true, // Show the "reset zoom" button
      },
      menuItemStyle: {
        fontSize: '10px', // Set the font size of the reset zoom button text
      },
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        cursor: 'pointer', 
        events: {
          
          click: function (event) {
            const clickedSector = event.point.series.name;
            console.log('Clicked Sector:', clickedSector);
          },
        },
      },
    },
    series: seriesData.map((series, index) => ({
      type: 'area',
      name: series.name,
      data: series.data,
      marker: {
        symbol: 'circle',
        radius: 6,
      },
    })),
    tooltip: {
      shared: true,
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default AreaGraph;
