
let OFERTA = '';

async function obtenerDataPublicacion(uid) {
    const url = `http://localhost:8080/api/ofertas/${uid}`
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

function cargarDatosPublicacion(data) {
    const descripcion = document.querySelector('#descripcion');
    // Reemplazar saltos de línea con etiquetas <br>
    const textoConBr = data.descripcion.replace(/\n/g, '<br>');
    descripcion.innerHTML = textoConBr;

    document.querySelector('#puesto').textContent = data.titulo;
    document.querySelector('#empresa').textContent = data.empresa;
    document.querySelector('#fecha-publicacion').textContent = data.fechaCreacion;
    document.querySelector('#ubicacion').textContent = data.ubicacion;
    document.querySelector('#modalidad').textContent = data.modalidad;
    document.querySelector('#salario').textContent = '$' + data.salario;


}


document.addEventListener('DOMContentLoaded', function () {

    const urlParams = new URLSearchParams(window.location.search);
    UID_OFERTA = urlParams.get('oferta');
    obtenerDataPublicacion(UID_OFERTA)
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
    const url = `http://localhost:8080/api/usuarios/${uid}`;
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
            <a href="${postulante.curriculum[0]}" download="Curriculum_${postulante.apellido}.pdf" class="btn btn-primary">Descargar Curriculum</a>
        </div>
    `;

    contenedorPostulantes.appendChild(nuevaTarjeta);
}
