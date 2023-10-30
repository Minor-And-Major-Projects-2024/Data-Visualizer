import React, { FC, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface SectorTopicAreaGraphProps {
  sectors: string[];
}

const SectorTopicAreaGraph: FC<SectorTopicAreaGraphProps> = ({ sectors }) => {
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [fetchedTopics, setFetchedTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({});
  useEffect(() => {
    if (sectors && sectors.length > 0) {
      setSelectedSector(sectors[0]);
    }
    if (fetchedTopics && fetchedTopics.length > 0) {
      if (selectedTopic === '') {
        setSelectedTopic(fetchedTopics[0]);
      } else {
        setSelectedTopic(selectedTopic)
      }
    }
  }, [sectors, fetchedTopics, selectedTopic]);
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
  useEffect(() => {
    if (selectedSector) {
      const fetchData = async () => {
        const csrfToken = await fetchCSRFToken();
        const headers = {
          'X-CSRFToken': csrfToken,
        };
        let apiUrl = '/dashboard/fetch_topics/';
        const formData = new FormData();
        formData.append('csrfmiddlewaretoken', csrfToken);
        formData.append('sector', selectedSector);
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: formData,
          });

          if (response.ok) {
            const responseData = await response.json();
            setFetchedTopics(responseData);
          } else {
            console.error('Error:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
      fetchData();
    }
    if (selectedSector && selectedTopic) {
      const fetchData = async () => {
        const csrfToken = await fetchCSRFToken();
        const headers = {
          'X-CSRFToken': csrfToken,
        };
        let apiUrl = '/dashboard/area_chart_sector_topic/';
        const formData = new FormData();
        formData.append('csrfmiddlewaretoken', csrfToken);
        formData.append('sector', selectedSector);
        formData.append('topic', selectedTopic);
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: formData,
          });

          if (response.ok) {
            const responseData = await response.json();
            const dates = Object.keys(responseData.data);
            const colors = Highcharts.getOptions().colors || [];
            const options: Highcharts.Options = {
              chart: {
                type: 'area',
                zooming: {
                  type: 'xy',
                  mouseWheel: true,
                },
              },
              title: {
                text: `Likelihood of publishes for ${selectedTopic} in ${selectedSector}`,
              },
              xAxis: {
                categories: dates,
              },
              yAxis: {
                title: {
                  text: 'Average Likelihood',
                },
              },
              series: [
                {
                  type: 'area',
                  name: selectedTopic,
                  data: dates.map((date, index) => ({
                    y: responseData.data[date],
                    color: colors[index % colors.length], // Use a modulo operation to cycle through colors
                  })),
                  marker: {
                    symbol: 'circle',
                    radius: 6,
                  },
                  color: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                      [0, 'rgba(255, 0, 0, 0.8)'], // Start color
                      [1, 'rgba(0, 0, 255, 0.8)'], // End color
                    ],
                  },
                },
              ],
              legend: {
                enabled: false,
              },
              tooltip: {
                shared: true,
                formatter: function () {
                  const points = (this.points ?? []).map(
                    (point) => `${point.series.name}: <b>${point.y}</b>`
                  );
                  return `${this.x}<br>${points.join('<br>')}`;
                },
              },
            };

            setChartOptions(options);
          } else {
            console.error('Error:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
      fetchData();
    }
  }, [selectedSector, selectedTopic]);

  return (
    <div className="bg-white shadow-lg p-4 rounded-md">
      {selectedSector && selectedTopic && (
        <div className="mt-4">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
      )}
      {sectors && fetchedTopics && (
        <div className='flex flex-col'>
          <>
            <label className="block text-sm font-medium mb-2">
              Select Sector:
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 mb-1"
            >
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </>
          <>
            <label className="block text-sm font-medium mb-2">
              Select Topic:
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            >
              {fetchedTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </>
        </div>
      )}
    </div>
  );
};

export default SectorTopicAreaGraph;
