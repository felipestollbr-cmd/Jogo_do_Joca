// worlds.js - Todos os mundos desbloqueados
let mundosDisponiveis = [];
let mundoAtual = null;
let faseAtualDoMundo = 1;

function carregarMundos() {
    if (!palavrasData) {
        console.warn("palavrasData ainda não carregado");
        return;
    }
    // Força todos os mundos como desbloqueados
    mundosDisponiveis = Object.keys(palavrasData).map(key => ({
        id: key,
        nome: palavrasData[key].nome,
        inimigo: palavrasData[key].inimigo,
        desbloqueado: true  // <--- TODOS DESBLOQUEADOS
    }));
    console.log("Mundos carregados:", mundosDisponiveis);
}

function selecionarMundo(mundoId) {
    const mundo = mundosDisponiveis.find(m => m.id === mundoId);
    if (!mundo) return false;
    
    mundoAtual = mundoId;
    faseAtualDoMundo = parseInt(localStorage.getItem(`fase_${mundoId}`)) || 1;
    localStorage.setItem('ultimo_mundo', mundoId);
    
    window.mundoAtualId = mundoAtual;
    window.faseAtualNum = faseAtualDoMundo;
    
    // Esconde seleção e mostra jogo
    document.getElementById('worldSelection').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    
    iniciarFase(); // função do game.js
    return true;
}

function completarFase(mundoId, faseNum) {
    // Apenas salva o progresso da fase, sem desbloquear nada (já está tudo liberado)
    localStorage.setItem(`fase_${mundoId}`, faseNum + 1);
}

// Função que exibe os botões dos mundos
function exibirSelecaoMundos() {
    carregarMundos();
    const container = document.getElementById('worldsContainer');
    if (!container) {
        console.error("Elemento 'worldsContainer' não encontrado!");
        return;
    }
    container.innerHTML = '';
    
    mundosDisponiveis.forEach(mundo => {
        const btn = document.createElement('button');
        btn.className = 'world-btn';
        btn.innerHTML = `
            <img src="assets/images/${mundo.inimigo}" width="80" height="80" alt="${mundo.nome}" onerror="this.src='assets/images/locked.svg'">
            <br>
            <span>${mundo.nome}</span>
        `;
        btn.onclick = () => selecionarMundo(mundo.id);
        container.appendChild(btn);
    });
    
    // Garante que a tela de seleção está visível
    document.getElementById('worldSelection').style.display = 'flex';
    document.getElementById('gameArea').style.display = 'none';
}