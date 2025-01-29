import {Outlet} from "react-router-dom";

import {HeaderPage, } from "../pages";

const MainLayout = () => {
  return (
    <div>
      <HeaderPage/>
      <Outlet/>
    </div>
  );
};

export {MainLayout};