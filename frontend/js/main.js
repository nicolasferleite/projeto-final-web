async function carregarGuias() {
    try {
      // URL da API; ajuste se necessário (ex.: domínio ou porta)
      const response = await fetch('http://localhost:1337/api/guias-didaticos');
      const json = await response.json();
      // Aqui o array de guias vem diretamente em json.data
      const guias = json.data;
  
      // Seleciona o container onde os guias serão inseridos
      const container = document.querySelector('.guias');
  
      // Mantém o título fixo; se quiser recriar, descomente a linha abaixo
      // container.innerHTML = '<h2>🌱 Guias 🌱</h2>';
  
      // Para cada guia, cria a estrutura HTML e insere no container
      guias.forEach(item => {
        // Como os campos estão diretamente no objeto, acessamos assim:
        const titulo = item.titulo;
        const conteudo = item.conteudo;
        const dataGuia = item.data;
  
        // Cria um link que envolverá cada guia
        const link = document.createElement('a');
        link.classList.add('link');
        // Defina link.href se desejar direcionar para outra página
  
        // Cria a div com a classe "guia"
        const guiaDiv = document.createElement('div');
        guiaDiv.classList.add('guia');
  
        // Cria o título do guia
        const h3 = document.createElement('h3');
        h3.textContent = titulo;
  
        // Cria um parágrafo para a data
        const pData = document.createElement('p');
        pData.textContent = Data: ${dataGuia || 'Não informada'};
  
        // Cria um parágrafo para o conteúdo
        const pConteudo = document.createElement('p');
        pConteudo.textContent = conteudo;
  
        // Monta a estrutura: adiciona os elementos à div e depois a div ao link
        guiaDiv.appendChild(h3);
        guiaDiv.appendChild(pData);
        guiaDiv.appendChild(pConteudo);
        link.appendChild(guiaDiv);
  
        // Adiciona o link ao container dos guias
        container.appendChild(link);
      });
    } catch (error) {
      console.error('Erro ao carregar guias:', error);
    }
  }
  
  // Executa a função quando o conteúdo do DOM estiver carregado
  window.addEventListener('DOMContentLoaded', carregarGuias);
  
  // Configuração do botão de logout
  document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });