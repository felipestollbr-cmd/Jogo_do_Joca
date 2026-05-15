let palavrasData = null;
let mundoAtualId = null;
let faseAtualNum = 1;
let palavrasFase = [];
let palavrasRestantes = [];
let pontosFase = 0;
let inimigoImg = null;

async function carregarPalavras() {
    const response = await fetch('data/words.json');
    palavrasData = await response.json();
    carregarMundos(); // do worlds.js
    // Restaurar último mundo
    const ultimoMundo = localStorage.getItem('ultimo_mundo');
    if (ultimoMundo && mundosDisponiveis.find(m => m.id === ultimoMundo)?.desbloqueado) {
        selecionarMundo(ultimoMundo);
    } else {
        selecionarMundo('mundoB');
    }
}

function iniciarFase() {
    if (!mundoAtualId || !palavrasData[mundoAtualId]) {
        console.error("Mundo não selecionado");
        return false;
    }
    const fases = palavrasData[mundoAtualId].fases;
    const faseKey = faseAtualNum.toString();
    if (!fases[faseKey]) {
        exibirMensagem(`🎉 Parabéns! Você completou o ${palavrasData[mundoAtualId].nome}! 🎉`);
        return false;
    }
    palavrasFase = [...fases[faseKey]];
    palavrasRestantes = [...palavrasFase];
    embaralharArray(palavrasRestantes);
    
    // Atualiza imagem do inimigo
    inimigoImg = palavrasData[mundoAtualId].inimigo;
    document.getElementById('inimigoImg').src = `assets/images/${inimigoImg}`;
    document.getElementById('inimigoImg').alt = `Inimigo ${palavrasData[mundoAtualId].nome}`;
    
    renderizarPalavras();
    atualizarUI();
    falar(`Fase ${faseAtualNum} do ${palavrasData[mundoAtualId].nome}. Encontre a palavra correta.`);
    return true;
}

function verificarPalavra(palavra, elemento) {
    const palavraCorreta = palavrasFase[0];
    if (palavra === palavraCorreta) {
        document.getElementById('somAcerto').play();
        pontosFase++;
        atualizarUI();
        falar(`Muito bem! ${palavra} está correto!`);
        exibirMensagem("✅ Correto! ✅");
        
        palavrasFase.shift();
        palavrasRestantes = palavrasRestantes.filter(p => p !== palavra);
        
        if (palavrasFase.length === 0) {
            // Fase completa
            falar("Fase concluída!");
            completarFase(mundoAtualId, faseAtualNum);
            if (faseAtualNum < Object.keys(palavrasData[mundoAtualId].fases).length) {
                document.getElementById('btnProximaFase').style.display = 'block';
            } else {
                document.getElementById('btnProximaFase').style.display = 'none';
                exibirMensagem("🏆 Mundo completo! Desbloqueou novo mundo? 🏆");
            }
            salvarProgressoMundo();
        } else {
            renderizarPalavras();
        }
    } else {
        document.getElementById('somErro').play();
        falar(`Ops! ${palavra} não é. Tente ${palavraCorreta}`);
        exibirMensagem(`❌ Tente de novo! A palavra é ${palavraCorreta} ❌`);
        elemento.style.transform = 'shake 0.3s';
        setTimeout(() => elemento.style.transform = '', 300);
    }
}

function avancarFase() {
    faseAtualNum++;
    pontosFase = 0;
    atualizarUI();
    document.getElementById('btnProximaFase').style.display = 'none';
    iniciarFase();
    salvarProgressoMundo();
}

function salvarProgressoMundo() {
    localStorage.setItem(`fase_${mundoAtualId}`, faseAtualNum);
}

function atualizarUI() {
    document.getElementById('nivel').textContent = `${palavrasData[mundoAtualId].nome} - Fase ${faseAtualNum}`;
    document.getElementById('pontos').textContent = pontosFase;
}

// Adicione esta função para exibir seleção de mundos na tela inicial
function exibirSelecaoMundos() {
    const container = document.getElementById('worldsContainer');
    if (!container) return;
    container.innerHTML = '';
    mundosDisponiveis.forEach(mundo => {
        const btn = document.createElement('button');
        btn.className = 'world-btn';
        btn.innerHTML = `<img src="assets/images/${mundo.desbloqueado ? mundo.inimigo : 'locked.svg'}" width="80"><br>${mundo.nome}`;
        btn.disabled = !mundo.desbloqueado;
        btn.onclick = () => {
            if (selecionarMundo(mundo.id)) {
                document.getElementById('worldSelection').style.display = 'none';
                document.getElementById('gameArea').style.display = 'block';
                iniciarFase();
            } else {
                falar("Mundo trancado");
            }
        };
        container.appendChild(btn);
    });
}