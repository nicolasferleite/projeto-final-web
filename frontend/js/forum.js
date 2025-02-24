document.addEventListener("DOMContentLoaded", function () {
    const postsContainer = document.getElementById("posts-container");
    const postForm = document.getElementById("create-post-form");

    postForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = document.getElementById("post-title").value.trim();
        const content = document.getElementById("post-content").value.trim();

        if (title === "" || content === "") return;

        submitPost(title, content);
    });

    function submitPost(title, content) {
        console.log(`📝 Enviando nova postagem: ${title}`);
    
        fetch("http://localhost:1337/api/postagems", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: {
                    conteudo: content,
                    data: new Date().toISOString(),
                    titulo: title,
                    id_postagem: 1,
                    likes: 0,
                    comentarios: []
                }
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`Erro HTTP: ${response.status} - ${JSON.stringify(errorData)}`);
                });
            }
            return response.json();
        })
        .then(newPostData => {
            console.log("Resposta da API:", newPostData);
    
            if (newPostData.data) {
                console.log("✅ Postagem salva com sucesso!");
    
                const postId = newPostData.data.id;
                const postTitle = newPostData.data.attributes ? newPostData.data.attributes.titulo : newPostData.data.titulo;
                const postContent = newPostData.data.attributes ? newPostData.data.attributes.conteudo : newPostData.data.conteudo; 
    
                addPostToUI(postId, postTitle, postContent);
    
                document.getElementById("post-title").value = "";
                document.getElementById("post-content").value = "";
            } else {
                console.error("Erro ao adicionar postagem:", newPostData);
            }
        })
        .catch(error => {
            console.error("❌ Erro ao enviar postagem:", error.message);
            alert("Erro ao adicionar postagem: " + error.message);
        });
    }
    
    function addPostToUI(postId, titulo, conteudo) {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");

        const title = document.createElement("h2");
        title.textContent = titulo;
        postDiv.appendChild(title);

        const content = document.createElement("p");
        content.textContent = conteudo;
        postDiv.appendChild(content);

        const btnComments = document.createElement("button");
        btnComments.textContent = "Comentários";
        btnComments.addEventListener("click", function () {
            toggleComments(postId, postDiv);
        });
        postDiv.appendChild(btnComments);

        postsContainer.prepend(postDiv);
    }

    function loadPosts() {
        postsContainer.innerHTML = "";

        fetch("http://localhost:1337/api/postagems")
            .then(response => response.json())
            .then(data => {
                const posts = data.data;
                posts.forEach(post => {
                    const postTitle = post.attributes ? post.attributes.titulo : post.titulo;
                    const postContent = post.attributes ? post.attributes.conteudo : post.conteudo;
                    addPostToUI(post.id, postTitle, postContent);
                });
            })
            .catch(error => console.error("Erro ao carregar posts:", error));
    }


    function toggleComments(postId, postDiv) {
        let commentsContainer = postDiv.querySelector(".comments");

        if (commentsContainer) {
            commentsContainer.remove();
            return;
        }

        commentsContainer = document.createElement("div");
        commentsContainer.classList.add("comments");
        commentsContainer.dataset.postId = postId;

        fetch("http://localhost:1337/api/comentarios")
            .then(response => response.json())
            .then(data => {
                const allComments = data.data;
                const filteredComments = allComments.filter(comment => comment.herdou === postId);

                if (filteredComments.length > 0) {
                    filteredComments.forEach(comment => {
                        const commentDiv = createCommentElement(comment.conteudo);
                        commentsContainer.appendChild(commentDiv);
                    });
                } else {
                    const noComments = document.createElement("p");
                    noComments.textContent = "Sem comentários.";
                    commentsContainer.appendChild(noComments);
                }
            })
            .catch(error => console.error("Erro ao carregar comentários:", error));

        const commentForm = document.createElement("form");
        commentForm.style.marginTop = "1rem";

        const textarea = document.createElement("textarea");
        textarea.placeholder = "Escreva seu comentário";
        textarea.required = true;
        textarea.rows = 3;
        textarea.cols = 40;
        commentForm.appendChild(textarea);

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Enviar Comentário";
        commentForm.appendChild(submitButton);

        commentForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const commentContent = textarea.value.trim();
            if (commentContent === "") return;

            submitComment(commentContent, postId, commentsContainer, textarea);
        });

        commentsContainer.appendChild(commentForm);
        postDiv.appendChild(commentsContainer);
    }

    function createCommentElement(commentText) {
        const commentDiv = document.createElement("div");
        commentDiv.style.marginBottom = "0.5rem";
        commentDiv.innerHTML = `<strong>Comentário:</strong> ${commentText}`;
        return commentDiv;
    }

    function submitComment(commentContent, postId, commentsContainer, textarea) {
        console.log(`📝 Enviando novo comentário para a postagem ID: ${postId}`);

        fetch("http://localhost:1337/api/comentarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: {
                    conteudo: commentContent,
                    herdou: postId
                }
            })
        })
        .then(response => response.json())
        .then(newCommentData => {
            if (newCommentData.data) {
                console.log("✅ Comentário salvo com sucesso!");

                const newCommentDiv = createCommentElement(commentContent);
                commentsContainer.insertBefore(newCommentDiv, commentsContainer.querySelector("form"));

                textarea.value = "";
            } else {
                console.error("Erro ao adicionar comentário:", newCommentData);
            }
        })
        .catch(error => {
            console.error("❌ Erro ao enviar comentário:", error.message);
            alert("Erro ao adicionar comentário: " + error.message);
        });
    }

    loadPosts();
});
