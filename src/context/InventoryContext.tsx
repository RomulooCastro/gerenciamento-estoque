//InventoryContext: Gerencia o estado global do inventário, que inclui produtos, movimentos de estoque e a configuração do modo escuro.
//addProduct, updateProduct, deleteProduct: Funções para manipular os produtos no estado. 
//addMovement: Adiciona movimentos (entradas ou saídas de produtos) e ajusta a quantidade de estoque.
//toggleDarkMode: Alterna entre modo escuro e claro.
//Persistência no localStorage: Armazena os produtos, movimentos e a configuração do modo escuro no localStorage para manter os dados entre as sessões.


import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, Movement } from '../types'; // Importa os tipos de dados definidos para Produto e Movimento.
import { generateId } from '../utils/helpers'; // Importa uma função para gerar IDs únicos.
import toast from 'react-hot-toast'; // Importa o sistema de notificações via toast.

interface InventoryContextType { // Define a tipagem para o contexto de inventário.
  products: Product[]; // Lista de produtos.
  movements: Movement[]; // Lista de movimentos (entrada/saída de produtos).
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void; // Função para adicionar produto.
  updateProduct: (id: string, product: Partial<Product>) => void; // Função para atualizar um produto.
  deleteProduct: (id: string) => void; // Função para deletar um produto.
  addMovement: (movement: Omit<Movement, 'id' | 'date'>) => void; // Função para adicionar movimento.
  isDarkMode: boolean; // Estado para verificar se o modo escuro está ativado.
  toggleDarkMode: () => void; // Função para alternar entre modo claro e escuro.
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined); // Criação do contexto para gerenciar o inventário.

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hook de estado para armazenar os produtos. Ao inicializar, tenta carregar do localStorage.
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  // Hook de estado para armazenar os movimentos (entradas e saídas de produtos).
  const [movements, setMovements] = useState<Movement[]>(() => {
    const saved = localStorage.getItem('movements');
    return saved ? JSON.parse(saved) : [];
  });

  // Hook de estado para armazenar o estado do modo escuro (dark mode).
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Efetua a persistência dos produtos no localStorage sempre que a lista de produtos mudar.
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Efetua a persistência dos movimentos no localStorage sempre que a lista de movimentos mudar.
  useEffect(() => {
    localStorage.setItem('movements', JSON.stringify(movements));
  }, [movements]);

  // Atualiza o localStorage e aplica o tema (modo escuro ou claro) no DOM.
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      console.log('Modo escuro ativado');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('Modo claro ativado');
    }
  }, [isDarkMode]);

  // Função para adicionar um novo produto, gerando um ID único e as datas de criação e atualização.
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]); // Adiciona o novo produto ao estado.
    toast.success('Produto adicionado com sucesso!'); // Exibe uma notificação de sucesso.
  };

  // Função para atualizar um produto existente.
  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, ...productData, updatedAt: new Date().toISOString() }
        : product
    ));
    toast.success('Produto atualizado com sucesso!'); // Exibe uma notificação de sucesso.
  };

  // Função para deletar um produto, removendo-o do estado.
  const deleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast.success('Produto removido com sucesso!'); // Exibe uma notificação de sucesso.
  };

  // Função para adicionar um movimento (entrada ou saída de produto) e ajustar o estoque.
  const addMovement = (movementData: Omit<Movement, 'id' | 'date'>) => {
    const newMovement: Movement = {
      ...movementData,
      id: generateId(),
      date: new Date().toISOString(),
    };

    const product = products.find(p => p.id === movementData.productId); // Encontra o produto relacionado ao movimento.
    if (!product) return; // Se o produto não existir, não faz nada.

    let newQuantity = product.quantity;
    if (movementData.type === 'IN') {
      newQuantity += movementData.quantity; // Aumenta o estoque se for uma entrada.
    } else {
      newQuantity -= movementData.quantity; // Diminui o estoque se for uma saída.
    }

    if (newQuantity < 0) {
      toast.error('Quantidade insuficiente em estoque!'); // Exibe um erro se não houver estoque suficiente.
      return;
    }

    updateProduct(product.id, { quantity: newQuantity }); // Atualiza o produto com a nova quantidade.
    setMovements([...movements, newMovement]); // Adiciona o movimento à lista de movimentos.

    if (newQuantity <= product.minQuantity) {
      toast.error(`Alerta: Estoque baixo para ${product.name}!`); // Exibe um alerta se o estoque estiver baixo.
    }
  };

  // Função para alternar entre modo escuro e claro.
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <InventoryContext.Provider value={{
      products,
      movements,
      addProduct,
      updateProduct,
      deleteProduct,
      addMovement,
      isDarkMode,
      toggleDarkMode,
    }}>
      {children}
    </InventoryContext.Provider> // Envolvendo os filhos com o contexto para fornecer os valores.
  );
};

// Hook customizado para acessar o contexto de inventário em outros componentes.
export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider'); // Lança um erro se tentar usar fora do provedor.
  }
  return context; // Retorna o contexto de inventário.
};
