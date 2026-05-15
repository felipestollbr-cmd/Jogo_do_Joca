// worlds.js - Gerencia mundos, desbloqueio e progresso

let mundosDisponiveis = [];
let mundoAtual = null;
let faseAtualDoMundo = 1;

function carregarMundos() {
    // Carrega os mundos do words.json e define desbloqueio
    mundosDisponiveis = Object.keys(palavrasData).map(key => ({
        id: key,
        nome: palavrasData[key].nome,
        inimigo: palavrasData[key].inimigo,
        desbloqueado: localStorage.getItem(`mundo_${key}_unlocked`) === 'true' || key === 'mundoB' // primeiro mundo sempre livre
    }));
}

function desbloquearMundo(mundoId) {
    localStorage.setItem(`mundo_${mundoId}_unlocked`, 'true');
    carregarMundos(); // recarrega status
}

function selecionarMundo(mundoId) {
    if (!mundosDisponiveis.find(m => m.id === mundoId)?.desbloqueado) {
        falar("Esse mundo ainda está trancado. Complete o mundo anterior!");
        return false;
    }
    mundoAtual = mundoId;
    faseAtualDoMundo = parseInt(localStorage.getItem(`fase_${mundoId}`)) || 1;
    // Salva última seleção
    localStorage.setItem('ultimo_mundo', mundoId);
    return true;
}

function completarFase(mundoId, faseNum) {
    const fases = palavrasData[mundoId].fases;
    const totalFases = Object.keys(fases).length;
    if (faseNum >= totalFases) {
        // Desbloqueia próximo mundo
        const mundosLista = Object.keys(palavrasData);
        const idxAtual = mundosLista.indexOf(mundoId);
        if (idxAtual !== -1 && idxAtual + 1 < mundosLista.length) {
            desbloquearMundo(mundosLista[idxAtual + 1]);
        }
    }
    // Salva progresso da fase
    localStorage.setItem(`fase_${mundoId}`, faseNum + 1);
}

function reiniciarMundo(mundoId) {
    localStorage.setItem(`fase_${mundoId}`, 1);
    if (mundoId === mundoAtual) faseAtualDoMundo = 1;
}