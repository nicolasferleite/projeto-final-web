async function getAllPostagens() {
    try {
        const res = await api.get('/postagems?populate=*');
        return res.data;
    } catch (error) {
        console.error("Erro ao buscar postagens:", error);
    }
}

async function getOnePostagem(id) {
    try {
        const res = await api.get(`/postagems/${id}?populate=*`);
        return res.data;
    } catch (error) {
        console.error(`Erro ao buscar postagem com ID ${id}:`, error);
    }
}

async function createPostagem(postagem) {
    try {
        const res = await api.post('/postagems', {
            data: {
                titulo: postagem.titulo,
                conteudo: postagem.conteudo,
                user: postagem.user,
                comentarios: postagem.comentarios
            }
        });
        return res.data;
    } catch (error) {
        console.error("Erro ao criar postagem:", error);
    }
}

async function updatePostagem(postagem) {
    try {
        const res = await api.put(`/postagems/${postagem.id}`, {
            data: {
                titulo: postagem.titulo,
                conteudo: postagem.conteudo
            }
        });
        return res.data;
    } catch (error) {
        console.error(`Erro ao atualizar postagem com ID ${postagem.id}:`, error);
    }
}

async function erasePostagem(postagem) {
    try {
        await api.delete(`/postagems/${postagem.id}`);
        alert("Postagem deletada com sucesso!");
        window.location.reload();
    } catch (error) {
        console.error(`Erro ao deletar postagem com ID ${postagem.id}:`, error);
    }
}