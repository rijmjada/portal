
const URL = 'https://service-job-node.onrender.com/'

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


    // Agrega el uid como atributo data
    nuevaTarjeta.dataset.uid = oferta.uid;

    // Agrega un evento de clic para redirigir
    nuevaTarjeta.addEventListener('click', function () {
        const uid = this.dataset.uid;
        window.location.href = `detalles_oferta.html?oferta=${uid}`;
    });
    
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

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};


function verificarAutenticacion() {
    // Obtener el token del localStorage
    const token = localStorage.getItem('x-token');

    // Si no hay un token, el usuario no está autenticado
    if (!token) {
        // Mostrar los botones de "Crear cuenta" e "Ingresar"
        document.querySelector('#CrearCuenta').classList.remove('visually-hidden');
        document.querySelector('#Ingresar').classList.remove('visually-hidden');
        return;
    }

    const { uid } = parseJwt(token);

    // Realizar una solicitud GET para obtener la información del usuario
    fetch(`${URL}api/usuarios/${uid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((resp) => {
            // Verificar si la solicitud fue exitosa (código de estado 2xx)
            if (!resp.ok) {
                throw new Error(`Error en la solicitud: ${resp.status}`);
            }
            return resp.json();
        })
        .then((resp) => {
            // Obtener el nombre y la URL de la imagen del usuario desde la respuesta
            const nombreUsuario = resp.usuario.nombre;
            const imagenUsuarioUrl = resp.usuario.img; // Asume que la respuesta contiene la URL de la imagen


            let imagenUsuario = document.createElement('img');
            imagenUsuario.className = 'imagen-usuario';
            imagenUsuario.style.height = '40px';
            imagenUsuario.style.clipPath = 'circle(30%)';
            imagenUsuario.style.margin = 'auto 25px';
            imagenUsuario.alt = nombreUsuario;

            imagenUsuario.src = imagenUsuarioUrl ? imagenUsuarioUrl : '../assets/PERFIL-VACIO.png';


            // Agregar un contenedor de círculo para la imagen del usuario
            let contenedorCirculo = document.createElement('div');
            contenedorCirculo.className = 'circulo-imagen-usuario';
            contenedorCirculo.style.cursor = 'pointer';
            contenedorCirculo.appendChild(imagenUsuario);

            // Agregar el contenedor del círculo al contenedor de la barra de navegación
            const navbarNav = document.getElementById('navbarNav');
            navbarNav.innerHTML = ''; // Limpiar el contenido existente
            navbarNav.appendChild(contenedorCirculo);

            // Agregar un evento click para redirigir a la página de perfil
            contenedorCirculo.addEventListener('click', () => {
                // Redirigir a la página de perfil (ajusta la URL según tu estructura)
                window.location.href = `../perfil.html`;
            });

            // Agregar un botón para cerrar sesión
            const botonCerrarSesion = document.createElement('button');
            botonCerrarSesion.className = 'btn btn-outline-danger';
            botonCerrarSesion.textContent = 'Cerrar Sesión';
            botonCerrarSesion.addEventListener('click', cerrarSesion);

            // Agregar el botón al contenedor de la barra de navegación
            navbarNav.appendChild(botonCerrarSesion);
        })
        .catch((error) => {
            console.warn(`Error al obtener información del usuario: ${error.message}`);
            // Manejar el error según tus necesidades (puedes redirigir a la página de inicio de sesión, por ejemplo)
        });
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


function realizarBusqueda() {
    // Obtener el valor del input de palabra clave
    var palabraClave = encodeURIComponent(document.getElementById('input-palabra-clave').value);

    // Construir la URL del endpoint con el parámetro "termino"
    var url = URL + 'api/ofertas?termino=' + palabraClave;

    // Realizar la solicitud HTTP utilizando Fetch
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.total > 0) {
                const ofertas = data.ofertas;
                limpiarDivs()
                // Llama a la función para construir las tarjetas con los datos obtenidos
                ofertas.forEach(oferta => {
                    construirTarjeta(oferta);
                });
            } else {
                console.log('No hay ofertas disponibles.');
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
}