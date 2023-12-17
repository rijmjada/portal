
export function showSpinner(msg) {
    const spinner = document.querySelector('.loader-container');
    const message = document.querySelector('#message-spinner');
    message.textContent = msg;
    spinner.classList.remove('d-none');
    return spinner;
}

export function hideSpinner(spinner) {
    // Ocultar el spinner después de 5 segundos
    setTimeout(function () {
        spinner.classList.add('d-none');
    }, 300);
}
