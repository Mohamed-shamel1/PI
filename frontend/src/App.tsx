import { Outlet } from 'react-router-dom';
import { CustomerNavbar } from './components/layout/CustomerNavbar';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <CustomerNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-100 py-12 text-center">
        <div className="container mx-auto px-4">
          <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">
            © 2026 FoodPI. Crafted for Great Taste.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
