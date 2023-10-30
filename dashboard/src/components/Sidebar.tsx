import React, { useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobe,
  faChartPie,
  faChartLine,
  faTh,
  faTimes,
  faHomeLg,
} from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  visibilityData: {
    visibleModal: boolean;
    setVisibleModal: (visible: boolean) => void;
  };
  urlData: {
    url: string;
  };
  data: any;
  regionInput: any;
  pestleInput: any;
  sectorInput: any;
  topicInput: any;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  library.add(faGlobe, faChartPie, faChartLine, faTh, faTimes, faHomeLg);

  const [activeItem, setActiveItem] = useState<string>('DashBoard');
  const [modalInput, setModalInput] = useState<string>('');
  const [topicInput, setTopicInput] = useState<string>('');
  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
    if (itemName === 'DashBoard') {
      props.visibilityData.setVisibleModal(false);
    }
    props.visibilityData.setVisibleModal(true);
    props.urlData.url = itemName;
  };
  console.log(activeItem);
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const csrfToken = await fetchCSRFToken();
    const headers = {
      'X-CSRFToken': csrfToken,
    };
    let apiUrl = '';
    const formData = new FormData();
    if (activeItem === 'Regional Publishes') {
      apiUrl = `/dashboard/pie_chart_country/`;
      formData.append('region', modalInput);
      props.regionInput.setRegionInput(modalInput);
    } else if (activeItem === 'Sectorwise Intensity') {
      apiUrl = `/dashboard/dot_graph_pestle_sector_inetnsity/`;
      formData.append('pestle', modalInput);
      props.pestleInput.setPestleInput(modalInput);
    } else if (activeItem === 'Topic Relevences') {
      apiUrl = `/dashboard/dot_graph_sector_topic_relevance/`;
      formData.append('sector', modalInput);
      props.sectorInput.setSectorInput(modalInput);
    } else if (activeItem === 'All Publishes') {
      apiUrl = `/dashboard/table_topic_insights_details/`;
      formData.append('sector', modalInput);
      props.sectorInput.setSectorInput(modalInput);
      formData.append('topic', topicInput);
      props.topicInput.setTopicInput(topicInput);
    }
    formData.append('csrfmiddlewaretoken', csrfToken);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();

        const trimmedUrl = apiUrl.replace('/dashboard/', '');
        const cleanedUrl = trimmedUrl.replace(/\/+/g, '');

        props.data.setData((prevData: any) => ({
          ...prevData,
          [cleanedUrl]: responseData,
        }));

        console.log(responseData);
        console.log(props.pestleInput);
        props.visibilityData.setVisibleModal(false);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="sidebar">
      <p className="bg-white/70 text-[#448aff] font-semibold text-xl py-2 px-4 mb-2">
        Other Options
      </p>
      <ul>
        <li
          onClick={() => {
            handleItemClick('Regional Publishes');
          }}
          className={`border w-[228px] left-[-30px] relative border-gray-100 h-max flex flex-col justify-center items-center py-4 space-y-2 cursor-pointer rounded shadow-md hover:shadow-xl ${
            activeItem === 'Regional Publishes' ? 'bg-blue-500 text-white' : ''
          }`}
        >
          <FontAwesomeIcon icon={faGlobe} className="text-3xl" />
          <span className="text-lg">Regional Publishes</span>
        </li>
        <li
          onClick={() => {
            handleItemClick('Sectorwise Intensity');
          }}
          className={`border w-[228px] left-[-30px] relative border-gray-100 h-max flex flex-col justify-center items-center py-4 space-y-2 cursor-pointer rounded m-0.5 shadow-md hover:shadow-xl ${
            activeItem === 'Sectorwise Intensity'
              ? 'bg-blue-500 text-white'
              : ''
          }`}
        >
          <FontAwesomeIcon icon={faChartPie} className="text-3xl" />
          <span className="text-lg">Sectorwise Intensity</span>
        </li>
        <li
          onClick={() => {
            handleItemClick('Topic Relevences');
          }}
          className={`border w-[228px] left-[-30px] relative border-gray-100 h-max flex flex-col justify-center items-center py-4 space-y-2 cursor-pointer rounded m-0.5 shadow-md hover:shadow-xl ${
            activeItem === 'Topic Relevences' ? 'bg-blue-500 text-white' : ''
          }`}
        >
          <FontAwesomeIcon icon={faChartLine} className="text-3xl" />
          <span className="text-lg">Topic Relevences</span>
        </li>
        <li
          onClick={() => {
            handleItemClick('All Publishes');
          }}
          className={`border w-[228px] left-[-30px] relative border-gray-100 h-max flex flex-col justify-center items-center py-4 space-y-2 cursor-pointer rounded m-0.5 shadow-md hover:shadow-xl ${
            activeItem === 'All Publishes' ? 'bg-blue-500 text-white' : ''
          }`}
        >
          <FontAwesomeIcon icon={faTh} className="text-3xl" />
          <span className="text-lg">All Publishes</span>
        </li>
        <li
          onClick={() => {
            props.visibilityData.setVisibleModal(false);
            setActiveItem('DashBoard');
            window.location.href = '/';
          }}
          className={`border w-[228px] left-[-30px] relative border-gray-100 h-max flex flex-col justify-center items-center py-4 space-y-2 cursor-pointer rounded m-0.5 shadow-md hover:shadow-xl ${
            activeItem === 'DashBoard' ? 'bg-blue-500 text-white' : ''
          }`}
        >
          <FontAwesomeIcon icon={faHomeLg} className="text-3xl" />
          <span className="text-lg">DashBoard</span>
        </li>
      </ul>

      {props.visibilityData.visibleModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-auto my-2 flex items-center justify-center max-sm:top-80 max-sm:left-56 ">
        <div className="bg-gray-100 p-4 rounded-lg w-[400px] max-sm:w-[300px] h-max border-2 border-black/70 items-center shadow-2xl shadow-black">
            <div className="flex justify-end">
              <button
                title="Close"
                onClick={() => props.visibilityData.setVisibleModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-4">{activeItem}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 ">
                <label
                  htmlFor="modalInput"
                  className="block font-medium text-gray-800"
                >
                  {activeItem === 'Regional Publishes' ? 'Region' : ''}
                  {activeItem === 'Sectorwise Intensity' ? 'Pestle' : ''}
                  {activeItem === 'Topic Relevences' ? 'Sector' : ''}
                </label>
                <input
                  id={
                    activeItem === 'Regional Publishes'
                      ? 'regionInput'
                      : '' || activeItem === 'Sectorwise Intensity'
                      ? 'pestleInput'
                      : '' ||
                        activeItem === 'Topic Relevences' ||
                        'All Publishes'
                      ? 'sectorInput'
                      : ''
                  }
                  name={
                    activeItem === 'Regional Publishes'
                      ? 'regionInput'
                      : '' || activeItem === 'Sectorwise Intensity'
                      ? 'pestleInput'
                      : '' ||
                        activeItem === 'Topic Relevences' ||
                        'All Publishes'
                      ? 'sectorInput'
                      : ''
                  }
                  placeholder={`Enter the name of the ${
                    activeItem === 'Regional Publishes'
                      ? 'region'
                      : '' || activeItem === 'Sectorwise Intensity'
                      ? 'pestle'
                      : '' ||
                        activeItem === 'Topic Relevences' ||
                        'All Publishes'
                      ? 'sector'
                      : ''
                  }`}
                  className="w-full p-2 border rounded border-gray-300"
                  value={modalInput}
                  onChange={(e) => setModalInput(e.target.value)}
                  required
                />
              </div>
              {activeItem === 'All Publishes' && (
                <div className="mb-4">
                  <label
                    htmlFor="topic"
                    className="block font-medium text-gray-800"
                  >
                    Topic
                  </label>
                  <input
                    id="topic"
                    name="topic"
                    placeholder={`Enter the name of the topic`}
                    className="w-full p-2 border rounded border-gray-300"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    required
                  />
                </div>
              )}
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ml-24"
              >
                Visualize Data
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
