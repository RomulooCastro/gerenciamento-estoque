// Define a estrutura de dados para um Produto
export interface Product {
  id: string;            // Identificador único do produto
  name: string;          // Nome do produto
  code: string;          // Código do produto (ex: código de barras ou SKU)
  quantity: number;      // Quantidade disponível no estoque
  category: string;      // Categoria do produto (ex: Eletrônicos, Roupas, etc.)
  supplier: string;      // Nome do fornecedor do produto
  minQuantity: number;   // Quantidade mínima do produto no estoque antes de fazer um novo pedido
  purchasePrice: number; // Preço de compra do produto
  salePrice: number;     // Preço de venda do produto
  createdAt: string;     // Data de criação do produto (geralmente no formato ISO 8601)
  updatedAt: string;     // Data de última atualização do produto (geralmente no formato ISO 8601)
}

// Define a estrutura de dados para um Movimento de Estoque
export interface Movement {
  id: string;            // Identificador único do movimento
  productId: string;     // ID do produto relacionado ao movimento
  type: 'IN' | 'OUT';    // Tipo de movimento: 'IN' para entrada no estoque, 'OUT' para saída do estoque
  quantity: number;      // Quantidade movida (positiva para entrada, negativa para saída)
  date: string;          // Data do movimento (geralmente no formato ISO 8601)
  description: string;   // Descrição do movimento (ex: "Compra de fornecedor", "Venda para cliente")
  unitPrice: number;     // Preço unitário do produto no momento do movimento
  total: number;         // Valor total do movimento (quantidade * preço unitário)
}

// Define as estatísticas do Dashboard para o gerenciamento do estoque
export interface DashboardStats {
  totalProducts: number;      // Total de produtos no estoque
  lowStockProducts: number;   // Número de produtos com estoque abaixo do mínimo
  totalQuantity: number;      // Quantidade total de produtos no estoque
  totalPurchases: number;     // Total de compras realizadas (quantidade ou valor)
  totalSales: number;         // Total de vendas realizadas (quantidade ou valor)
  profit: number;             // Lucro total (geralmente vendas - compras)
  recentMovements: Movement[]; // Lista dos movimentos mais recentes no estoque
}
