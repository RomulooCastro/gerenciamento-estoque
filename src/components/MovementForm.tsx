import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';

export const MovementForm: React.FC = () => {
  const { products, addMovement } = useInventory();
  const [formData, setFormData] = useState({
    productId: '',
    type: 'IN',
    quantity: 0,
    description: '',
    unitPrice: 0,
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(formData.quantity * formData.unitPrice);
  }, [formData.quantity, formData.unitPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMovement({
      ...formData,
      type: formData.type as 'IN' | 'OUT', // Garante o tipo correto
      total,
    });
    setFormData({
      productId: '',
      type: 'IN', // Mantém o tipo correto
      quantity: 0,
      description: '',
      unitPrice: 0,
    });
  };
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['quantity', 'unitPrice'].includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  const selectedProduct = products.find(p => p.id === formData.productId);

  useEffect(() => {
    if (selectedProduct && formData.type) {
      setFormData(prev => ({
        ...prev,
        unitPrice: formData.type === 'IN' ? 
          selectedProduct.purchasePrice || 0 : 
          selectedProduct.salePrice || 0
      }));
    }
  }, [formData.type, formData.productId, selectedProduct]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Registrar Movimentação</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Produto
            </label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Selecione um produto</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} (Em estoque: {product.quantity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo de Movimentação
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="IN">Compra (Entrada)</option>
              <option value="OUT">Venda (Saída)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantidade
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              step="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preço Unitário
            </label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Total da Movimentação: {' '}
            <span className={`text-xl ${formData.type === 'OUT' ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(total)}
            </span>
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Registrar Movimentação
          </button>
        </div>
      </form>
    </div>
  );
};