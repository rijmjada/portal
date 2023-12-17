import { showSpinner, hideSpinner } from './spinner.js';


let OFERTA = '';
const URL = 'https://service-job-node.onrender.com/';
let UID_OFERTA = '';

async function obtenerDataPublicacion(uid) {
    const url = `${URL}api/ofertas/${uid}`
    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.log(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();

        cargarDatosPublicacion(data);
        OFERTA = data;

    } catch (error) {
        console.log(`Error al obtener información del usuario: ${error.message}`);
    }
}

function formatearFecha(fecha) {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return new Date(fecha).toLocaleDateString(undefined, options);
}


function cargarDatosPublicacion(data) {
    const descripcion = document.querySelector('#descripcion');
    // Reemplazar saltos de línea con etiquetas <br>
    const textoConBr = data.descripcion.replace(/\n/g, '<br>');
    descripcion.innerHTML = textoConBr;

    document.querySelector('#puesto').textContent = data.titulo;
    document.querySelector('#empresa').textContent = data.empresa;

    const fechaFormateada = formatearFecha(data.fechaCreacion);
    document.querySelector('#fecha-publicacion').textContent = fechaFormateada;

    document.querySelector('#ubicacion').textContent = data.ubicacion;
    document.querySelector('#modalidad').textContent = data.modalidad;
    document.querySelector('#salario').textContent = '$' + data.salario;
}


document.addEventListener('DOMContentLoaded', function () {
    const spinner = showSpinner('Cargando...');
    const urlParams = new URLSearchParams(window.location.search);
    UID_OFERTA = urlParams.get('oferta');
    obtenerDataPublicacion(UID_OFERTA);
    hideSpinner(spinner);
});

document.querySelector('#ver-postulantes').addEventListener('click', async () => {

    if (OFERTA.postulantes.length >= 0) {
        // Recorrer la lista de postulantes y construir tarjetas para cada uno
        for (const postulante of OFERTA.postulantes) {
            const data = await obtenerDatosPostulante(postulante);
            construirTarjetaPostulante(data.usuario);
        }
    }
    else {
        console.log('nadie aplico a esta oferta');
    }
});



async function obtenerDatosPostulante(uid) {
    const url = `${URL}api/usuarios/${uid}`;
    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.log(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(`Error al obtener información del postulante: ${error.message}`);
    }
}



function construirTarjetaPostulante(postulante) {
    const contenedorPostulantes = document.getElementById('card-container');

    const nuevaTarjeta = document.createElement('div');
    nuevaTarjeta.className = 'card my-2';
    nuevaTarjeta.innerHTML = `
    <div class="card-body">
        <h5 class="card-title">${postulante.nombre} ${postulante.apellido}</h5>
        <p class="card-text">Correo: ${postulante.correo}</p>
        <button class="btn btn-primary btn-descargar" data-url="${postulante.curriculum[0]}" data-apellido="${postulante.apellido}">Descargar Curriculum</button>
    </div>
`;

    contenedorPostulantes.appendChild(nuevaTarjeta);

    // Agregar un event listener al botón dentro de la tarjeta
    const btnDescargar = nuevaTarjeta.querySelector('.btn-descargar');
    btnDescargar.addEventListener('click', async () => {
        await descargarCurriculum(btnDescargar.dataset.url, btnDescargar.dataset.apellido);
    });
}

async function descargarCurriculum(url, apellido) {
    try {
        const response = await fetch(url);
        const data = await response.blob();

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.download = `Curriculum_${apellido}.pdf`;
        link.click();
    } catch (error) {
        console.error('Error al descargar el curriculum:', error);
    }
}

