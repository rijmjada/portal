import { showSpinner, hideSpinner } from './spinner.js';
import URL from './config.js';


let USER_DATA = '';


const boxMessageRequest = document.querySelector('#msg-inform-request');
const textMessageReq = document.querySelector('#msg-inform-p');


function mostrarCurriculums(usuario) {
    try {
        const contenedor = document.getElementById("detallesUsuario");

        contenedor.innerHTML = '';

        if (usuario.curriculum.length >= 0) {
            cargarPrimerPdf(usuario.curriculum[0]);
            crearEnlacesCurriculum(usuario.curriculum, contenedor);
            agregarEventoClicEnlaces();
        } else {
            sendMessageRequestToUserClient(`No has cargado ningún curriculum`, true);
        }

    } catch (error) {
        sendMessageRequestToUserClient(error, true);
    }
}

function cargarPrimerPdf(primerUrl) {
    showPreviewPdf(primerUrl);
}

function crearEnlaceCurriculum(url, contenedor) {
    // Crear un contenedor principal para el enlace y el icono
    const contenedorEnlace = document.createElement("div");
    contenedorEnlace.className = "d-flex justify-content-between align-items-center";

    const enlace = document.createElement("a");
    enlace.style.cursor = 'pointer';
    enlace.setAttribute("data-url", url);
    enlace.className = "list-group-item list-group-item-secondary mx-2 my-1";
    enlace.textContent = obtenerNombreArchivo(url);

    // Establecer estilos para el contenedor del nombre del archivo
    enlace.style.flexGrow = 1; // Permite que el contenedor se expanda para ocupar el espacio disponible
    enlace.style.whiteSpace = 'nowrap'; // Evita el salto de línea
    enlace.style.overflow = 'hidden'; // Oculta el exceso de contenido
    enlace.style.textOverflow = 'ellipsis'; // Trunca el texto con puntos suspensivos si es necesario
    enlace.style.borderRadius = '6px';

    enlace.addEventListener('click', function () {
        quitarClaseActivaTodosEnlaces();
        this.classList.add('active');
        const urlGuardada = this.getAttribute("data-url");
        showPreviewPdf(urlGuardada);
    });

    const iconoEliminar = crearIconoEliminar(enlace);

    // Agregar el enlace y el icono al contenedor principal
    contenedorEnlace.appendChild(enlace);
    contenedorEnlace.appendChild(iconoEliminar);

    // Agregar el contenedor principal al contenedor proporcionado
    contenedor.appendChild(contenedorEnlace);
}


function crearIconoEliminar(enlace) {
    const iconoEliminar = document.createElement("i");
    iconoEliminar.className = "bi bi-trash fs-5 mx-2 ";
    iconoEliminar.style.cursor = 'pointer';
    iconoEliminar.onclick = function () {
        const urlEliminar = enlace.getAttribute("data-url");
        borrarDocumento(this, urlEliminar);
    };
    return iconoEliminar;
}

function obtenerNombreArchivo(url) {
    return url.substring(url.lastIndexOf('/') + 1);
}

function crearEnlacesCurriculum(curriculum, contenedor) {
    curriculum.forEach((url) => {
        crearEnlaceCurriculum(url, contenedor);
    });
}

function agregarEventoClicEnlaces() {
    const enlaces = document.querySelectorAll('.list-group-item');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', function () {
            quitarClaseActivaTodosEnlaces();
            this.classList.add('active');
        });
    });
}

function quitarClaseActivaTodosEnlaces() {
    const enlaces = document.querySelectorAll('.list-group-item');
    enlaces.forEach(enlace => enlace.classList.remove('active'));
}


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

function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/', '');
    return JSON.parse(window.atob(base64));
};

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
        console.log(USER_DATA)
        mostrarCurriculums(USER_DATA)
    } catch (error) {
        sendMessageRequestToUserClient('Error al obtener información del usuario', true)
        console.log(`Error al obtener información del usuario: ${error.message}`);
    }
}


function showPreviewPdf(urlGuardada) {
    const iframe = document.querySelector('#iframeShowPdf');
    iframe.src = `https://docs.google.com/gview?url=${urlGuardada}&embedded=true`;
}

async function borrarDocumento(icono, urlEliminar) {

    const spinner = showSpinner('Procesando...');
    try {
        // Obtener el elemento padre (enlace) del ícono
        var listItem = icono.parentNode;
        // Obtener el elemento padre (lista) del enlace
        var listGroup = listItem.parentNode;
        // Remover el elemento de la lista
        listGroup.removeChild(listItem);

        const { ok, message } = await eliminarCurriculum(urlEliminar)
        if (ok) {
            sendMessageRequestToUserClient(`Curriculum eliminado`, false)
        }
        else {
            sendMessageRequestToUserClient(message, true)

        }
    } catch (error) {
        sendMessageRequestToUserClient(message, true)
    }
    finally {
        hideSpinner(spinner);
    }
}


async function eliminarCurriculum(urlEliminar) {
    try {
        const response = await fetch(`${URL}api/upload/curriculum/${USER_DATA.uid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: urlEliminar })  // Envía la propiedad 'url' en el cuerpo de la solicitud
        });

        // Puedes verificar la respuesta del servidor si es necesario
        if (response.ok) {
            return { ok: true, message: response.statusText };
        } else {
            return { ok: false, message: response.statusText };

        }
    } catch (error) {
        return { ok: false, message: error.message };
    }
}

async function agregarCurriculum() {
    const url = `${URL}api/upload/curriculum/${USER_DATA.uid}`;

    try {
        const archivoInput = document.getElementById('archivoInput');
        archivoInput.click();
        const spinner = showSpinner('Subiendo cv...');

        // Definir una función de manejo para el evento change
        const handleFileChange = async () => {
            // Eliminar el evento change después de la primera ejecución
            archivoInput.removeEventListener('change', handleFileChange);

            const formData = new FormData();
            formData.append('archivo', archivoInput.files[0]);

            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            const responseData = await response.json();
            hideSpinner(spinner);

            if (response.ok) {
                sendMessageRequestToUserClient('cv cargado correctamente', false);
                window.location.reload();
            } else {
                sendMessageRequestToUserClient(responseData.textContent, true);
            }
        };

        // Agregar el evento change con la función de manejo
        archivoInput.addEventListener('change', handleFileChange);
    } catch (error) {
        sendMessageRequestToUserClient(error, true);
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

// Función para cambiar el modo oscuro
function toggleDarkMode() {
    const htmlElement = document.querySelector('html');
    const iconDarkOrSun = document.querySelector('#darkMode');

    // Verifica si existe el atributo data-bs-theme y su valor es 'light'
    if (htmlElement.getAttribute('data-bs-theme') === 'light') {
        // Si existe y es 'light', cambia a 'dark'
        htmlElement.setAttribute('data-bs-theme', 'dark');
        iconDarkOrSun.classList.add('bi-sun');
        iconDarkOrSun.classList.remove('bi-moon-stars');
        // Guarda el estado en localStorage
        localStorage.setItem('darkMode', 'dark');
    } else {
        // Si no existe o no es 'light', cambia a 'light'
        htmlElement.setAttribute('data-bs-theme', 'light');
        iconDarkOrSun.classList.add('bi-moon-stars');
        iconDarkOrSun.classList.remove('bi-sun');
        // Guarda el estado en localStorage
        localStorage.setItem('darkMode', 'light');
    }
}

// Evento de clic para cambiar el modo oscuro
document.querySelector('#darkMode').addEventListener('click', toggleDarkMode);

// Verifica el estado almacenado en localStorage al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const storedMode = localStorage.getItem('darkMode');
    if (storedMode === 'dark') {
        toggleDarkMode(); // Cambia al modo oscuro si estaba activado
    }
});

document.querySelector('#btn-agregarCv').addEventListener('click', agregarCurriculum);