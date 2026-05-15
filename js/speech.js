// Síntese de voz (falar) - compatível com TVs e navegadores
function falar(texto) {
    return new Promise((resolve) => {
        if (!window.speechSynthesis) {
            console.warn("Síntese de voz não suportada");
            resolve();
            return;
        }

        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();

        function trySpeak() {
            const voices = window.speechSynthesis.getVoices();
            const vozBR = voices.find(v => v.lang === 'pt-BR');
            if (vozBR) utterance.voice = vozBR;
            window.speechSynthesis.speak(utterance);
        }

        if (window.speechSynthesis.getVoices().length > 0) {
            trySpeak();
        } else {
            window.speechSynthesis.onvoiceschanged = trySpeak;
        }
    });
}