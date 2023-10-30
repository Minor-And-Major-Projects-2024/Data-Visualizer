import React, { useEffect, useRef, useState } from 'react';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowCircleRight,
  faArrowLeftRotate,
} from '@fortawesome/free-solid-svg-icons';
interface PieChartProps {
  data: Record<string, number>;
  title: string;
  forChartof: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, title, forChartof }) => {
  library.add(faArrowCircleRight);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<'pie', number[], unknown> | null>(null);
  const [charTitle, setcharTitle] = useState(title);
  const [newChartOf, setNewChartOf] = useState(forChartof);
  const originalData = useRef<Record<string, number> | null>(data);
  const [legendPosition, setLegendPosition] = useState('right');

  const makePOSTRequest = async (clickedLabel: string) => {
    const csrfToken = await fetchCSRFToken();
    let apiUrl = '';
    const formData = new FormData();
    if (newChartOf === 'Region') {
      apiUrl = '/dashboard/pie_chart_country/';
      formData.append('region', clickedLabel);
      setcharTitle(`Published in Countries for ${clickedLabel} Region`);
      setNewChartOf('Country');
    } else if (newChartOf === 'Country') {
      return;
    } else if (newChartOf === 'Sector') {
      apiUrl = '/dashboard/pie_chart_topic/';
      formData.append('sector', clickedLabel);
      setcharTitle(`Published in Topics for ${clickedLabel} Sector`);
      setNewChartOf('Topic');
    } else if (newChartOf === 'Pestle') {
      apiUrl = '/dashboard/pie_chart_sector/';
      formData.append('pestle', clickedLabel);
      setcharTitle(`Published in Sectors for ${clickedLabel} Pestle`);
      setNewChartOf('Sector');
    } else if (newChartOf === 'Topic') {
      return;
    }
    formData.append('csrfmiddlewaretoken', csrfToken);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken,
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        if (Object.keys(responseData).length === 0) {
          setcharTitle(`No data available for ${clickedLabel}`);
        } else {
          const updatedLabels = Object.keys(responseData);
          const updatedValues = Object.values(responseData).map((value: any) =>
            Number(value)
          );

          if (chartInstance.current) {
            chartInstance.current.data.labels = updatedLabels;
            chartInstance.current.data.datasets[0].data = updatedValues;
            chartInstance.current.update();
          }
        }
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const refreshChart = () => {
    if (originalData.current) {
      if (chartInstance.current) {
        chartInstance.current.data.labels = Object.keys(originalData.current);
        chartInstance.current.data.datasets[0].data = Object.values(
          originalData.current
        );
        chartInstance.current.update();
      }
      setcharTitle(title);
    }
  };
  const handleResize = () => {
    console.log('exec');
    if (window.innerWidth < 768) {
      setLegendPosition('bottom' as 'bottom');
    } else {
      setLegendPosition('right' as 'right');
    }
  };
  useEffect(() => {
    handleResize();
  }, []);
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    if (!data) return;

    originalData.current = data;

    if (chartRef.current) {
      const labels = Object.keys(data);
      const values = Object.values(data);

      const backgroundColors = labels.map(() => getRandomColor());

      const chartConfig: ChartConfiguration<'pie'> = {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: backgroundColors,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const clickedIndex = elements[0].index;
              const clickedLabel = labels[clickedIndex];

              makePOSTRequest(clickedLabel);
            }
          },
          elements: {
            arc: {
              spacing: 0,
            },
          },
          plugins: {
            legend: {
              position: legendPosition as 'right',
              labels: {
                font: {
                  size: 10,
                },
              },
            },
          },
        },
      };

      chartInstance.current = new Chart(chartRef.current, chartConfig);
    }
  }, [data, legendPosition]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const fetchCSRFToken = async () => {
    try {
      const response = await fetch('/dashboard/api/csrf/', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      return data.csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      throw error;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xl text-center font-semibold">{charTitle}</p>
        <button
          className="cursor-pointer focus:outline-none"
          onClick={refreshChart}
        >
          <FontAwesomeIcon icon={faArrowLeftRotate} className="text-xl" />
        </button>
      </div>
      <div className="w-full h-auto">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default PieChart;
