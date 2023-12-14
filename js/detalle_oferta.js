
let USER_DATA = '';
let UID_OFERTA = '';

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
        await chequearTipoDeUsuario(USER_DATA);
        console.log(USER_DATA)
    } catch (error) {
        console.log(`Error al obtener información del usuario: ${error.message}`);
    }
}

async function chequearTipoDeUsuario(usuario) {
    if (usuario.rol === 'empresa') {
        btn_accion_oferta.classList.add('btn-danger');
        btn_accion_oferta.classList.remove('disabled');
        btn_accion_oferta.textContent = 'Eliminar oferta';
        const message_disabled = document.querySelector('#message_disabled');

        const estado = await chequearEstadoDeOferta(UID_OFERTA);


        // Verificar si la oferta fue publicada por el usuario actual
        if (usuario.ofertasPublicadas.includes(UID_OFERTA)) {
            if (estado) {
                // Agregar listener para el tipo de usuario 'empresa'
                btn_accion_oferta.addEventListener('click', function () {
                    // Lógica para el tipo de usuario 'empresa' (eliminar oferta, por ejemplo)
                    eliminarOferta(); // Debes definir la función eliminarOferta según tus necesidades
                });
            } else {
                document.querySelector('#message_disabled');
                // La oferta no fue publicada por el usuario actual, puedes mostrar un mensaje o deshabilitar el botón, según tus necesidades
                btn_accion_oferta.classList.add('disabled');
                message_disabled.classList.toggle('d-none');
                message_disabled.textContent = 'Esta oferta ya no esta disponible';
            }

        } else {
            document.querySelector('#message_disabled');
            // La oferta no fue publicada por el usuario actual, puedes mostrar un mensaje o deshabilitar el botón, según tus necesidades
            btn_accion_oferta.classList.add('disabled');
            btn_accion_oferta.textContent = 'Postularme';
            message_disabled.classList.toggle('d-none');
            message_disabled.textContent = 'No puedes postularte con una cuenta de empresa';
        }
    }
    else  {
        btn_accion_oferta.classList.remove('disabled');
        btn_accion_oferta.textContent = 'Postularme';

        btn_accion_oferta.addEventListener('click', function () {
            postularse();
        });
    }
}

const btn_accion_oferta = document.querySelector('#btn-accion-oferta');

document.addEventListener('DOMContentLoaded', function () {
    const spinner = showSpinner(`Cargando...`);

    // Obtener el uid de la URL
    const urlParams = new URLSearchParams(window.location.search);
    UID_OFERTA = urlParams.get('oferta');
    obtenerInformacionUsuario();
    console.log(UID_OFERTA);
    hideSpinner(spinner);
});

document.querySelector('#goHome').addEventListener('click', () => {
    window.location.href = '../index.html';
});

async function eliminarOferta() {
    const url = `http://localhost:8080/api/ofertas/${UID_OFERTA}`
    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('x-token');

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-token': token
            },
        });

        if (!response.ok) {
            console.log(`Error en la solicitud: ${response.status}`);
        }

        console.log('todok' + await response.json());

    } catch (error) {
        console.log('todok' + error);
    }
}

async function chequearEstadoDeOferta(uid) {

    const url = `http://localhost:8080/api/ofertas/${uid}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();

        console.log(data.estado)
        return data.estado;

    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
}

async function postularse() {
    const { uid } = USER_DATA;
    const url = `http://localhost:8080/api/usuarios/${uid}`;

    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('x-token');

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-token': token
            },
            body: JSON.stringify({
                ofertaId: UID_OFERTA,
            }),
        });

        if (!response.ok) {
            console.log(`Error en la solicitud: ${response.status}`);
        }
        else {
            console.log( await response.json())
        }

    } catch (error) {
        console.log('todok' + error);
    }
}