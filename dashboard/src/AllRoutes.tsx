import { Routes, Route } from 'react-router-dom';

import { HomePage } from './screens/index';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default AllRoutes;
