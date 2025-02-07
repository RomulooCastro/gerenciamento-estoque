import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, Movement } from '../types';
import { generateId } from '../utils/helpers';
import toast from 'react-hot-toast';

interface InventoryContextType {
  products: Product[];
  movements: Movement[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addMovement: (movement: Omit<Movement, 'id' | 'date'>) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  const [movements, setMovements] = useState<Movement[]>(() => {
    const saved = localStorage.getItem('movements');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('movements', JSON.stringify(movements));
  }, [movements]);

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
  

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
    toast.success('Produto adicionado com sucesso!');
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, ...productData, updatedAt: new Date().toISOString() }
        : product
    ));
    toast.success('Produto atualizado com sucesso!');
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast.success('Produto removido com sucesso!');
  };

  const addMovement = (movementData: Omit<Movement, 'id' | 'date'>) => {
    const newMovement: Movement = {
      ...movementData,
      id: generateId(),
      date: new Date().toISOString(),
    };

    const product = products.find(p => p.id === movementData.productId);
    if (!product) return;

    let newQuantity = product.quantity;
    if (movementData.type === 'IN') {
      newQuantity += movementData.quantity;
    } else {
      newQuantity -= movementData.quantity;
    }

    if (newQuantity < 0) {
      toast.error('Quantidade insuficiente em estoque!');
      return;
    }

    updateProduct(product.id, { quantity: newQuantity });
    setMovements([...movements, newMovement]);
    
    if (newQuantity <= product.minQuantity) {
      toast.error(`Alerta: Estoque baixo para ${product.name}!`);
    }
  };

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
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};