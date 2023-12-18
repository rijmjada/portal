
const URL = 'https://service-job-node.onrender.com/';


document.querySelector('#goHome').addEventListener('click', () => {
    window.location.href = '../index.html';
});

const boxMessageRequest = document.querySelector('#msg-inform-request');
const textMessageReq = document.querySelector('#msg-inform-p');


async function handleFormSubmit(e) {

    e.preventDefault(); // Evitar la recarga de la página

    try {
        const usuario = obtenerDatosDeUsuarioInputs();

        if (usuario) {
            const respuesta = await apiRequestRegister(usuario);

            if (respuesta.usuario) {
                sendMessageRequestToUserClient('Usuario creado', false);
                await loginUserCreated(usuario);
            }

            if (respuesta.errors) {
                sendMessageRequestToUserClient(respuesta.errors[0].msg, true);
            }
        }
    } catch (error) {
        sendMessageRequestToUserClient(`Error interno, comuniquese con soporte.`, true);
    }
}

function obtenerDatosDeUsuarioInputs() {

    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
        sendMessageRequestToUserClient('Las contraseñas no coinciden. Por favor, verifica.', true)
        return; // No ejecutar más código si las contraseñas no coinciden
    }

    let usuario = {};

    usuario.password = confirmPassword;
    usuario.nombre = document.getElementById('nombre').value;
    usuario.apellido = document.getElementById('apellido').value;
    usuario.correo = document.getElementById('correo').value;
    usuario.rol = 'postulante';

    let checkbox = document.getElementById('registrar_empresa');

    if (checkbox.checked) {
        usuario.nombreEmpresa = document.getElementById('nombre-empresa').value;
        usuario.razonSocial = document.getElementById('razon-social').value;
        usuario.direccion = document.getElementById('direccion').value;
        usuario.telefono = document.getElementById('telefono').value;
        usuario.sector = document.getElementById('selectSector').value;
        usuario.numero_trabajadores = document.getElementById('cantidadTrabajadores').value;
        usuario.rol = 'empresa';
    }

    return usuario;
}

async function apiRequestRegister(objUser) {
    const usuario = objUser;
    let url = URL + 'api/usuarios/';

    if (usuario.rol === 'postulante') {
        url += 'postulante';
    } else {
        url += 'empresa';
    }

    try {
        // Realizar la solicitud POST para registrar al usuario
        const response = await fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        return await response.json();
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw new Error('Error en la solicitud');
    }
}

async function loginUserCreated(usuario) {

    try {
        // Realizar la solicitud POST para iniciar sesión
        const response = await fetch(`${URL}api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo: usuario.correo, // Usar el correo del usuario registrado
                password: usuario.password // Usar la contraseña del formulario de registro
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('x-token', data.token);
            window.location.href = '/';
        }
        else {
            sendMessageRequestToUserClient(`El usuario fue creado pero hubo un error al intentar loguearse.`, true);
        }

    } catch (error) {
        sendMessageRequestToUserClient(`Error interno, comuniquese con soporte.`, true);
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

function toggleEmpresaForm() {
    let checkbox = document.getElementById('registrar_empresa');
    let formFields = document.querySelectorAll('#form_empresa_content input');

    // Verifica si el checkbox está marcado
    const isChekedOrNot = checkbox.checked;

    formFields.forEach((field) => {
        // Establecer el atributo "required" basado en el estado del checkbox
        field.required = isChekedOrNot;
    });

}