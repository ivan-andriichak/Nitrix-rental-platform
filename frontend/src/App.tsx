import React from "react";
import { ApartmentList } from './components/ApartmentList';

const App: React.FC = () => {
  return (
    <div>
      <h1>Apartment Management</h1>
      <ApartmentList />
    </div>
  );
};

export { App };
