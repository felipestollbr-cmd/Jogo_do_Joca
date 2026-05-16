// main.js - Inicialização correta com seleção de mundos
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando Jogo do Joca...');
    
    // 1. Carregar as palavras
    try {
        await carregarPalavras(); // do game.js
        console.log('✅ Palavras carregadas');
    } catch (error) {
        console.error('❌ Erro ao carregar palavras:', error);
        exibirMensagem('Erro ao carregar o jogo. Recarregue.');
        return;
    }

    // 2. Exibir a tela de seleção de mundos
    exibirSelecaoMundos(); // função do worlds.js

    // 3. Configurar o botão "Próxima Fase"
    const btnProxima = document.getElementById('btnProximaFase');
    if (btnProxima) {
        btnProxima.addEventListener('click', () => {
            console.log('➡️ Avançando fase');
            avancarFase();
        });
    }

    // 4. Dica para TV
    const isTv = /tv|smart-tv|vizio|tizen|webos/i.test(navigator.userAgent);
    if (isTv) {
        exibirMensagem("Use as setas do controle e OK para escolher o mundo");
    }

    console.log('🎮 Pronto. Aguardando escolha do mundo.');
});