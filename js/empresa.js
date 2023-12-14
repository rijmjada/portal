
let USER_DATA = '';
let TOKEN = '';


const boxMessageRequest = document.querySelector('#msg-inform-request');
const textMessageReq = document.querySelector('#msg-inform-p');

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
        cargarUsuarioEnFormulario(USER_DATA)
    } catch (error) {
        console.log(`Error al obtener información del usuario: ${error.message}`);
    }
}

function cargarUsuarioEnFormulario(user) {
    const nombre = document.querySelector('#inputName');
    const razon_social = document.querySelector('#inputRazonSocial');
    const direccion = document.querySelector('#inputDireccion');
    const telefono = document.querySelector('#inputTelefono');
    const sector = document.querySelector('#selectSector');
    const cantidad_trabajadores = document.querySelector('#cantidadTrabajadores');

    nombre.value = user.nombreEmpresa;
    razon_social.value = user.razonSocial;
    direccion.value = user.direccion;
    telefono.value = user.telefono;
    sector.value = user.sector;
    cantidad_trabajadores.value = user.numero_trabajadores;
}

function recuperarDatosDelFormulario() {

    const nombreEmpresa = document.querySelector('#inputName').value;
    const razonSocial = document.querySelector('#inputRazonSocial').value;
    const direccion = document.querySelector('#inputDireccion').value;
    const telefono = document.querySelector('#inputTelefono').value;
    const sector = document.querySelector('#selectSector').value;
    const numero_trabajadores = document.querySelector('#cantidadTrabajadores').value;

    return {
        nombreEmpresa,
        razonSocial,
        direccion,
        telefono,
        sector,
        numero_trabajadores
    }
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


async function actualizarPerfil(e) {

    e.preventDefault();

    const usuario = recuperarDatosDelFormulario();

    const token = localStorage.getItem('x-token');

    const { uid } = parseJwt(token);

    const URL = `http://localhost:8080/api/usuarios/${uid}`


    try {
        // Realizar la solicitud POST para registrar al usuario
        const response = await fetch(`${URL}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-token': token
            },
            body: JSON.stringify(usuario)
        });

        if (!response.ok) {
            sendMessageRequestToUserClient('Hubo un error', true);
        }

        sendMessageRequestToUserClient('Usuario actulizado', false);

    } catch (error) {
        sendMessageRequestToUserClient('Hubo un error', true);
        console.log(error)
    }
}


function sendMessageRequestToUserClient(message, errors) {
    boxMessageRequest.classList.toggle('d-none');
    textMessageReq.textContent = message;

    textMessageReq.style.color = errors ? 'red' : 'blue';

    setTimeout(() => {
        boxMessageRequest.classList.toggle('d-none');
        textMessageReq.textContent = '';
        textMessageReq.style.color = '';
    }, 1500);
}


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