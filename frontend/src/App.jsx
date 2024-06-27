import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import ScrollTop from 'components/ScrollTop';
import StudentApplication from 'components/StudentsDomain/StudentApplication';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    
    <ThemeCustomization>
      <ScrollTop>
        <RouterProvider router={router} />
        
      </ScrollTop>
    </ThemeCustomization>

  );
}
