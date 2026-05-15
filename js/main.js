/**
 * main.js
 * Arquivo principal de inicialização do Jogo do Joca
 * Responsável por:
 * - Carregar os dados do jogo (palavras)
 * - Restaurar o progresso salvo (localStorage)
 * - Iniciar a primeira fase
 * - Configurar eventos de clique e teclado
 * - Registrar o Service Worker (para PWA e funcionamento offline)
 */

// Aguarda o carregamento completo do DOM antes de executar qualquer ação
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando Jogo do Joca...');

    // 1. Carregar as palavras do arquivo JSON
    try {
        await carregarPalavras();  // Função definida em game.js
        console.log('✅ Palavras carregadas com sucesso');
    } catch (error) {
        console.error('❌ Erro ao carregar palavras:', error);
        exibirMensagem('Erro ao carregar o jogo. Recarregue a página.');
        return;
    }

    // 2. Restaurar progresso salvo (nível e pontos)
    const progresso = carregarProgresso();  // Função de utils.js
    nivelAtual = progresso.nivel;           // Variável global em game.js
    pontos = progresso.pontos;              // Variável global em game.js
    console.log(`📊 Progresso restaurado: Fase ${nivelAtual}, Pontos ${pontos}`);

    // 3. Iniciar a fase correspondente
    const faseIniciada = iniciarFase();     // Função de game.js
    if (!faseIniciada) {
        // Se não conseguiu iniciar (ex: fase inexistente), mostra mensagem
        exibirMensagem('🏆 Você já zerou o jogo! Parabéns! 🏆');
    }

    // 4. Configurar o botão "Próxima Fase"
    const btnProxima = document.getElementById('btnProximaFase');
    if (btnProxima) {
        // Remove listeners antigos para evitar duplicação
        const novoBtn = btnProxima.cloneNode(true);
        btnProxima.parentNode.replaceChild(novoBtn, btnProxima);
        novoBtn.addEventListener('click', () => {
            console.log('➡️ Avançando para a próxima fase');
            avancarFase();  // Função de game.js
        });
    } else {
        console.warn('⚠️ Botão "Próxima Fase" não encontrado no DOM');
    }

    // 5. (Opcional) Registrar Service Worker para PWA e funcionamento offline
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ Service Worker registrado:', reg))
            .catch(err => console.error('❌ Service Worker falhou:', err));
    } else if ('serviceWorker' in navigator) {
        // Para testes locais (http), registra mesmo assim (alguns navegadores permitem)
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('⚠️ Service Worker registrado em HTTP (modo desenvolvimento)'))
            .catch(err => console.log('ℹ️ Service Worker não registrado (modo desenvolvimento)'));
    }

    // 6. Pequena dica para TV: exibir instruções de navegação
    const isTv = /tv|smart-tv|vizio|tizen|webos|kdl|sony|bravia|lg|samsung/i.test(navigator.userAgent);
    if (isTv) {
        exibirMensagem('💡 Use as setas do controle para navegar e OK para escolher');
        setTimeout(() => {
            const msgDiv = document.getElementById('mensagem');
            if (msgDiv && msgDiv.textContent.includes('💡')) {
                msgDiv.textContent = '';
            }
        }, 5000);
    }

    // 7. Forçar a atualização dos elementos focáveis (para navegação por controle)
    if (typeof atualizarElementosFocaveis === 'function') {
        setTimeout(() => atualizarElementosFocaveis(), 200);
    }

    console.log('🎮 Jogo pronto!');
});

// (Opcional) Tratamento de erro global para não quebrar o jogo
window.addEventListener('error', (event) => {
    console.error('Erro global capturado:', event.error);
    exibirMensagem('Ops! Ocorreu um erro. Recarregue a página se necessário.');
});

// Função auxiliar (caso exibirMensagem não esteja disponível por algum motivo)
if (typeof exibirMensagem !== 'function') {
    window.exibirMensagem = function(msg) {
        const msgDiv = document.getElementById('mensagem');
        if (msgDiv) {
            msgDiv.textContent = msg;
            setTimeout(() => {
                if (msgDiv.textContent === msg) msgDiv.textContent = '';
            }, 3000);
        } else {
            console.log('Mensagem:', msg);
        }
    };
}