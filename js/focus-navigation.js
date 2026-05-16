// focus-navigation.js - Navegação por setas e Enter
let elementosFocaveis = [];
let indiceFocado = 0;

function atualizarElementosFocaveis() {
    elementosFocaveis = Array.from(document.querySelectorAll('.palavra, .btn-proxima, .world-btn'));
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
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        let delta = 0;
        if (e.key === 'ArrowRight') delta = 1;
        if (e.key === 'ArrowLeft') delta = -1;
        if (e.key === 'ArrowDown') delta = 1;
        if (e.key === 'ArrowUp') delta = -1;
        focusNoElemento(indiceFocado + delta);
    }
    if (e.key === 'Enter') {
        e.preventDefault();
        const focado = document.activeElement;
        if (focado && (focado.classList.contains('palavra') || focado.classList.contains('btn-proxima') || focado.classList.contains('world-btn'))) {
            focado.click();
        }
    }
});

// Observa quando o grid de palavras é recriado para reaplicar o foco
const observer = new MutationObserver(() => {
    atualizarElementosFocaveis();
});
observer.observe(document.getElementById('palavrasGrid'), { childList: true, subtree: true });
observer.observe(document.getElementById('worldsContainer'), { childList: true, subtree: true });

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(atualizarElementosFocaveis, 100);
});