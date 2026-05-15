// Salvar progresso no localStorage (leve e simples)
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