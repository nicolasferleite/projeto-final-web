fetch('http://localhost:1337/api/postagens')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(json => {
        console.log(json);

        const postagens = json.data;
        const postagensContainer = document.getElementById("postagens");
        
        postagensContainer.innerHTML = "";
        
        postagens.forEach(post => {
            const postagemDiv = document.createElement("div");
            postagemDiv.classList.add("postagem");
            postagemDiv.innerHTML = `
                <h3>${post.usuario}</h3>
                <p>${post.conteudo}</p>
                <small>Publicado em: ${new Date(post.data).toLocaleString()}</small>
            `;
            postagensContainer.appendChild(postagemDiv);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar postagens:', error);
        document.getElementById("postagens").innerHTML = "<p>Erro ao carregar postagens.</p>";
    });


    document.addEventListener("DOMContentLoaded", () => {
        carregarPostagens();
    });
    
    async function carregarPostagens() {
        try {
            const response = await fetch("http://localhost:1337/api/postagens");
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
    
            const json = await response.json();
            const postagensContainer = document.getElementById("postagens");
            postagensContainer.innerHTML = "";
    
            json.data.forEach(post => {
                const postagemDiv = document.createElement("div");
                postagemDiv.classList.add("postagem");
                postagemDiv.innerHTML = `
                    <h3>${post.usuario}</h3>
                    <p>${post.conteudo}</p>
                    <small>Publicado em: ${new Date(post.data).toLocaleString()}</small>
                    <div class="interacoes">
                        <div class="curtidas">
                            <button class="botao curtir" data-id="${post.id}">
                                👍 <span id="curtidas-${post.id}">0</span>
                            </button>
                        </div>
                        <button class="botao comentar" data-id="${post.id}">💬 Comentar</button>
                        <button class="botao compartilhar">🔗 Compartilhar</button>
                    </div>
                    <div class="responder-container" id="responder-${post.id}" style="display:none;">
                        <input type="text" placeholder="Escreva uma resposta..." id="input-${post.id}">
                        <button class="botao enviar-resposta" data-id="${post.id}">Enviar</button>
                    </div>
                    <div class="respostas" id="respostas-${post.id}"></div>
                `;
                postagensContainer.appendChild(postagemDiv);
            });
    
            // Adiciona eventos para os botões
            adicionarEventos();
            carregarCurtidas();
            carregarRespostas();
        } catch (error) {
            console.error("Erro ao carregar postagens:", error);
        }
    }
    
    function adicionarEventos() {
        document.querySelectorAll(".curtir").forEach(botao => {
            botao.addEventListener("click", () => {
                let postId = botao.getAttribute("data-id");
                curtirPostagem(postId);
            });
        });
    
        document.querySelectorAll(".comentar").forEach(botao => {
            botao.addEventListener("click", () => {
                let postId = botao.getAttribute("data-id");
                document.getElementById(`responder-${postId}`).style.display = "block";
            });
        });
    
        document.querySelectorAll(".enviar-resposta").forEach(botao => {
            botao.addEventListener("click", () => {
                let postId = botao.getAttribute("data-id");
                let input = document.getElementById(`input-${postId}`);
                adicionarResposta(postId, input.value);
                input.value = "";
            });
        });
    }
    
    function curtirPostagem(postId) {
        let curtidas = JSON.parse(localStorage.getItem("curtidas")) || {};
        curtidas[postId] = (curtidas[postId] || 0) + 1;
        localStorage.setItem("curtidas", JSON.stringify(curtidas));
        document.getElementById(`curtidas-${postId}`).textContent = curtidas[postId];
    }
    
    function carregarCurtidas() {
        let curtidas = JSON.parse(localStorage.getItem("curtidas")) || {};
        for (let postId in curtidas) {
            if (document.getElementById(`curtidas-${postId}`)) {
                document.getElementById(`curtidas-${postId}`).textContent = curtidas[postId];
            }
        }
    }
    
    function adicionarResposta(postId, conteudo) {
        if (!conteudo.trim()) return;
        let respostas = JSON.parse(localStorage.getItem("respostas")) || {};
        if (!respostas[postId]) respostas[postId] = [];
        respostas[postId].push(conteudo);
        localStorage.setItem("respostas", JSON.stringify(respostas));
        carregarRespostas();
    }
    
    function carregarRespostas() {
        let respostas = JSON.parse(localStorage.getItem("respostas")) || {};
        for (let postId in respostas) {
            let container = document.getElementById(`respostas-${postId}`);
            if (container) {
                container.innerHTML = respostas[postId].map(res => `<div class="resposta">${res}</div>`).join("");
            }
        }
    }
    