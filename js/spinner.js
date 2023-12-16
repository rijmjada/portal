// archivo spinner.js

export function showSpinner() {
    const spinner = document.querySelector('.loader-container');
    spinner.classList.remove('d-none');
    return spinner;
}

export function hideSpinner(spinner) {
    // Ocultar el spinner después de 5 segundos
    setTimeout(function () {
        spinner.classList.add('d-none');
    }, 1500);
}
