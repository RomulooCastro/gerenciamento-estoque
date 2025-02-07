//Estado formData: Armazena os dados do formulário (produto, tipo de movimentação, quantidade, preço unitário e descrição).
//Estado total: Calcula o total da movimentação, multiplicando a quantidade pelo preço unitário.
//Função handleSubmit: Envia os dados do formulário para o contexto (adicione a movimentação) e limpa os campos após o envio.
//Função handleChange: Atualiza o estado do formulário sempre que um campo for alterado.
//Função useEffect: Atualiza o total e o preço unitário dependendo da quantidade, tipo de movimentação e produto selecionado.
//Função formatCurrency: Formata o valor total como moeda brasileira.

import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';

export const MovementForm: React.FC = () => {
  // Acesso aos produtos e função para adicionar movimentação do contexto
  const { products, addMovement } = useInventory();
  
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    productId: '',  // ID do produto
    type: 'IN',     // Tipo de movimentação (IN para entrada, OUT para saída)
    quantity: 0,    // Quantidade movimentada
    description: '', // Descrição da movimentação
    unitPrice: 0,    // Preço unitário do produto
  });

  // Estado para calcular o total da movimentação
  const [total, setTotal] = useState(0);

  // UseEffect para atualizar o total sempre que a quantidade ou o preço unitário mudar
  useEffect(() => {
    setTotal(formData.quantity * formData.unitPrice);
  }, [formData.quantity, formData.unitPrice]);

  // Função para tratar o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário

    // Adiciona a movimentação ao contexto, incluindo o total calculado
    addMovement({
      ...formData,
      type: formData.type as 'IN' | 'OUT', // Garante que o tipo seja IN ou OUT
      total, // Calcula o total da movimentação
    });

    // Reseta os campos do formulário após o envio
    setFormData({
      productId: '',
      type: 'IN', // Retorna para a entrada como tipo padrão
      quantity: 0,
      description: '',
      unitPrice: 0,
    });
  };

  // Função para atualizar o estado do formulário conforme os campos são alterados
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Para os campos de quantidade e preço, converte o valor para número
      [name]: ['quantity', 'unitPrice'].includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  // Seleciona o produto correspondente ao ID selecionado no formulário
  const selectedProduct = products.find(p => p.id === formData.productId);

  // UseEffect para atualizar o preço unitário com base no tipo de movimentação (compra ou venda)
  useEffect(() => {
    if (selectedProduct && formData.type) {
      setFormData(prev => ({
        ...prev,
        unitPrice: formData.type === 'IN' ? 
          selectedProduct.purchasePrice || 0 :  // Se for entrada, usa o preço de compra
          selectedProduct.salePrice || 0       // Se for saída, usa o preço de venda
      }));
    }
  }, [formData.type, formData.productId, selectedProduct]);

  // Função para formatar o valor como moeda (R$)
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
          {/* Campo para selecionar o produto */}
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
              {/* Mapeia os produtos para as opções no select */}
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} (Em estoque: {product.quantity})
                </option>
              ))}
            </select>
          </div>

          {/* Campo para selecionar o tipo de movimentação (entrada ou saída) */}
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

          {/* Campo para informar a quantidade do produto */}
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

          {/* Campo para informar o preço unitário */}
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

          {/* Campo para a descrição da movimentação */}
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

        {/* Exibe o total da movimentação (entrada ou saída) */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Total da Movimentação: {' '}
            <span className={`text-xl ${formData.type === 'OUT' ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(total)}
            </span>
          </p>
        </div>

        {/* Botão para registrar a movimentação */}
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
