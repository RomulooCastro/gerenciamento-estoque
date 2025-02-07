import React, { useState } from 'react'; // Importando React e useState para gerenciar estado
import { useInventory } from '../context/InventoryContext'; // Importando hook personalizado para manipular o inventário

// Componente para exibir o formulário de adição de produto
export const ProductForm: React.FC = () => {
  // Recuperando a função addProduct do contexto InventoryContext
  const { addProduct } = useInventory();

  // Definindo o estado inicial do formulário
  const [formData, setFormData] = useState({
    name: '', // Nome do produto
    code: '', // Código do produto
    quantity: 0, // Quantidade em estoque
    category: '', // Categoria do produto
    supplier: '', // Fornecedor
    minQuantity: 0, // Quantidade mínima em estoque
    purchasePrice: 0, // Preço de compra do produto
    salePrice: 0, // Preço de venda do produto
  });

  // Função chamada ao submeter o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão de submissão de formulário
    addProduct(formData); // Chama a função addProduct para adicionar o produto ao inventário
    setFormData({ // Reseta os dados do formulário após a submissão
      name: '',
      code: '',
      quantity: 0,
      category: '',
      supplier: '',
      minQuantity: 0,
      purchasePrice: 0,
      salePrice: 0,
    });
  };

  // Função para lidar com a mudança dos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Atualiza o estado do formulário com base no campo alterado
    setFormData(prev => ({
      ...prev,
      [name]: ['quantity', 'minQuantity', 'purchasePrice', 'salePrice'].includes(name) 
        ? parseFloat(value) || 0  // Para campos numéricos, converte para float
        : value,  // Para outros campos, mantém o valor como string
    }));
  };

  // Função para formatar valores numéricos como moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Função para calcular o lucro e a margem de lucro
  const calculateProfit = () => {
    const profit = formData.salePrice - formData.purchasePrice; // Lucro é a diferença entre o preço de venda e o de compra
    const margin = formData.purchasePrice > 0 
      ? (profit / formData.purchasePrice) * 100 // Margem de lucro é calculada em percentual
      : 0;
    return {
      profit, // Retorna o lucro
      margin: margin.toFixed(2) // Retorna a margem de lucro com duas casas decimais
    };
  };

  const profitInfo = calculateProfit(); // Chama a função para calcular lucro e margem

  return (
    <div className="p-6">
      {/* Título do formulário */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Adicionar Produto</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        {/* Campos do formulário para preencher as informações do produto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome do Produto
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange} // Chama a função handleChange para atualizar o estado
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Código
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantidade Inicial
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Outros campos para quantidade mínima, preço de compra e venda, categoria, fornecedor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantidade Mínima
            </label>
            <input
              type="number"
              name="minQuantity"
              value={formData.minQuantity}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preço de Compra
            </label>
            <input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preço de Venda
            </label>
            <input
              type="number"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Categoria
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fornecedor
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Exibe as informações de lucro e margem */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lucro por Unidade</p>
              <p className={`text-lg font-semibold ${profitInfo.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(profitInfo.profit)} {/* Exibe o lucro formatado */}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Margem de Lucro</p>
              <p className={`text-lg font-semibold ${profitInfo.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitInfo.margin}% {/* Exibe a margem de lucro */}
              </p>
            </div>
          </div>
        </div>

        {/* Botão para adicionar o produto */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Adicionar Produto
          </button>
        </div>
      </form>
    </div>
  );
};
