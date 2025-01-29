import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from './layouts';
import { ApartmentList, ErrorPage , HomePage} from './pages';

const router = createBrowserRouter([
  {
    path: '', element: <MainLayout/>, children: [
      {
        index: true, element: <HomePage/>
      }
    ]
  },
  {
    path: '/*', element: <ErrorPage/>
  }
]);

export {
  router
};
