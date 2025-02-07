export interface Product {
  id: string;
  name: string;
  code: string;
  quantity: number;
  category: string;
  supplier: string;
  minQuantity: number;
  purchasePrice: number;
  salePrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Movement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  description: string;
  unitPrice: number;
  total: number;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  totalQuantity: number;
  totalPurchases: number;
  totalSales: number;
  profit: number;
  recentMovements: Movement[];
}