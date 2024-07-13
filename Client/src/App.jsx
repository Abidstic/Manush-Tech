import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './components/Auth/SignUp';
import Signin from './components/Auth/SignIn';
import UserList from './components/Admin/UserManagement';
import ItemManagement from './components/Admin/ItemManagemnet';
import MealSchedule from './components/Admin/MealSchedule';
import Dashboard from './layout/Dashboard';

import './App.css';
import './index.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Signin />,
    },
    {
        path: '/register',
        element: <Signup />,
    },
    {
        path: '/users',
        element: <UserList />,
    },
    {
        path: '/items',
        element: <ItemManagement />,
    },
    {
        path: '/orders',
        element: <MealSchedule />,
    },
    {
        path: '*',
        element: <Dashboard />,
    },
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
