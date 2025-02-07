// Importa o módulo StrictMode do React, que ajuda a identificar problemas no código durante o desenvolvimento.
import { StrictMode } from 'react';

// Importa o método createRoot do ReactDOM para renderizar o aplicativo.
import { createRoot } from 'react-dom/client';

// Importa o componente principal do aplicativo.
import App from './App.tsx';

// Importa o arquivo de estilos principais do aplicativo.
import './index.css';

// Cria a raiz de renderização do React no elemento HTML com o id 'root' e renderiza o aplicativo.
createRoot(document.getElementById('root')!).render(
  // Envolvem o componente App com StrictMode, que ativa verificações adicionais e avisos durante o desenvolvimento.
  <StrictMode>
    <App />
  </StrictMode>
);
