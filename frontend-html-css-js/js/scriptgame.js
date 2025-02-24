document.querySelectorAll('.trash-item').forEach(item => {
    item.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text', event.target.id);
    });
});

document.querySelectorAll('.bin').forEach(bin => {
    bin.addEventListener('dragover', (event) => {
        event.preventDefault();
    });
    bin.addEventListener('drop', (event) => {
        event.preventDefault();
        const itemId = event.dataTransfer.getData('text');
        const item = document.getElementById(itemId);
        if ((itemId === 'papel' && event.target.id === 'azul') ||
            (itemId === 'plastico' && event.target.id === 'vermelho') ||
            (itemId === 'vidro' && event.target.id === 'verde')||
            (itemId === 'metal' && event.target.id === 'amarelo')||
            (itemId === 'madeira' && event.target.id === 'preto')||
            (itemId === 'bateria' && event.target.id === 'laranja')||
            (itemId === 'organico' && event.target.id === 'marrom')||
            (itemId === 'radioativo' && event.target.id === 'roxo')||
            (itemId === 'hospitalar' && event.target.id === 'branco')||
            (itemId === 'n_reciclavel' && event.target.id === 'cinza')) {
            event.target.appendChild(item);
            alert('Correto!');
        } else {
            alert('Tente novamente!');
        }
    });
});
