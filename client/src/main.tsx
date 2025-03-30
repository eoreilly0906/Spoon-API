import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App';

import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Login from './pages/Login';
import YourRecipes from './pages/YourRecipes';
import NewRecipe from './pages/NewRecipe';
import EditRecipe from './pages/EditRecipe';
import SearchRecipes from './pages/SearchRecipes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      }, 
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/recipes',
        element: <YourRecipes />
      },
      {
        path: '/recipes/new',
        element: <NewRecipe />
      },
      {
        path: '/recipes/edit/:id',
        element: <EditRecipe />
      },
      {
        path: '/search',
        element: <SearchRecipes />
      }
    ]
  }
])

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
