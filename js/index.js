
import { showSpinner, hideSpinner } from './spinner.js';

import URL from './config.js';

function limpiarDivs() {
    const colGet1 = document.getElementById('col-get-1');
    const colGet2 = document.getElementById('col-get-2');
    colGet1.innerHTML = '';
    colGet2.innerHTML = '';
}

function diasTranscurridos(desde) {
    let message = 'Publicado ';
    const fechaInicio = new Date(desde);
    const fechaActual = new Date();
    const diferenciaMs = fechaActual - fechaInicio;
    const diasTranscurridos = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

    if (diasTranscurridos === 0) {
        message += 'hoy';
    } else if (diasTranscurridos === 1) {
        message += 'ayer';
    } else {
        message += `hace ${diasTranscurridos} días`;
    }
    return message;
}

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
    const token = localStorage.getItem('x-token');
    if (!token) {
        document.querySelector('#CrearCuenta').classList.remove('visually-hidden');
        document.querySelector('#Ingresar').classList.remove('visually-hidden');
        return;
    }
    const { uid } = parseJwt(token);

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

function cerrarSesion() {
    localStorage.removeItem('x-token');
    window.location.reload();
}


async function obtenerDatos(params) {

    let apiUrl = `${URL}api/ofertas`;
    const spinner = showSpinner('Realizando busqueda...');

    if (typeof params === 'string' && params.trim() !== '') {
        apiUrl += params;
    }

    limpiarDivs();
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.total > 0) {
            const ofertas = data.ofertas;
            ofertas.forEach(oferta => {
                construirTarjeta(oferta);
            });
        } else {
            console.log('No hay ofertas disponibles.');
        }
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
    finally {
        hideSpinner(spinner);
    }
}



window.onload = async function () {

    const spinner = showSpinner(`Cargando...`);
    try {
        verificarAutenticacion();
        await listarSectoresFilter();
        await listarFechasFilter();
        await cargarModalidadesFilter();

        // Verificar si hay un parámetro en la URL al cargar la página
        const queryParams = new URLSearchParams(window.location.search);
        const sectorParam = queryParams.get('sector');
        const modalidadParam = queryParams.get('modalidad');

        if (modalidadParam) {
            obtenerDatos(`?modalidad=${decodeURIComponent(modalidadParam)}`);
            return;
        }

        if (sectorParam) {
            listarOfertasPorSector(decodeURIComponent(sectorParam));
            return;
        }

        obtenerDatos();

    } catch (error) {
        console.log(error)
    }
    finally {
        hideSpinner(spinner)
    }
};

async function cargarModalidadesFilter() {
    try {
        const response = await fetch(`${URL}api/ofertas/modalidades`);
        const modalidades = await response.json();

        const ulModalidadFilter = document.getElementById('ul-modalidad-filter');

        Object.entries(modalidades).forEach(([modalidad, cantidad]) => {
            const li = document.createElement('li');
            li.dataset.modalidad = modalidad.toLowerCase();
            li.innerHTML = `
                <div class="d-flex justify-content-between">
                    <span>${modalidad.charAt(0).toUpperCase() + modalidad.slice(1)}</span>
                    <span class="ms-2 opacity-75">(${cantidad || 0})</span>
                    <!-- Ajusta la clase y el espacio según tu diseño -->
                </div>
            `;

            li.addEventListener('click', function () {
                const modalidadSeleccionada = this.dataset.modalidad;
                obtenerDatos(`?modalidad=${modalidadSeleccionada}`);

                // Cambiar la URL sin recargar la página
                cambiarURLConFiltro('modalidad', modalidadSeleccionada);
            });

            ulModalidadFilter.appendChild(li);
        });
    } catch (error) {
        console.error('Error al obtener las modalidades', error);
    }
}

async function obtenerFechasDeOfertas() {
    try {
        const response = await fetch(`${URL}api/ofertas/fechas`);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener las fechas desde el backend', error);
        throw error;
    }
}

function contarOfertasEnRango(fechas, inicio, fin) {
    return fechas.filter(fecha => {
        return fecha.toISOString().split('T')[0] === inicio.toISOString().split('T')[0];
    }).length;
}

function crearLiConFormato(nombre, contador) {
    const li = document.createElement('li');
    li.innerHTML = `
        <div class="d-flex justify-content-between">
            <span>${nombre}</span>
            <span class="ms-2 opacity-75">(${contador})</span>
        </div>
    `;
    return li;
}

async function listarFechasFilter() {
    try {
        const fechasDeOfertas = await obtenerFechasDeOfertas();

        const ahora = new Date();
        const rangos = [
            { nombre: 'hoy', inicio: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()), duracion: 1 },
            { nombre: '48hs', inicio: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 2), duracion: 2 },
            { nombre: '72hs', inicio: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 3), duracion: 3 },
            { nombre: 'ultima semana', inicio: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 7), duracion: 7 },
            { nombre: 'hace 15 dias', inicio: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 15), duracion: 15 },
            { nombre: 'ultimos mes', inicio: new Date(ahora.getFullYear(), ahora.getMonth() - 1, ahora.getDate()), duracion: 30 },
            { nombre: 'mas de un mes', inicio: new Date(0) }
        ];

        const ul = document.getElementById('ul-fecha-filter');

        for (const rango of rangos) {
            const fin = rango.duracion ? new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()) : new Date(0);
            const contador = contarOfertasEnRango(fechasDeOfertas.map(fecha => new Date(fecha)), rango.inicio, fin);
            const li = crearLiConFormato(rango.nombre, contador);
            ul.appendChild(li);
        }
    } catch (error) {
        console.error('Error al listar fechas', error);
    }
}

async function listarSectoresFilter() {
    try {
        const response = await fetch(URL + 'api/ofertas/sectores');
        const data = await response.json();

        const areaFilterUl = document.querySelector('#ul-area-filter');

        Object.entries(data).forEach(([sector, cantidad]) => {
            const li = document.createElement('li');
            li.dataset.sector = sector.toLowerCase();
            li.innerHTML = `
                <div class="d-flex justify-content-between">
                    <span>${sector}</span>
                    <span class="ms-2 opacity-75">(${cantidad})</span>
                </div>
            `;

            li.addEventListener('click', function () {
                const sectorSeleccionado = this.dataset.sector;
                listarOfertasPorSector(sectorSeleccionado);
            });
            areaFilterUl.appendChild(li);
        });
    } catch (error) {
        console.error('Error al obtener los sectores', error);
    }
}

async function listarOfertasPorSector(sector) {

    const spinner = showSpinner('Realizando busqueda...');

    try {
        const response = await fetch(`${URL}api/ofertas?sector=${sector}`);

        if (!response.ok) {
            console.log('Sin ofertas para el sector');
        }

        const data = await response.json();

        limpiarDivs();

        data.ofertas.forEach(oferta => {
            construirTarjeta(oferta);
        });

        // Cambiar la URL sin recargar la página
        cambiarURLConFiltro('sector', sector);

    } catch (error) {
        console.log(error);
    }
    finally {
        hideSpinner(spinner);
    }
}


document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const spinner = showSpinner(`Realizando busqueda...`);
    try {
        // Obtener el valor del input de palabra clave
        const palabraClave = encodeURIComponent(document.getElementById('input-palabra-clave').value);

        // Construir la URL del endpoint con el parámetro "termino"
        const url = URL + 'api/ofertas?termino=' + palabraClave;

        // Realizar la solicitud HTTP utilizando Fetch con async/await
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        limpiarDivs();

        if (data.total > 0) {
            const ofertas = data.ofertas;
            // Llama a la función para construir las tarjetas con los datos obtenidos
            for (const oferta of ofertas) {
                construirTarjeta(oferta);
            }
        } else {
            mostrarMensajeNoResultados(palabraClave);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
    finally {
        hideSpinner(spinner);
    }
});

function mostrarMensajeNoResultados(termino) {
    const mensajeElement = document.createElement('div');
    mensajeElement.textContent = `No se encontraron resultados con el termino: "${termino}" .`;
    mensajeElement.style.color = 'red';
    mensajeElement.style.margin = '2rem';
    const contenedorResultados = document.getElementById('col-get-1');
    contenedorResultados.appendChild(mensajeElement);
}


function cambiarURLConFiltro(parametro, valor) {
    const nuevaURL = `${window.location.origin}${window.location.pathname}?${parametro}=${encodeURIComponent(valor)}`;
    history.pushState({ [parametro]: valor }, '', nuevaURL);
}




