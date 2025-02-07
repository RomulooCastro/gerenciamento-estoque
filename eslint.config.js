// Importa o pacote '@eslint/js' que fornece as regras padrão do ESLint para JavaScript.
import js from '@eslint/js';

// Importa o objeto 'globals' que define os ambientes globais para o ESLint.
import globals from 'globals';

// Importa o plugin 'eslint-plugin-react-hooks' que fornece regras para garantir boas práticas no uso de hooks do React.
import reactHooks from 'eslint-plugin-react-hooks';

// Importa o plugin 'eslint-plugin-react-refresh' que fornece regras relacionadas ao React Fast Refresh.
import reactRefresh from 'eslint-plugin-react-refresh';

// Importa a configuração do ESLint para TypeScript a partir do pacote 'typescript-eslint'.
import tseslint from 'typescript-eslint';

// Exporta a configuração do ESLint para o TypeScript, utilizando o 'tseslint.config'.
export default tseslint.config(
  // Especifica diretórios ou arquivos a serem ignorados, neste caso a pasta 'dist'.
  { ignores: ['dist'] },
  
  // Configuração geral do ESLint para o TypeScript, incluindo regras recomendadas.
  {
    // Estende as configurações padrão recomendadas para JavaScript e TypeScript.
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    
    // Define os tipos de arquivos que serão verificados pelo ESLint.
    files: ['**/*.{ts,tsx}'],
    
    // Configura as opções do ESLint para especificar a versão ECMAScript e os ambientes globais.
    languageOptions: {
      ecmaVersion: 2020, // Define a versão ECMAScript para 2020.
      globals: globals.browser, // Define o ambiente global como sendo de navegador.
    },
    
    // Define os plugins que serão utilizados para regras específicas.
    plugins: {
      'react-hooks': reactHooks, // Utiliza o plugin 'react-hooks' para verificar práticas de hooks.
      'react-refresh': reactRefresh, // Utiliza o plugin 'react-refresh' para verificar a integração com React Fast Refresh.
    },
    
    // Define as regras do ESLint. Aqui, são incluídas as regras recomendadas dos hooks do React.
    rules: {
      ...reactHooks.configs.recommended.rules, // Aplica as regras recomendadas para hooks do React.
      
      // Adiciona uma regra do plugin 'react-refresh' para garantir que apenas componentes sejam exportados.
      'react-refresh/only-export-components': [
        'warn', // Define o nível da regra como 'warn', para emitir um aviso.
        { allowConstantExport: true }, // Permite exportações constantes.
      ],
    },
  }
);
