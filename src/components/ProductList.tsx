import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext'; // Importando o contexto de inventário para acessar os produtos e a função de deletar produtos
import { Edit, Trash2, Download } from 'lucide-react'; // Ícones para editar, excluir e exportar
import { exportToCSV } from '../utils/helpers'; // Função para exportar os dados para CSV

export const ProductList: React.FC = () => {
  const { products, deleteProduct } = useInventory(); // Obtendo produtos e a função de deletar produto do contexto
  const [search, setSearch] = useState(''); // Estado para armazenar o valor da busca
  const [category, setCategory] = useState(''); // Estado para armazenar a categoria selecionada
  const [showLowStock, setShowLowStock] = useState(false); // Estado para controlar a exibição de produtos com estoque baixo

  const categories = Array.from(new Set(products.map(p => p.category))); // Gerando lista única de categorias a partir dos produtos

  // Filtrando os produtos com base nos critérios de pesquisa, categoria e estoque baixo
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                         product.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === '' || product.category === category;
    const matchesLowStock = !showLowStock || product.quantity <= product.minQuantity;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  // Função para exportar os dados para um arquivo CSV
  const handleExport = () => {
    exportToCSV(products, 'produtos');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Produtos</h2>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </button>
      </div>

      {/* Filtros de busca, categoria e estoque baixo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar produtos..."
          className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Atualizando o estado da busca
        />
        <select
          className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)} // Atualizando o estado da categoria selecionada
        >
          <option value="">Todas as categorias</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option> // Gerando as opções de categoria
          ))}
        </select>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="lowStock"
            className="mr-2"
            checked={showLowStock}
            onChange={(e) => setShowLowStock(e.target.checked)} // Atualizando o estado para mostrar ou não produtos com estoque baixo
          />
          <label htmlFor="lowStock" className="text-gray-700 dark:text-gray-300">
            Mostrar apenas estoque baixo
          </label>
        </div>
      </div>

      {/* Tabela com a lista de produtos filtrados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Quantidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Fornecedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {product.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${product.quantity <= product.minQuantity
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                    {product.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {product.supplier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                    onClick={() => {/* TODO: Implement edit */}} // Ação de edição (pendente)
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    onClick={() => deleteProduct(product.id)} // Chamando a função para deletar o produto
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
