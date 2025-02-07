import React, { useState } from 'react';
import { InventoryProvider } from './context/InventoryContext';
import { Dashboard } from './components/Dashboard';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { MovementForm } from './components/MovementForm';
import { Sun, Moon, LayoutDashboard, Package, PlusCircle, ArrowRightLeft, Menu, X } from 'lucide-react';
import { useInventory } from './context/InventoryContext';
import { Toaster } from 'react-hot-toast';

type Page = 'dashboard' | 'products' | 'add-product' | 'movements';

const Layout: React.FC<{ children: React.ReactNode }> = () => {
  const { isDarkMode, toggleDarkMode } = useInventory();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'add-product', label: 'Novo Produto', icon: PlusCircle },
    { id: 'movements', label: 'Movimentações', icon: ArrowRightLeft },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductList />;
      case 'add-product':
        return <ProductForm />;
      case 'movements':
        return <MovementForm />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <body className="bg-white text-black dark:bg-gray-900 dark:text-white">
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <nav className="bg-white dark:bg-gray-800 shadow-md fixed w-full z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white mr-8">
                  Sistema de Estoque
                </h1>
                {/* Botão do menu mobile */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden text-gray-800 dark:text-white p-2"
                >
                  {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
                {/* Navegação normal */}
                <div className="hidden md:flex space-x-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id as Page)}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                          ${currentPage === item.id
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
          {/* Menu Mobile */}
          {menuOpen && (
            <div className="md:hidden bg-white dark:bg-gray-800 shadow-md">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id as Page);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center px-4 py-2 w-full text-left text-sm font-medium transition-colors
                      ${currentPage === item.id
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </nav>
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pt-20">
          {renderPage()}
        </main>
      </div>
    </div>
    </body>
  );
};

function App() {
  return (
    <InventoryProvider>
      <Layout>
        <div className="space-y-8">
          <Dashboard />
        </div>
      </Layout>
      <Toaster position="top-right" />
    </InventoryProvider>
  );
}

export default App;
