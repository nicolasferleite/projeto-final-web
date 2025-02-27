async function getAllUsers() {
    const res = await api.get('/users')
    return res.data
}

async function loginUser(user) {
    const res = await api.post('auth/local', {
        identifier: user.email,
        password: user.password
    })
    return res.data
}

async function getOneUser(id) {
    const res = await api.get(`/users/${id}?populate=*`)
    return res
}

async function createUser(user) {

    const res = await api.post('/auth/local/register', {
        username: user.username,
        email: user.email,
        password: user.password
    });

    return res.data;

}
async function getAllRoles() {
    const res = await api.get('/users-permissions/roles')
    return res.data
}

async function getOneRole(id) {
    const res = await api.get(`/users-permissions/roles/${id}`)
    return res.data
}





async function updateUser(user) {
    const res = await api.put(`/users/${user.documentId}`, 
        {
            username: user.name
        })
    return res.data
}

async function eraseUser(user) {
    const res = await api.delete(`/users/${user.documentId}`, {
        headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    localStorage.clear()
    alert("Usuário deletado com sucesso!");
    window.location.href = './'
    return res.data
}