import React from 'react';

interface BackgroundHeaderProps {
  displaySidebar: boolean;
  heading?: string;
  subheading?: string;
}

const BackgroundHeader: React.FC<BackgroundHeaderProps> = ({
  displaySidebar,
  heading,
  subheading,
}) => {
  const headerWidthClass = displaySidebar ? 'w-full' : 'w-full'; //w-[calc(100%-230px)]

  return (
    <div className="background-header">
      <div className={`background-header-color ${headerWidthClass}`}>
        <h5>DashBoard</h5>
        <p>Article Data Visualized</p>
      </div>
      <div className="background-header-img"></div>
    </div>
  );
};

export default BackgroundHeader;
