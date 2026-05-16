// game.js - Versão com feedback apenas por voz (sem arquivos de som)
let palavrasData = null;
let mundoAtualId = null;
let faseAtualNum = 1;
let palavrasFase = [];
let palavrasRestantes = [];
let pontosFase = 0;

async function carregarPalavras() {
    const response = await fetch('data/words.json');
    palavrasData = await response.json();
    carregarMundos(); // função do worlds.js
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
        falar(`Parabéns! Você completou o mundo ${palavrasData[mundoAtualId].nome}`);
        return false;
    }
    palavrasFase = [...fases[faseKey]];
    palavrasRestantes = [...palavrasFase];
    embaralharArray(palavrasRestantes);
    
    // Atualiza imagem do inimigo
    const inimigoImg = palavrasData[mundoAtualId].inimigo;
    const imgElement = document.getElementById('inimigoImg');
    if (imgElement) {
        imgElement.src = `assets/images/${inimigoImg}`;
        imgElement.alt = `Inimigo ${palavrasData[mundoAtualId].nome}`;
    }
    
    renderizarPalavras();
    atualizarUI();
    falar(`Fase ${faseAtualNum} do mundo ${palavrasData[mundoAtualId].nome}. Encontre a palavra correta.`);
    return true;
}

function renderizarPalavras() {
    const grid = document.getElementById('palavrasGrid');
    if (!grid) return;
    grid.innerHTML = '';
    palavrasRestantes.forEach(palavra => {
        const div = document.createElement('div');
        div.className = 'palavra';
        div.textContent = palavra;
        div.setAttribute('tabindex', '0');
        div.setAttribute('data-palavra', palavra);
        div.addEventListener('click', () => verificarPalavra(palavra, div));
        grid.appendChild(div);
    });
    // Atualiza navegação por foco (para controle remoto)
    if (typeof atualizarElementosFocaveis === 'function') {
        atualizarElementosFocaveis();
    }
}

function verificarPalavra(palavra, elemento) {
    const palavraCorreta = palavrasFase[0];
    if (palavra === palavraCorreta) {
        // ACERTOU
        pontosFase++;
        atualizarUI();
        falar(`Muito bem! ${palavra} está correto!`);
        exibirMensagem("✅ Correto! ✅");
        
        palavrasFase.shift();
        palavrasRestantes = palavrasRestantes.filter(p => p !== palavra);
        
        if (palavrasFase.length === 0) {
            // Fase completa
            falar("Fase concluída! Você é muito inteligente.");
            completarFase(mundoAtualId, faseAtualNum); // função do worlds.js
            const totalFases = Object.keys(palavrasData[mundoAtualId].fases).length;
            if (faseAtualNum < totalFases) {
                document.getElementById('btnProximaFase').style.display = 'block';
            } else {
                document.getElementById('btnProximaFase').style.display = 'none';
                exibirMensagem("🏆 Mundo completo! Desbloqueou um novo mundo? 🏆");
                falar(`Parabéns! Você completou todas as fases do mundo ${palavrasData[mundoAtualId].nome}`);
            }
            salvarProgressoMundo();
        } else {
            renderizarPalavras();
        }
    } else {
        // ERROU
        falar(`Ops! A palavra ${palavra} não é a correta. Tente ${palavraCorreta}`);
        exibirMensagem(`❌ Tente de novo! A palavra é ${palavraCorreta} ❌`);
        if (elemento) {
            elemento.style.transform = 'shake 0.3s';
            setTimeout(() => {
                if (elemento) elemento.style.transform = '';
            }, 300);
        }
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
    const nivelSpan = document.getElementById('nivel');
    const pontosSpan = document.getElementById('pontos');
    if (nivelSpan) {
        nivelSpan.textContent = `${palavrasData[mundoAtualId].nome} - Fase ${faseAtualNum}`;
    }
    if (pontosSpan) {
        pontosSpan.textContent = pontosFase;
    }
}