const registroForm = document.getElementById('registroForm');

registroForm.addEventListener('submit', async (event) => {
  event.preventDefault(); 

 
  const tipoUsuario = event.target.tipoUsuario.value; 
  const nome = event.target.nome.value;
  const email = event.target.email.value;
  const senha = event.target.senha.value;
  const confirmarSenha = event.target.confirmarSenha.value;

  
  if (senha !== confirmarSenha) {
    alert('As senhas não conferem!');
    return;
  }

  
  const bodyData = {
    username: nome, 
    email: email,
    password: senha
  };


  try {
    
    const response = await fetch('http://localhost:1337/api/auth/local/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    const data = await response.json();

    if (response.ok) {
      
      console.log('Registro realizado com sucesso:', data);

      const token = data.jwt;
      localStorage.setItem('token', token);

      alert('Usuário registrado com sucesso!');
      
    } else {
      console.error('Erro ao registrar usuário:', data);
      alert('Erro ao registrar usuário: ' + (data.error?.message || data.message));
    }
  } catch (error) {
    console.error('Erro na requisição de registro:', error);
    alert('Ocorreu um erro inesperado. Tente novamente.');
  }
});
