// Seleciona o formulário pelo ID
const loginForm = document.getElementById('loginForm');

// Adiciona um ouvinte de evento para o 'submit'
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Impede o comportamento padrão (recarregar a página)

  // Captura os valores dos inputs
  const identifier = event.target.usuario.value; // Pode ser email ou username
  const password = event.target.senha.value;

  // Faz a requisição de login para o Strapi
  try {
    const response = await fetch('http://localhost:1337/api/auth/local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: identifier,
        password: password
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Se o login deu certo, 'data' deve conter { jwt, user }
      console.log('Login realizado com sucesso:', data);

      // Armazena o token JWT (opcionalmente, você pode usar sessionStorage ou cookies)
      localStorage.setItem('token', data.jwt);

      // Redireciona para a página principal (ou outra rota)
      window.location.href = 'main.html';
    } else {
      // Em caso de erro (usuário não encontrado, senha errada, etc.)
      console.error('Erro no login:', data);
      alert('Usuário ou senha inválidos!');
    }
  } catch (error) {
    console.error('Erro na requisição de login:', error);
    alert('Ocorreu um erro ao tentar fazer login. Tente novamente.');
  }
});