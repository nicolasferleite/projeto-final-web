async function login(iden, pass) {
  try {
    const response = await fetch('http://localhost:1337/api/auth/local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: iden,
        password: pass
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro desconhecido ao fazer login');
    }

    return data;
  } catch (error) {
    console.error('Erro na requisição de login:', error);
    alert(`Erro: ${error.message}`);
    return null;
  }
}

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const identifier = document.getElementById('usuario').value;
  const password = document.getElementById('senha').value;

  const data = await login(identifier, password);

  if (data && data.jwt) {
    console.log('Login realizado com sucesso:', data);

    
    localStorage.setItem('token', data.jwt);
    localStorage.setItem('id', data.user.id);

    
    window.location.href = 'main.html';
  } else {
    alert('Usuário ou senha inválidos!');
  }
});
