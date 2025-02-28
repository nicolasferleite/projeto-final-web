document.addEventListener('DOMContentLoaded', () => {
    carregarMateriais();
    verificarPermissaoProfessor();

    document.getElementById('newMaterialBtn').addEventListener('click', () => {
        document.getElementById('uploadForm').classList.toggle('hidden');
    });

    document.getElementById('materialForm').addEventListener('submit', handleMaterialSubmit);
});

async function carregarMateriais() {
    const materialsList = document.getElementById('materialsList');
    materialsList.innerHTML = '';

    const userLogadoId = localStorage.getItem('id');
    if (!userLogadoId) {
        materialsList.innerHTML = '<p>Você precisa estar logado para ver os materiais.</p>';
        return;
    }

    let ehProfessor = false;
    let ehAdmin = false;
    let materiaisDoProfessor = [];

    try {
        const res = await getOneUser(userLogadoId);
        const user = res.data;

        if (user.role.id === 3) {
            ehProfessor = true;

            const materiaisRes = await api.get(`/materiais-didaticos?filters[user][id][$eq]=${userLogadoId}`);
            materiaisDoProfessor = materiaisRes.data.data;
        } else if (user.role.id === 5) {
            ehAdmin = true;
        }
    } catch (error) {
        console.error('Erro ao buscar usuário e materiais do professor:', error);
        materialsList.innerHTML = '<p>Erro ao buscar informações do usuário.</p>';
        return;
    }

    try {
        const dados = await getAllMaterials();
        const materiais = dados?.data || [];

        materiais.forEach(material => {
            if (ehProfessor) {
                const materialDoProprioProfessor = materiaisDoProfessor.some(m => m.titulo === material.titulo);
                mostrarMaterial(material, materialDoProprioProfessor, false);
            } else if (ehAdmin) {
                mostrarMaterial(material, false, true);
            } else {
                mostrarMaterial(material, false, false);
            }
        });

    } catch (error) {
        console.error('Erro ao carregar materiais:', error);
        materialsList.innerHTML = '<p>Erro ao carregar materiais.</p>';
    }
}

function mostrarMaterial(material, podeGerenciar, podeExcluirComoAdmin = false) {
    const materialsList = document.getElementById('materialsList');

    const titulo = material.titulo || 'Sem título';
    const descricao = material.descricao || 'Sem descrição';
    const autorNome = material.user?.username || 'Você';

    const materialCard = document.createElement('div');
    materialCard.classList.add('material-card');

    materialCard.innerHTML = `
        <h3>${titulo}</h3>
        <p>${descricao}</p>
        <p><strong>Autor:</strong> ${autorNome}</p>
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    if (podeGerenciar) {
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.classList.add('btn-editar');
        btnEditar.onclick = () => editarMaterial(material.documentId, descricao);

        buttonContainer.appendChild(btnEditar);
    }

    if (podeGerenciar || podeExcluirComoAdmin) {
        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.classList.add('btn-excluir');
        btnExcluir.onclick = () => deletarMaterial(material.documentId);

        buttonContainer.appendChild(btnExcluir);
    }

    if (buttonContainer.children.length > 0) {
        materialCard.appendChild(buttonContainer);
    }

    materialsList.appendChild(materialCard);
}


async function verificarPermissaoProfessor() {
    const userLogadoId = localStorage.getItem('id');

    try {
        const res = await getOneUser(userLogadoId);
        const user = res.data;

        if (user.role.id === 3) {
            document.getElementById('newMaterialBtn').style.display = 'block';
        }
    } catch (error) {
        console.warn('Erro ao buscar dados do usuário:', error);
    }
}

async function handleMaterialSubmit(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const descricao = document.getElementById('descricao').value.trim();

    const userId = localStorage.getItem('id');
    if (!userId) {
        alert("Você precisa estar logado para criar um material!");
        return;
    }

    if (!titulo || !descricao) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }

    const payload = {
        data: {
            titulo,
            descricao,
            video_url: 'https://exemplo.com/video-padrao',
            user: parseInt(userId, 10)
        }
    };

    try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:1337/api/materiais-didaticos', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Erro do Strapi:', result);
            throw new Error(result.error?.message || 'Erro desconhecido ao criar material');
        }

        alert('Material criado com sucesso!');
        document.getElementById('uploadForm').classList.add('hidden');
        document.getElementById('materialForm').reset();
        carregarMateriais();

    } catch (error) {
        console.error('Erro ao criar material:', error);
        alert(`Erro: ${error.message}`);
    }
}

let materialEditando = null;

function editarMaterial(documentId, descricaoAtual) {
    materialEditando = documentId;

    const modal = document.getElementById('modalEditar');
    const textarea = document.getElementById('novaDescricao');

    textarea.value = descricaoAtual;
    modal.classList.remove('hidden');

    const btnSalvar = document.getElementById('salvarEdicao');
    btnSalvar.onclick = salvarEdicao;
}

async function salvarEdicao() {
    const novaDescricao = document.getElementById('novaDescricao').value;

    try {
        const token = localStorage.getItem('token');
        const url = `http://localhost:1337/api/materiais-didaticos/${materialEditando}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ data: { descricao: novaDescricao } })
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.error?.message || 'Erro ao salvar edição');
        }

        alert('Descrição atualizada com sucesso!');
        fecharModal();
        carregarMateriais();

    } catch (error) {
        alert(`Erro ao salvar descrição: ${error.message}`);
        console.error('Erro na edição:', error);
    }
}

function fecharModal() {
    document.getElementById('modalEditar').classList.add('hidden');
    materialEditando = null;
}

async function deletarMaterial(documentId) {
    if (confirm('Tem certeza que deseja excluir este material?')) {
        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:1337/api/materiais-didaticos/${documentId}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.error?.message || 'Erro desconhecido ao excluir');
            }

            alert('Material excluído com sucesso!');
            carregarMateriais();

        } catch (error) {
            console.error(`Erro ao excluir material ${documentId}:`, error);
            alert(`Erro ao excluir material: ${error.message}`);
        }
    }
}
