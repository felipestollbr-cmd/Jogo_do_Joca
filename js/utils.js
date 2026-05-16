// utils.js - Funções auxiliares
function salvarProgresso(nivel, pontos) {
    localStorage.setItem('joca_nivel', nivel);
    localStorage.setItem('joca_pontos', pontos);
}
function carregarProgresso() {
    const nivel = parseInt(localStorage.getItem('joca_nivel')) || 1;
    const pontos = parseInt(localStorage.getItem('joca_pontos')) || 0;
    return { nivel, pontos };
}
function resetarProgresso() {
    localStorage.removeItem('joca_nivel');
    localStorage.removeItem('joca_pontos');
}
function exibirMensagem(msg) {
    const msgDiv = document.getElementById('mensagem');
    if (msgDiv) {
        msgDiv.textContent = msg;
        setTimeout(() => {
            if (msgDiv.textContent === msg) msgDiv.textContent = '';
        }, 2500);
    }
}
function embaralharArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}