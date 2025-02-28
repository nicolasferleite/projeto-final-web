async function getAllMaterials() {
    try {
        const res = await api.get('/materiais-didaticos?populate=user');
        return res.data;
    } catch (error) {
        console.error("Erro ao buscar materiais:", error);
    }
}


async function getOneMaterial(id) {
    try {
        const res = await api.get(`/materiais-didaticos/${id}?populate=*`);
        return res.data;
    } catch (error) {
        console.error(`Erro ao buscar material com ID ${id}:`, error);
    }
}

async function createMaterial(material) {
    const res = await api.post('/materiais-didaticos', {
        data: {
            titulo: material.titulo,
            descricao: material.descricao,
            arquivo: material.arquivo,
            video_url: material.video_url,
            user: { id: material.userId }
        }
    });
    return res.data;
}


async function updateMaterial(material) {
    try {
        const res = await api.put(`/materiais-didaticos/${material.id}`, {
            data: {
                titulo: material.titulo,
                descricao: material.descricao,
                arquivo: material.arquivo, 
                video_url: material.video_url
            }
        });
        return res.data;
    } catch (error) {
        console.error(`Erro ao atualizar material com ID ${material.id}:`, error);
    }
}

async function eraseMaterial(material) {
    try {
        await api.delete(`/materiais-didaticos/${material.id}`);
        alert("Material deletado com sucesso!");
        window.location.reload();
    } catch (error) {
        console.error(`Erro ao deletar material com ID ${material.id}:`, error);
    }
}

async function eraseMaterial(material) {
    try {
        await api.delete(`/materiais-didaticos/${material.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return true;
    } catch (error) {
        console.error(`Erro ao deletar material com ID ${material.id}:`, error);
        return false;
    }
}

