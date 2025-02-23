async function carregarGuias() {
    try {
      
      const response = await fetch('http://localhost:1337/api/guias-didaticos');
      const json = await response.json();
     
      const guias = json.data;
  
      
      const container = document.querySelector('.guias');
  
  
      
      guias.forEach(item => {
        
        const titulo = item.titulo;
        const conteudo = item.conteudo;
        const dataGuia = item.data;
  
        
        const link = document.createElement('a');
        link.classList.add('link');
        
  
        
        const guiaDiv = document.createElement('div');
        guiaDiv.classList.add('guia');
  
       
        const h3 = document.createElement('h3');
        h3.textContent = titulo;
  
        
        const pData = document.createElement('p');
        pData.textContent = Data: ${dataGuia || 'Não informada'};
  
        
        const pConteudo = document.createElement('p');
        pConteudo.textContent = conteudo;
  
        
        guiaDiv.appendChild(h3);
        guiaDiv.appendChild(pData);
        guiaDiv.appendChild(pConteudo);
        link.appendChild(guiaDiv);
  
        
        container.appendChild(link);
      });
    } catch (error) {
      console.error('Erro ao carregar guias:', error);
    }
  }
  
  
  window.addEventListener('DOMContentLoaded', carregarGuias);
  
  // Configuração do botão de logout
  document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });
