
let USER_DATA = '';
const URL_PUBLICAR_OFERTA = 'http://localhost:8080/api/ofertas/';


const boxMessageRequest = document.querySelector('#msg-inform-request');
const textMessageReq = document.querySelector('#msg-inform-p');

function sendMessageRequestToUserClient(message, errors) {
    boxMessageRequest.classList.toggle('d-none');
    textMessageReq.textContent = message;

    textMessageReq.style.color = errors ? 'red' : 'blue';

    setTimeout(() => {
        boxMessageRequest.classList.toggle('d-none');
        textMessageReq.textContent = '';
        textMessageReq.style.color = '';
    }, 2500);
}

async function obtenerInformacionUsuario() {
    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('x-token');

        const { uid } = parseJwt(token);

        const response = await fetch(`http://localhost:8080/api/usuarios/${uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // Verificar si la solicitud fue exitosa (código de estado 2xx)
        if (!response.ok) {
            console.log(`Error en la solicitud: ${response.status}`);
        }

        // Obtener el nombre del usuario desde la respuesta
        const { usuario } = await response.json();
        USER_DATA = usuario;
        console.log(usuario);
    } catch (error) {
        console.log(`Error al obtener información del usuario: ${error.message}`);
    }
}

function publicarAviso(e) {
    e.preventDefault();

    let dataFormulario = obtenerDataForm();
    dataFormulario.empresa = USER_DATA.nombreEmpresa;
    console.log(dataFormulario);
    apiRequestCrearOferta(dataFormulario)
}

async function apiRequestCrearOferta(data) {
    try {
        const token = localStorage.getItem('x-token');
        const { uid } = parseJwt(token);

        const spinner = showSpinner(`Cargando...`);
        const response = await fetch(`${URL_PUBLICAR_OFERTA}${uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-token': token
            },
            body: JSON.stringify(data), 
        });

        if (!response.ok) {
            sendMessageRequestToUserClient(`Error en la solicitud: ${response.status}`, true);
        }

        sendMessageRequestToUserClient('Publicacion realizada exitosamente!', false);
        hideSpinner(spinner);

    } catch (error) {
        sendMessageRequestToUserClient(`Error en la solicitud: ${response.status}`, true);
    }
}


function obtenerDataForm() {
    return {
        titulo: document.querySelector('#titulo').value,
        ubicacion: document.querySelector('#ubicacion').value,
        modalidad: document.querySelector('#modalidad').value,
        salario: document.querySelector('#salario').value,
        descripcion: document.querySelector('#descripcion').value
    };
}

function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/', '');
    return JSON.parse(window.atob(base64));
};

function showSpinner(message) {
    document.querySelector('#message-spinner').textContent = message;
    const spinner = document.querySelector('.loader-container');
    spinner.classList.remove('d-none');
    return spinner;
}

function hideSpinner(spinner) {
    // Ocultar el spinner después de 5 segundos
    setTimeout(function () {
        spinner.classList.add('d-none');
    }, 500);
}


document.addEventListener('DOMContentLoaded', async function () {
    const spinner = showSpinner(`Cargando...`);
    await obtenerInformacionUsuario();
    hideSpinner(spinner)
});


document.querySelector('#btn-perfil').addEventListener('click', () => {
    window.location.href = '../perfil.html';
});

document.querySelector('#btn-datos-empresa').addEventListener('click', () => {
    window.location.href = '../empresa.html';
});

document.querySelector('#btn-publicaciones').addEventListener('click', () => {
    window.location.href = '../publicaciones.html';
});

document.querySelector('#btn-nueva-oferta').addEventListener('click', () => {
    window.location.href = '../oferta.html';
});

document.querySelector('#goHome').addEventListener('click', () => {
    window.location.href = '../index.html';
});