document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id"); 
    const loginButton = document.querySelector(".login");
    const logoutButton = document.querySelector(".logout");
    const saudacao = document.getElementById("saudacao");

    if (token) {
        loginButton.style.display = "none";
        logoutButton.style.display = "block";

        try {
            console.log("Buscando usuário com ID:", userId);
            
            
            const userResponse = await getOneUser(userId);
            console.log("Resposta completa do usuário:", userResponse);

            const user = userResponse.data || userResponse;

            if (user && user.username) {
                console.log("Usuário encontrado:", user.username);
                const username = user.username;
                
                const roleId = user.role ? user.role.id : null;
                console.log("ID da Role:", roleId);

                let roleName = "Usuário";
                if (roleId) {
                    const roleResponse = await getOneRole(roleId);
                    console.log("Resposta completa da Role:", roleResponse);
                    roleName = roleResponse.role ? roleResponse.role.name : "Usuário";
                }

                
                saudacao.innerHTML = `Olá, <strong>${username}</strong> (${roleName})`;
            } else {
                console.warn("Usuário não encontrado ou sem nome.");
            }

        } catch (error) {
            console.error("Erro ao obter dados do usuário:", error);
        }

    } else {
        loginButton.style.display = "block";
        logoutButton.style.display = "none";
    }

    
    loginButton.addEventListener("click", function () {
        window.location.href = "../html/telalogin.html";
    });

    
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        window.location.reload();
    });
});
