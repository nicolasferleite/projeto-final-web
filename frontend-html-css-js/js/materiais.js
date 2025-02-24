const API_URL = 'http://localhost:1337/api';

const materialsList = document.getElementById('materialsList');
const newMaterialBtn = document.getElementById('newMaterialBtn');
const uploadForm = document.getElementById('uploadForm');
const materialForm = document.getElementById('materialForm');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');

newMaterialBtn.addEventListener('click', () => uploadForm.classList.toggle('hidden'));
materialForm.addEventListener('submit', handleMaterialSubmit);
modal.querySelector('.close').addEventListener('click', () => modal.classList.add('hidden'));

async function loadMaterials() {
    try {
        const response = await fetch(`${API_URL}/materiais-didaticos?populate=*`);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        const jsonResponse = await response.json();
        const { data } = jsonResponse;
        renderMaterials(data);
    } catch (error) {
        alert(`Erro ao carregar materiais: ${error.message}`);
    }
}

function renderMaterials(materials) {
    materialsList.innerHTML = '';
    if (materials.length === 0) {
        materialsList.innerHTML = '<p>Nenhum material disponível.</p>';
        return;
    }
    materials.forEach(material => {
        const { id, titulo, descricao, video_url, autor } = material;
        const materialCard = document.createElement('div');
        materialCard.classList.add('material-card');
        materialCard.innerHTML = `
            <h3>${titulo}</h3>
            <p><strong>Descrição:</strong> ${descricao}</p>
            <p><strong>Autor:</strong> ${autor}</p>
            ${
                video_url
                    ? `<p><strong>Vídeo:</strong> <a href="${video_url}" target="_blank">${video_url}</a></p>`
                    : ''
            }
            <button class="view-details" data-id="${id}">Ver Detalhes</button>
        `;
        materialsList.appendChild(materialCard);
        const viewDetailsButton = materialCard.querySelector('.view-details');
        viewDetailsButton.addEventListener('click', () => openModal(material));
    });
}

function openModal(material) {
    const { titulo, descricao, video_url, autor } = material;
    modalBody.innerHTML = `
        <h2>${titulo}</h2>
        <p><strong>Descrição:</strong> ${descricao}</p>
        <p><strong>Autor:</strong> ${autor}</p>
        ${
            video_url
                ? `<p><strong>Vídeo:</strong> <a href="${video_url}" target="_blank">${video_url}</a></p>`
                : ''
        }
    `;
    modal.classList.remove('hidden');
}

async function handleMaterialSubmit(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value.trim() || null;
    const descricao = document.getElementById('descricao').value.trim() || null;
    const video_url = document.getElementById('video_url').value.trim() || null;
    const autor = document.getElementById('autor').value.trim() || null;

    if (!titulo || !descricao || !autor) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    let novoIdMaterial = 1;

    try {
        const responseCheck = await fetch(`${API_URL}/materiais-didaticos`);
        const dataCheck = await responseCheck.json();

        if (dataCheck.data && dataCheck.data.length > 0) {
            const ids = dataCheck.data
                .map(material => material.attributes?.id_material)
                .filter(id => id !== undefined && id !== null);

            if (ids.length > 0) {
                novoIdMaterial = Math.max(...ids) + 1;
            }
        }
    } catch (error) {
        console.error("Erro ao verificar materiais existentes:", error);
        alert("⚠️ Erro ao verificar materiais existentes. Tente novamente.");
        return;
    }

    const material = {
        titulo,
        descricao,
        video_url,
        autor,
        id_material: novoIdMaterial
    };

    try {
        const response = await fetch(`${API_URL}/materiais-didaticos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: material })
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('mensagem').textContent = `✅ Material adicionado com sucesso! (ID Material: ${novoIdMaterial})`;
            document.getElementById('materialForm').reset();
            loadMaterials();
        } else {
            document.getElementById('mensagem').textContent = "❌ Erro ao adicionar material: " + (result.error?.message || "Erro desconhecido");
            console.error("Erro:", result);
        }
    } catch (error) {
        document.getElementById('mensagem').textContent = "❌ Falha na requisição!";
        console.error("Erro de rede:", error);
    }
}

materialForm.addEventListener('submit', handleMaterialSubmit);

loadMaterials();