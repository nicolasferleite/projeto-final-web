// Seleciona o formulário pelo ID
const registroForm = document.getElementById('registroForm');

registroForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Impede o comportamento padrão do form (recarregar a página)

  // Captura os valores dos inputs
  const tipoUsuario = event.target.tipoUsuario.value; // "Professor", "Aluno" ou "Administrador"
  const nome = event.target.nome.value;
  const email = event.target.email.value;
  const senha = event.target.senha.value;
  const confirmarSenha = event.target.confirmarSenha.value;

  // Verifica se as senhas conferem
  if (senha !== confirmarSenha) {
    alert('As senhas não conferem!');
    return;
  }

  // Monta o corpo da requisição
  // Lembre-se: para o Strapi, o campo "username" é obrigatório no registro
  const bodyData = {
    username: nome,    // usando "nome" como "username" no Strapi
    email: email,
    password: senha
  };

  // Se você tiver um campo customizado para "tipoUsuario" no seu modelo de User,
  // você pode adicionar aqui. Exemplo:
  // bodyData.tipoUsuario = tipoUsuario;

  try {
    // Envia requisição para o endpoint de registro do Strapi
    const response = await fetch('http://localhost:1337/api/auth/local/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    const data = await response.json();

    if (response.ok) {
      // Registro bem-sucedido
      console.log('Registro realizado com sucesso:', data);

      // 'data.jwt' é o token JWT retornado pelo Strapi
      // 'data.user' é o objeto do usuário recém-criado
      const token = data.jwt;
      localStorage.setItem('token', token);

      alert('Usuário registrado com sucesso!');
      // Redireciona para alguma página de login ou dashboard
      // window.location.href = 'login.html';
    } else {
      // Se não for 2xx, houve erro
      console.error('Erro ao registrar usuário:', data);
      alert('Erro ao registrar usuário: ' + (data.error?.message || data.message));
    }
  } catch (error) {
    console.error('Erro na requisição de registro:', error);
    alert('Ocorreu um erro inesperado. Tente novamente.');
  }
});