window.addEventListener('DOMContentLoaded', async () => {
    console.log('Iniciando Jogo do Joca...');
    
    await carregarPalavras(); // do game.js
    exibirSelecaoMundos();    // do worlds.js
    
    // Botão próxima fase
    const btnProxima = document.getElementById('btnProximaFase');
    if (btnProxima) {
        btnProxima.addEventListener('click', () => avancarFase());
    }
    
    // Dica para TV
    const isTv = /tv|smart-tv|vizio|tizen|webos/i.test(navigator.userAgent);
    if (isTv) {
        exibirMensagem("Use as setas do controle e OK para escolher o mundo");
    }
});