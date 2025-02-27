const registroForm = document.getElementById('registroForm');

registroForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const roleId = document.querySelector('input[name="tipoUsuario"]:checked').value;
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;

  if (senha !== confirmarSenha) {
    alert('As senhas não conferem!');
    return;
  }

  const userData = {
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
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro ao registrar usuário:', data);
      alert('Erro ao registrar usuário: ' + (data.error?.message || data.message));
      return;
    }

    console.log('Usuário registrado com sucesso:', data);

    const userId = data.user.id;
    const token = data.jwt;
    localStorage.setItem('token', token);
    localStorage.setItem('id', userId);

    const roleUpdateResponse = await fetch(`http://localhost:1337/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role: roleId })
    });

    const roleUpdateData = await roleUpdateResponse.json();

    if (!roleUpdateResponse.ok) {
      console.error('Erro ao atualizar role:', roleUpdateData);
      alert('Usuário criado, mas erro ao definir a role.');
    } else {
      console.log('Role atualizada com sucesso:', roleUpdateData);
    }

    alert('Usuário registrado com sucesso!');
    window.location.href = 'telalogin.html';

  } catch (error) {
    console.error('Erro na requisição de registro:', error);
    alert('Ocorreu um erro inesperado. Tente novamente.');
  }
});
