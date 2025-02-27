async function getAllComentarios() {
    try {
        const res = await api.get('/comentarios?populate=*');
        return res.data;
    } catch (error) {
        console.error("Erro ao buscar comentários:", error);
    }
}

async function getOneComentario(id) {
    try {
        const res = await api.get(`/comentarios/${id}?populate=*`);
        return res.data;
    } catch (error) {
        console.error(`Erro ao buscar comentário com ID ${id}:`, error);
    }
}

async function createComentario(comentario) {
    try {
        const res = await api.post('/comentarios', {
            data: {
                conteudo: comentario.conteudo,
                user: comentario.user,
                postagem: comentario.postagem
            }
        });
        return res.data;
    } catch (error) {
        console.error("Erro ao criar comentário:", error);
    }
}

async function updateComentario(comentario) {
    try {
        const res = await api.put(`/comentarios/${comentario.id}`, {
            data: {
                conteudo: comentario.conteudo
            }
        });
        return res.data;
    } catch (error) {
        console.error(`Erro ao atualizar comentário com ID ${comentario.id}:`, error);
    }
}

async function eraseComentario(comentario) {
    try {
        await api.delete(`/comentarios/${comentario.id}`);
        alert("Comentário deletado com sucesso!");
        window.location.reload();
    } catch (error) {
        console.error(`Erro ao deletar comentário com ID ${comentario.id}:`, error);
    }
}
