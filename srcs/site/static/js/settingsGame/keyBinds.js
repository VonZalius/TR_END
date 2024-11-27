import { showMessage } from '../commons/common.js';

const usedKeys = new Set();

export function handleKeyBindings(index, mode) {
    const upKeyField = document.getElementById(`player${index}Up`);
    const downKeyField = document.getElementById(`player${index}Down`);

    if (!upKeyField || !downKeyField) return;

    const handleKeyEvent = (event, field) => {
        event.preventDefault();
        const key = event.key;
        let displayValue = key;

        if (key === "ArrowUp") displayValue = "↑";
        else if (key === "ArrowDown") displayValue = "↓";
        else if (key === "ArrowLeft") displayValue = "←";
        else if (key === "ArrowRight") displayValue = "→";

        if (/^[a-z0-9]$/.test(key) || ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
            const previousKey = field.getAttribute('data-key');

            if (previousKey) {
                usedKeys.delete(previousKey);
            }

            if (!usedKeys.has(key)) {
                usedKeys.add(key);
                field.value = displayValue;
                field.setAttribute('data-key', key);
                field.classList.remove('is-invalid');
            } else {
                field.classList.add('is-invalid');
                setTimeout(() => field.classList.remove('is-invalid'), 1500);
            }
        } else {
            showMessage("Only lowercase letters, numbers, and arrow keys are allowed.", "warning");
        }
    };

    upKeyField.addEventListener('keydown', (event) => handleKeyEvent(event, upKeyField));
    downKeyField.addEventListener('keydown', (event) => handleKeyEvent(event, downKeyField));
}

export function clearUsedKeys() {
    usedKeys.clear();
}
