import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { Package, AlertTriangle, TrendingUp, TrendingDown, DollarSign, ShoppingCart } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { products, movements } = useInventory();

  const calculateFinancials = () => {
    const totalPurchases = movements
      .filter(m => m.type === 'IN')
      .reduce((acc, curr) => acc + curr.total, 0);
    
    const totalSales = movements
      .filter(m => m.type === 'OUT')
      .reduce((acc, curr) => acc + curr.total, 0);
    
    return {
      totalPurchases,
      totalSales,
      profit: totalSales - totalPurchases
    };
  };

  const stats = {
    totalProducts: products.length,
    lowStockProducts: products.filter(p => p.quantity <= p.minQuantity).length,
    totalQuantity: products.reduce((acc, curr) => acc + curr.quantity, 0),
    ...calculateFinancials(),
    recentMovements: movements.slice(-5).reverse(),
  };

  const getFinancialData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayMovements = movements.filter(m => m.date.startsWith(date));
      const sales = dayMovements
        .filter(m => m.type === 'OUT')
        .reduce((acc, curr) => acc + curr.total, 0);
      const purchases = dayMovements
        .filter(m => m.type === 'IN')
        .reduce((acc, curr) => acc + curr.total, 0);
      
      return {
        date: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }),
        vendas: sales,
        compras: purchases,
        lucro: sales - purchases
      };
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estoque Crítico</p>
              <p className="text-2xl font-bold text-red-600">{stats.lowStockProducts}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Vendas Totais</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalSales)}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lucro Total</p>
              <p className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(stats.profit)}
              </p>
            </div>
            <DollarSign className={`h-8 w-8 ${stats.profit >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Desempenho Financeiro (7 dias)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getFinancialData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompras" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="vendas" 
                  stroke="#10B981" 
                  fillOpacity={1} 
                  fill="url(#colorVendas)" 
                  name="Vendas"
                />
                <Area 
                  type="monotone" 
                  dataKey="compras" 
                  stroke="#EF4444" 
                  fillOpacity={1} 
                  fill="url(#colorCompras)" 
                  name="Compras"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Últimas Movimentações</h3>
          <div className="space-y-4">
            {stats.recentMovements.map(movement => {
              const product = products.find(p => p.id === movement.productId);
              return (
                <div key={movement.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {movement.type === 'IN' ? (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{product?.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{movement.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${movement.type === 'OUT' ? 'text-green-600' : 'text-red-600'}`}>
                      {movement.type === 'OUT' ? '+' : '-'}{formatCurrency(movement.total)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(movement.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};