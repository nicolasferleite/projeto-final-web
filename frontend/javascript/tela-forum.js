async function getAllPostagens() {
    try {
        const res = await api.get('/postagems?populate=user&populate=comentarios.user');
        return res.data;
    } catch (error) {
        console.error("Erro ao buscar postagens:", error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await carregarPostagens();
});

async function carregarPostagens() {
    const container = document.getElementById('posts-container');
    container.innerHTML = '<p>Carregando postagens...</p>';

    const dados = await getAllPostagens();
    if (!dados || !dados.data) {
        container.innerHTML = '<p>Não foi possível carregar as postagens.</p>';
        return;
    }

    container.innerHTML = '';
    const userLogadoId = parseInt(localStorage.getItem('id'), 10);

    dados.data.forEach(postagem => {
        const { documentId, titulo = 'Sem título', conteudo = 'Sem conteúdo', user = null, comentarios = [] } = postagem;

        const autorNome = user?.username || 'Autor desconhecido';
        const autorId = user?.id;

        const card = document.createElement('div');
        card.classList.add('post-card');
        card.setAttribute('data-post-id', documentId);

        card.comentarios = comentarios;

        card.innerHTML = `
            <h3>${titulo}</h3>
            <p>${conteudo}</p>
            <p><strong>Autor:</strong> ${autorNome}</p>
            <div class="post-buttons">
                <button class="expandir-btn">Expandir Comentários</button>
            </div>
        `;

        const buttonContainer = card.querySelector('.post-buttons');

        if (userLogadoId === autorId) {
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.classList.add('editar-btn');
            btnEditar.onclick = () => editarPostagem(documentId, titulo, conteudo);

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.classList.add('excluir-btn');
            btnExcluir.onclick = () => deletarPostagem(documentId);

            buttonContainer.appendChild(btnEditar);
            buttonContainer.appendChild(btnExcluir);
        }

        container.appendChild(card);

        buttonContainer.querySelector('.expandir-btn').addEventListener('click', () => {
            expandirPostagem(card, documentId);
        });
    });
}


async function deletarPostagem(documentId) {
    if (confirm('Tem certeza que deseja excluir esta postagem?')) {
        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:1337/api/postagems/${documentId}`;

            console.log(`Deletando postagem com documentId: ${documentId}`);

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const erro = await response.json();
                console.error('Erro completo:', erro);
                throw new Error(erro.error?.message || 'Erro desconhecido ao excluir');
            }

            alert('Postagem excluída com sucesso!');
            await carregarPostagens();

        } catch (error) {
            console.error(`Erro ao excluir postagem ${documentId}:`, error);
            alert(`Erro ao excluir postagem: ${error.message}`);
        }
    }
}

let postagemEditando = null;

function editarPostagem(documentId, tituloAtual, conteudoAtual) {
    postagemEditando = documentId;

    const modal = document.getElementById('modalEditar');
    const inputTitulo = document.getElementById('novoTitulo');
    const textareaConteudo = document.getElementById('novoConteudo');

    inputTitulo.value = tituloAtual;
    textareaConteudo.value = conteudoAtual;
    modal.classList.remove('hidden');

    const btnSalvar = document.getElementById('salvarEdicao');
    btnSalvar.onclick = salvarEdicao;
}

async function salvarEdicao() {
    const novoTitulo = document.getElementById('novoTitulo').value;
    const novoConteudo = document.getElementById('novoConteudo').value;

    try {
        const token = localStorage.getItem('token');
        const url = `http://localhost:1337/api/postagems/${postagemEditando}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                data: {
                    titulo: novoTitulo,
                    conteudo: novoConteudo
                }
            })
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.error?.message || 'Erro ao salvar edição');
        }

        alert('Postagem atualizada com sucesso!');
        fecharModal();
        await carregarPostagens();

    } catch (error) {
        alert(`Erro ao salvar postagem: ${error.message}`);
        console.error('Erro na edição:', error);
    }
}

function fecharModal() {
    document.getElementById('modalEditar').classList.add('hidden');
    postagemEditando = null;
}

document.getElementById('create-post-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const titulo = document.getElementById('post-title').value.trim();
    const conteudo = document.getElementById('post-content').value.trim();

    if (!titulo || !conteudo) {
        alert('Preencha todos os campos!');
        return;
    }

    const userId = localStorage.getItem('id');
    if (!userId) {
        alert('Você precisa estar logado para criar uma postagem!');
        return;
    }

    const payload = {
        data: {
            titulo,
            conteudo,
            user: {
                connect: [{ id: userId }]
            }
        }
    };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:1337/api/postagems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Erro completo:', result);
            throw new Error(result.error?.message || 'Erro desconhecido ao criar postagem');
        }

        alert('Postagem criada com sucesso!');
        document.getElementById('create-post-form').reset();
        await carregarPostagens();

    } catch (error) {
        console.error('Erro ao criar postagem:', error);
        alert(`Erro: ${error.message}`);
    }
});

function expandirPostagem(card, documentId) {
    let comentariosContainer = card.querySelector('.comentarios-container');

    if (comentariosContainer) {
        comentariosContainer.remove();
        return;
    }

    comentariosContainer = document.createElement('div');
    comentariosContainer.classList.add('comentarios-container');
    comentariosContainer.innerHTML = '<p>Carregando comentários...</p>';
    card.appendChild(comentariosContainer);

    if (card.comentarios.length === 0) {
        comentariosContainer.innerHTML = '<p>Nenhum comentário ainda.</p>';
    } else {
        comentariosContainer.innerHTML = '';

        card.comentarios.forEach(comentario => {
            const autor = comentario.user?.username || 'Anônimo';
            const conteudo = comentario.conteudo;

            const comentarioElement = document.createElement('div');
            comentarioElement.classList.add('comentario');
            comentarioElement.innerHTML = `<p><strong>${autor}:</strong> ${conteudo}</p>`;
            comentariosContainer.appendChild(comentarioElement);
        });
    }

    const formComentario = document.createElement('form');
    formComentario.innerHTML = `
        <textarea placeholder="Escreva seu comentário..." required></textarea>
        <button type="submit">Comentar</button>
    `;

    formComentario.onsubmit = async (e) => {
        e.preventDefault();

        const conteudo = formComentario.querySelector('textarea').value.trim();
        if (!conteudo) return;

        await adicionarComentario(documentId, conteudo, comentariosContainer);

        formComentario.reset();
    };

    comentariosContainer.appendChild(formComentario);
}

async function adicionarComentario(documentId, conteudo, container) {
    const userId = localStorage.getItem('id');
    if (!userId) {
        alert('Você precisa estar logado para comentar!');
        return;
    }

    const payload = {
        data: {
            conteudo,
            postagem: {
                connect: [{ documentId }]
            },
            user: {
                connect: [{ id: userId }]
            }
        }
    };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:1337/api/comentarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const result = await response.json();
            console.error('Erro completo:', result);
            throw new Error(result.error?.message || 'Erro desconhecido ao adicionar comentário');
        }

        alert('Comentário adicionado com sucesso!');
        await expandirPostagem(documentId);

    } catch (error) {
        console.error(`Erro ao adicionar comentário:`, error);
        alert(`Erro ao adicionar comentário: ${error.message}`);
    }
}

async function deletarComentario(comentarioDocumentId, postagemDocumentId) {
    if (confirm('Tem certeza que deseja excluir seu comentário?')) {
        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:1337/api/comentarios/${comentarioDocumentId}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const erro = await response.json();
                console.error('Erro completo:', erro);
                throw new Error(erro.error?.message || 'Erro desconhecido ao excluir');
            }

            alert('Comentário excluído com sucesso!');
            await expandirPostagem(postagemDocumentId);

        } catch (error) {
            console.error(`Erro ao excluir comentário ${comentarioDocumentId}:`, error);
            alert(`Erro ao excluir comentário: ${error.message}`);
        }
    }
}

async function adicionarComentario(documentId, conteudo, container) {
    const userId = localStorage.getItem('id');
    if (!userId) {
        alert('Você precisa estar logado para comentar!');
        return;
    }

    const payload = {
        data: {
            conteudo,
            postagem: {
                connect: [{ documentId }]
            },
            user: {
                connect: [{ id: userId }]
            }
        }
    };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:1337/api/comentarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const result = await response.json();
            console.error('Erro completo ao adicionar comentário:', result);
            throw new Error(result.error?.message || 'Erro desconhecido ao adicionar comentário');
        }

        alert('Comentário adicionado com sucesso!');

        const postagemAtualizada = await getOnePostagemByDocumentId(documentId);
        if (!postagemAtualizada) {
            alert('Erro ao buscar postagem atualizada após comentário.');
            return;
        }

        container.innerHTML = '';

        if (postagemAtualizada.comentarios.length === 0) {
            container.innerHTML = '<p>Nenhum comentário ainda.</p>';
        } else {
            postagemAtualizada.comentarios.forEach(comentario => {
                const autor = comentario.user?.username || 'Anônimo';
                const comentarioElement = document.createElement('div');
                comentarioElement.classList.add('comentario');
                comentarioElement.innerHTML = `<p><strong>${autor}:</strong> ${comentario.conteudo}</p>`;
                container.appendChild(comentarioElement);
            });
        }

        container.appendChild(formComentario);

    } catch (error) {
        console.error(`Erro ao adicionar comentário:`, error);
        alert(`Erro ao adicionar comentário: ${error.message}`);
    }
}

async function getOnePostagemByDocumentId(documentId) {
    try {
        const res = await api.get('/postagems?filters[documentId][$eq]=${documentId}&populate=comentarios.user');
        const postagem = res.data?.data?.[0] || null;

        if (!postagem) {
            console.error('Nenhuma postagem encontrada com documentId ${documentId}');
            return null;
        }

        return {
            documentId: postagem.documentId,
            titulo: postagem.titulo,
            conteudo: postagem.conteudo,
            comentarios: postagem.comentarios || []
        };

    } catch (error) {
        console.error('Erro ao buscar postagem por documentId ${documentId}:', error);
        return null;
    }
}