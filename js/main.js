
const URL = 'http://localhost:8080/'    

// Limpiar las cards
function limpiarDivs() {
    const colGet1 = document.getElementById('col-get-1');
    const colGet2 = document.getElementById('col-get-2');

    // Elimina todo el contenido de los divs
    colGet1.innerHTML = '';
    colGet2.innerHTML = '';
}

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

// Peticion GET listar ofertas
function obtenerDatos(params) {

    // Reemplaza esta URL con la URL de tu API
    let apiUrl = `${URL}api/ofertas`;

    if (typeof params === 'string' && params.trim() !== '') {
        apiUrl += params;
    }

    limpiarDivs();

    // Realiza la solicitud GET
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Verifica si hay ofertas en la respuesta
            if (data.total > 0) {
                const ofertas = data.ofertas;

                // Llama a la función para construir las tarjetas con los datos obtenidos
                ofertas.forEach(oferta => {
                    construirTarjeta(oferta);
                });
            } else {
                console.log('No hay ofertas disponibles.');
            }
        })
        .catch(error => console.error('Error al obtener datos:', error));
}

// Función para construir una tarjeta
function construirTarjeta(oferta) {


    const colGet1 = document.getElementById('col-get-1');
    const colGet2 = document.getElementById('col-get-2');

    // Decide en qué columna agregar la tarjeta
    const targetColumn = colGet1.children.length <= colGet2.children.length ? colGet1 : colGet2;

    const nuevaTarjeta = document.createElement('div');
    nuevaTarjeta.className = 'card my-2';
    nuevaTarjeta.style.height = '250px';
    nuevaTarjeta.innerHTML = `
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
    `;

    targetColumn.appendChild(nuevaTarjeta);
}


// *** Botones Modalidad de trabajo *** ///
// ************************************ ///
document.querySelector('#hibridoGet').addEventListener('click', () => {
    obtenerDatos('?modalidad=hibrido')
});
document.querySelector('#presencialGet').addEventListener('click', () => {
    obtenerDatos('?modalidad=presencial')
});
document.querySelector('#remotoGet').addEventListener('click', () => {
    obtenerDatos('?modalidad=remoto')
});
// ************************************ ///
// *** END - Botones Modalidad de trabajo *** ///


document.querySelector('#CrearCuenta').addEventListener('click', () => {
    window.location.href = '../register.html';
});

document.querySelector('#Ingresar').addEventListener('click', () => {
    window.location.href = '../login.html';
});

// Función para verificar si el usuario está autenticado
function verificarAutenticacion() {
    // Obtener el token del localStorage
    const token = localStorage.getItem('x-token');

    // Si hay un token, el usuario está autenticado
    if (token) {
        // Ocultar los botones de "Crear cuenta" e "Ingresar"
        document.querySelector('#CrearCuenta').classList.add('visually-hidden');
        document.querySelector('#Ingresar').classList.add('visually-hidden');

        // Obtener el nombre del usuario (debes tener tu lógica para obtener el nombre)
        const nombreUsuario = 'diego'; // Debes implementar esta función

        // Crear un elemento de texto con el nombre del usuario
        const textoUsuario = document.createTextNode(`Hola, ${nombreUsuario}`);

        // Crear un elemento de párrafo y agregar el texto del usuario
        const parrafoUsuario = document.createElement('p');
        parrafoUsuario.appendChild(textoUsuario);

        // Agregar el párrafo al contenedor de la barra de navegación
        document.getElementById('navbarNav').appendChild(parrafoUsuario);

        // Agregar un botón para cerrar sesión
        const botonCerrarSesion = document.createElement('button');
        botonCerrarSesion.className = 'btn btn-outline-danger';
        botonCerrarSesion.textContent = 'Cerrar Sesión';
        botonCerrarSesion.addEventListener('click', cerrarSesion);

        // Agregar el botón al contenedor de la barra de navegación
        document.getElementById('navbarNav').appendChild(botonCerrarSesion);
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    // Limpiar el localStorage (eliminar el token)
    localStorage.removeItem('x-token');

    // Recargar la página para reflejar los cambios
    window.location.reload();
}



// Llamar a ambas funciones cuando la página se carga
window.onload = function () {
    obtenerDatos();
    verificarAutenticacion();
};