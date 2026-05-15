// Navegação por controle remoto (setas e Enter)
let elementosFocaveis = [];
let indiceFocado = 0;

function atualizarElementosFocaveis() {
    elementosFocaveis = Array.from(document.querySelectorAll('.palavra, .btn-proxima'));
    if (elementosFocaveis.length > 0) {
        elementosFocaveis[0].focus();
        indiceFocado = 0;
    }
}

function focusNoElemento(index) {
    if (elementosFocaveis.length === 0) return;
    if (index < 0) index = elementosFocaveis.length - 1;
    if (index >= elementosFocaveis.length) index = 0;
    elementosFocaveis[index].focus();
    indiceFocado = index;
}

window.addEventListener('keydown', (e) => {
    // Seta direita ou esquerda para navegar
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const delta = (e.key === 'ArrowRight') ? 1 : -1;
        focusNoElemento(indiceFocado + delta);
    }
    
    // Enter (OK do controle) dispara clique no elemento focado
    if (e.key === 'Enter') {
        e.preventDefault();
        const focado = document.activeElement;
        if (focado && (focado.classList.contains('palavra') || focado.classList.contains('btn-proxima'))) {
            focado.click();
        }
    }
});

// Observa quando o grid de palavras é recriado para reaplicar o foco
const observer = new MutationObserver(() => {
    atualizarElementosFocaveis();
});
observer.observe(document.getElementById('palavrasGrid'), { childList: true, subtree: true });

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(atualizarElementosFocaveis, 100);
});