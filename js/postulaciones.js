import { showSpinner, hideSpinner } from './spinner.js';
const URL = 'https://service-job-node.onrender.com/';

let USER_DATA = '';

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
    }, 1500);
}

function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/', '');
    return JSON.parse(window.atob(base64));
};

// Formatear fecha
function diasTranscurridos(desde) {

    let message = 'Publicado ';
    // Convierte la cadena de fecha a un objeto Date
    const fechaInicio = new Date(desde);

    // Obtiene la fecha actual
    const fechaActual = new Date();

    // Calcula la diferencia en milisegundos entre las dos fechas
    const diferenciaMs = fechaActual - fechaInicio;

    // Calcula la diferencia en días redondeando hacia abajo
    const diasTranscurridos = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

    // Lógica para devolver el texto relativo
    if (diasTranscurridos === 0) {
        message += 'hoy';
    } else if (diasTranscurridos === 1) {
        message += 'ayer';
    } else {
        message += `hace ${diasTranscurridos} días`;
    }

    return message;
}

async function obtenerInformacionUsuario() {
    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('x-token');

        const { uid } = parseJwt(token);

        const response = await fetch(`${URL}api/usuarios/${uid}`, {
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
        listarPostulaciones(usuario.ofertasAplicadas);

    } catch (error) {
        sendMessageRequestToUserClient('Error al obtener información del usuario', true)
        console.log(`Error al obtener información del usuario: ${error.message}`);
    }
}

function listarPostulaciones(postulaciones) {

    if (postulaciones.length > 0) {
        try {
            postulaciones.forEach(async uid => {
                const data = await apiRequestObtenerDatosOferta(uid);
                construirTarjeta(data);
            });
        } catch (error) {
            sendMessageRequestToUserClient(error, true)
        }
    }
    else {
        msgSinPostulaciones();
    }
}


function msgSinPostulaciones() {
    const boxMessageRequest = document.querySelector('#msg-inform-request');
    const textMessageReq = document.querySelector('#msg-inform-p');
    boxMessageRequest.classList.remove('d-none');
    boxMessageRequest.classList.add('fs-4');
    boxMessageRequest.classList.add('text-center');
    boxMessageRequest.classList.add('text-danger');
    boxMessageRequest.classList.add('my-5');
    textMessageReq.textContent = `No se registraron postualciones`;
}

// Función para construir una tarjeta
function construirTarjeta(oferta) {
    const cardsPostulaciones = document.getElementById('cardsPostulaciones');

    const nuevaTarjeta = document.createElement('div');
    nuevaTarjeta.className = 'col-lg-4 col-md-6 col-12 ';
    nuevaTarjeta.innerHTML = `
        <div class="card my-2" style="height: 250px;">
            <div class="card-body">
                <p id="titulo-empresa">${oferta.empresa}</p>
                <p id="fecha-publicacion">${diasTranscurridos(oferta.fechaCreacion)}</p>
                <h5 class="card-title py-2">${oferta.titulo}</h5>
                <p class="card-text">${oferta.descripcion}</p>
                <div class="ubicacion-card d-flex flex-column">
                    <i class="bi bi-geo-alt" style="font-size: 12px;"> ${oferta.ubicacion}</i>
                    <i class="bi bi-universal-access" style="font-size: 12px;"> ${oferta.modalidad}</i> 
                </div>
            </div>
        </div>
    `;

    cardsPostulaciones.appendChild(nuevaTarjeta);
}

async function apiRequestObtenerDatosOferta(uid) {

    const endpoint = `${URL}api/ofertas/${uid}`;

    try {
        const respuesta = await fetch(endpoint);

        if (!respuesta.ok) {
            throw new Error(`Error al obtener la oferta. Código de estado: ${respuesta.status}`);
        }

        const oferta = await respuesta.json();

        // Aquí puedes trabajar con la respuesta según tus necesidades
        return oferta;

    } catch (error) {
        console.error("Error al realizar la petición:", error.message);
    }
}


document.addEventListener('DOMContentLoaded', async function () {
    const spinner = showSpinner(`Cargando...`);
    await obtenerInformacionUsuario();
    hideSpinner(spinner)
});



/** Btns redirect */
document.querySelector('#mi-postulaciones-page').addEventListener('click', () => {
    window.location.href = '../postulaciones.html';
});

document.querySelector('#mi-perfil-page').addEventListener('click', () => {
    window.location.href = '../perfil.html';
});

document.querySelector('#mi-curriculum-page').addEventListener('click', () => {
    window.location.href = '../curriculum.html';
});



/** Black mod */
document.querySelector('#darkMode').addEventListener('click', () => {
    // Obtén una referencia al elemento <html>
    const htmlElement = document.querySelector('html');
    const iconDarkOrSun = document.querySelector('#darkMode');

    // Verifica si existe el atributo data-bs-theme y su valor es 'light'
    if (htmlElement.getAttribute('data-bs-theme') === 'light') {
        // Si existe y es 'light', cambia a 'dark'
        htmlElement.setAttribute('data-bs-theme', 'dark');
        iconDarkOrSun.classList.add('bi-sun');
        iconDarkOrSun.classList.remove('bi-moon-stars');
    } else {
        // Si no existe o no es 'light', cambia a 'light'
        htmlElement.setAttribute('data-bs-theme', 'light');
        iconDarkOrSun.classList.add('bi-moon-stars');
        iconDarkOrSun.classList.remove('bi-sun');
    }
});

document.querySelector('#goHome').addEventListener('click', () => {
    window.location.href = '../index.html';
});