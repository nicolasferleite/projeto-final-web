const loginForm = document.getElementById('loginForm');


loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  
  const identifier = event.target.usuario.value;
  const password = event.target.senha.value;

 
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
      
      console.log('Login realizado com sucesso:', data);

      
      localStorage.setItem('token', data.jwt);

      
      window.location.href = 'main.html';
    } else {
      
      console.error('Erro no login:', data);
      alert('Usuário ou senha inválidos!');
    }
  } catch (error) {
    console.error('Erro na requisição de login:', error);
    alert('Ocorreu um erro ao tentar fazer login. Tente novamente.');
  }
});
