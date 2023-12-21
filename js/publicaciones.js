let USER_DATA = '';
const URL = 'https://backjob-production.up.railway.app/';

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
        console.log(usuario);
        listarPublicaciones(usuario.ofertasPublicadas)

    } catch (error) {
        sendMessageRequestToUserClient('Error al obtener información del usuario', true)
        console.log(`Error al obtener información del usuario: ${error.message}`);
    }
}

// Variables globales para el control de la paginación
let paginaActual = 1;
const cardsPorPagina = 6;

function listarPublicaciones(publicaciones) {
    // Calcula el índice de inicio y fin para la página actual
    const indiceDeInicio = (paginaActual - 1) * cardsPorPagina;
    const indiceFinal = indiceDeInicio + cardsPorPagina;

    // Filtra las publicaciones para mostrar solo las de la página actual
    const listaPublicaciones = publicaciones.slice(indiceDeInicio, indiceFinal);

    limpiarContenido();

    // Construye las tarjetas solo para las publicaciones de la página actual
    listaPublicaciones.forEach(async (uid) => {
        const data = await apiRequestObtenerDatosOferta(uid);
        if (data) construirTarjeta(data);
    });

    // Actualiza la paginación
    actualizarPaginacion(publicaciones.length);
}

function limpiarContenido() {
    // Limpia el contenedor antes de agregar nuevas tarjetas
    const cardsPostulaciones = document.getElementById('cardsPostulaciones');
    cardsPostulaciones.innerHTML = '';
}

function actualizarPaginacion(totalItems) {
    const totalPages = Math.ceil(totalItems / cardsPorPagina);
    const paginationContainer = document.querySelector('.pagination');

    // Limpia la paginación antes de actualizarla
    paginationContainer.innerHTML = '';

    // Botón "Anterior"
    const prevButton = document.createElement('li');
    prevButton.className = 'page-item';
    prevButton.innerHTML = `<a class="page-link" href="#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>`;
    prevButton.addEventListener('click', () => cambiarPagina(paginaActual - 1));
    paginationContainer.appendChild(prevButton);

    // Agrega los números de página
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('li');
        pageButton.className = 'page-item';
        pageButton.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageButton.addEventListener('click', () => cambiarPagina(i));
        paginationContainer.appendChild(pageButton);
        // Resalta la página actual
        if (i === paginaActual) {
            pageButton.classList.add('active'); // Agrega la clase 'active' para resaltar
        }

        paginationContainer.appendChild(pageButton);
    }

    // Botón "Siguiente"
    const nextButton = document.createElement('li');
    nextButton.className = 'page-item';
    nextButton.innerHTML = `<a class="page-link" href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>`;
    nextButton.addEventListener('click', () => cambiarPagina(paginaActual + 1));
    paginationContainer.appendChild(nextButton);
}

function cambiarPagina(newPage) {
    if (newPage >= 1 && newPage <= Math.ceil(USER_DATA.ofertasPublicadas.length / cardsPorPagina)) {
        paginaActual = newPage;
        listarPublicaciones(USER_DATA.ofertasPublicadas);
    }
}

// Función para construir una tarjeta
function construirTarjeta(oferta) {
    const cardsPostulaciones = document.getElementById('cardsPostulaciones');

    const nuevaTarjeta = document.createElement('div');
    nuevaTarjeta.className = 'col-lg-4 col-md-6 col-12 ';

    // Agrega el uid como atributo data
    nuevaTarjeta.dataset.uid = oferta.uid;

    // Agrega un evento de clic para redirigir
    nuevaTarjeta.addEventListener('click', function () {
        const uid = this.dataset.uid;
        window.location.href = `detalles_publicacion.html?oferta=${uid}`;
    });

    // Verifica que oferta sea un objeto y tenga una propiedad uid antes de acceder a ella
    if (oferta && oferta.uid) {
        nuevaTarjeta.innerHTML = `
            <div class="card my-2" style="height: 250px;">
                <div class="card-body">
                    <p id="titulo-empresa">${oferta.empresa}</p>
                    <p id="fecha-publicacion">${diasTranscurridos(oferta.fechaCreacion)}</p>
                    <h5 class="card-title py-2">${oferta.titulo}</h5>
                    <p class="card-text">${oferta.descripcion}</p>
                    <div class="ubicacion-card d-flex flex-column">
                        <i class="bi bi-geo-alt"> ${oferta.ubicacion}</i>
                        <i class="bi bi-universal-access"> ${oferta.modalidad}</i> 
                    </div>
                </div>
            </div>
        `;

        cardsPostulaciones.appendChild(nuevaTarjeta);
    } else {
        console.error('La oferta no tiene una propiedad uid definida:', oferta);
    }
}


async function apiRequestObtenerDatosOferta(uid) {

    const spinner = showSpinner('Cargando...');
    const endpoint = `${URL}api/ofertas/${uid}`;
    
    try {
        const respuesta = await fetch(endpoint);

        if (!respuesta.ok) {
            throw new Error(`Error al obtener la oferta. Código de estado: ${respuesta.status}`);
        }
        return await respuesta.json();
    } catch (error) {
        console.error("Error al realizar la petición:", error.message);
    }
    finally {
        hideSpinner(spinner)
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const spinner = showSpinner(`Cargando...`);
    await obtenerInformacionUsuario();
    hideSpinner(spinner)
});

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
    }, 100);
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