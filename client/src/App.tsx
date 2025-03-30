import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <main className='container pt-5'>
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
