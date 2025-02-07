import { defineConfig } from 'vite';  // Importa a função defineConfig do Vite para definir a configuração do projeto.
import react from '@vitejs/plugin-react';  // Importa o plugin React para Vite, que oferece suporte a JSX e Fast Refresh para React.

// https://vitejs.dev/config/ - Link para a documentação de configuração do Vite.

export default defineConfig({
  plugins: [react()],  // Adiciona o plugin React ao projeto Vite, permitindo suporte a JSX e Hot Module Replacement (HMR).
  
  optimizeDeps: {
    exclude: ['lucide-react'],  // Exclui o pacote 'lucide-react' da otimização de dependências do Vite. Isso pode ser feito para evitar problemas de incompatibilidade ou para melhorar o tempo de inicialização durante o desenvolvimento.
  },
});
