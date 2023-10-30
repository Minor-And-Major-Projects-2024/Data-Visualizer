import React, { FC, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import * as d3 from 'd3';

interface DetailTableProps {
  data: {
    sector: string;
    topic: string;
    table_data: Array<{
      insight: string;
      url: string;
      title: string;
      source: string;
      start_year: string;
      end_year: string;
    }>;
  };
}

const DetailTable: FC<DetailTableProps> = ({ data }) => {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortAscending, setSortAscending] = useState<boolean>(true);

  useEffect(() => {
    d3.selectAll('.table td, .table th').style('border', '1px solid #e2e8f0');

    d3.selectAll('.table tbody tr')
      .selectAll('td:nth-child(5), td:nth-child(6)')
      .style('background-color', 'rgba(0, 128, 0, 0.1)');
  }, []);

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      setSortAscending(!sortAscending);
    } else {
      setSortColumn(columnIndex);
      setSortAscending(true);
    }
  };
  if (data.table_data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-gray-500 text-2xl text-center">
          No data available for <br /> SECTOR: {data.sector} & TOPIC:{' '}
          {data.topic}
        </p>
        {/* btn to redirect to '/' page */}
        <button
            onClick={() => {
                window.location.href = '/';
            }}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 my-20"
        >
          Return to DashBoard
        </button>
      </div>
    );
  }
  const sortedTableData = data.table_data.slice().sort((a: any, b: any) => {
    if (sortColumn !== null) {
      const aValue = a[Object.keys(a)[sortColumn]];
      const bValue = b[Object.keys(b)[sortColumn]];
      return sortAscending
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  return (
    <div className="detail-table overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2" onClick={() => handleSort(0)}>
              Insight
            </th>
            <th className="px-4 py-2">URL</th>
            <th className="px-4 py-2" onClick={() => handleSort(2)}>
              Title
            </th>
            <th className="px-4 py-2" onClick={() => handleSort(3)}>
              Source
            </th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleSort(4)}
            >
              Start Year
            </th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleSort(5)}
            >
              End Year
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTableData.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{item.insight}</td>
              <td className="border px-4 py-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
              </td>
              <td className="border px-4 py-2">{item.title}</td>
              <td className="border px-4 py-2">{item.source}</td>
              <td className="border px-4 py-2">{item.start_year}</td>
              <td className="border px-4 py-2">{item.end_year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DetailTable;
