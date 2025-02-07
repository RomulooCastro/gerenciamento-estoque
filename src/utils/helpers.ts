// Função para gerar um ID aleatório único (com base em números e letras)
export const generateId = () => {
  // Gera um número aleatório, converte para base 36 (usando letras e números), 
  // e então pega uma substring a partir da posição 2 para excluir o "0." do início.
  return Math.random().toString(36).substr(2, 9);
};

// Função para formatar uma data no formato brasileiro (pt-BR)
export const formatDate = (date: string) => {
  // Cria um novo objeto Date a partir da string de data passada e formata para pt-BR
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',     // Exibe o dia com 2 dígitos (ex: 01, 02, etc.)
    month: '2-digit',   // Exibe o mês com 2 dígitos (ex: 01, 02, etc.)
    year: 'numeric',    // Exibe o ano de forma numérica (ex: 2025)
    hour: '2-digit',    // Exibe a hora com 2 dígitos (ex: 09, 10, etc.)
    minute: '2-digit',  // Exibe os minutos com 2 dígitos (ex: 09, 10, etc.)
  });
};

// Função para exportar dados para um arquivo CSV
export const exportToCSV = (data: any[], filename: string) => {
  // Extrai as chaves do primeiro objeto da lista para usar como cabeçalho do CSV
  const headers = Object.keys(data[0]);
  
  // Cria o conteúdo do CSV combinando o cabeçalho com as linhas de dados
  const csvContent = [
    headers.join(','),  // Cabeçalho: lista de campos separados por vírgula
    ...data.map(row => headers.map(header => row[header]).join(',')) // Dados: cada linha no formato CSV
  ].join('\n');  // Junta tudo com novas linhas

  // Cria um Blob com o conteúdo CSV para download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Cria um link temporário para o download do arquivo CSV
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);  // Cria o URL para o Blob
  link.download = `${filename}.csv`;      // Define o nome do arquivo para o download
  link.click();  // Simula um clique no link para iniciar o download
};
