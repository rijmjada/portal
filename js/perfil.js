
let USER_UID = '';
let USER_DATA = '';
let URL_CARGAR_IMG = 'http://localhost:8080/api/upload/usuarios/';


// Función para el evento onload
window.onload = function () {
    obtenerInformacionUsuario();
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
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        // Obtener el nombre del usuario desde la respuesta
        const { usuario } = await response.json();
        cargarBtnUserRol(usuario.rol);
        cargarDatosForm(usuario);
        loadImageProfile(usuario.img)
        USER_UID = usuario.uid;
        USER_DATA = usuario;

    } catch (error) {
        console.warn(`Error al obtener información del usuario: ${error.message}`);
    }
}

function cargarBtnUserRol(rol) {
    const btn = document.querySelector('#btn-user-rol');

    if (rol === 'empresa') {
        btn.textContent = 'Mis publicaciones';
    }
    else if (rol === 'postulante') {
        btn.textContent = 'Mis postulaciones';
    }
}

document.querySelector('#btn-user-rol').addEventListener('click', () => {

    toogleColumnas();
    const colTarjetas = document.querySelector('#col-tarjetas');
    colTarjetas.innerHTML = '';

    const paginacion = document.querySelector('#pagination');

    if (USER_DATA.ofertasAplicadas && Array.isArray(USER_DATA.ofertasAplicadas)) {
        // Iterar sobre cada elemento en "ofertasAplicadas"
        USER_DATA.ofertasAplicadas.forEach(async ofertaId => {
            const data = await obtenerDatosDeOferta(ofertaId);
            console.log(data)
            if (data) {
                // Crear una nueva tarjeta
                const nuevaTarjeta = crearTarjeta(data);
                // Agregar la tarjeta al contenedor
                colTarjetas.appendChild(nuevaTarjeta);
            }
        });
    } else {
        console.log("La propiedad 'ofertasAplicadas' no es un array o no existe.");
    }

});

function toogleColumnas() {
    const colImgProfile = document.querySelector('#col-imgProfile');
    colImgProfile.classList.add('d-none');

    const colTarjetasProfile = document.querySelector('#col-tarjetasProfile');
    colTarjetasProfile.classList.remove('d-none');
}



function crearTarjeta(data) {
    // Crear elementos HTML para la nueva tarjeta
    const nuevaTarjeta = document.createElement('div');
    nuevaTarjeta.className = 'col-lg-5 col-12 card m-2 ';
    nuevaTarjeta.style.height = '250px';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const tituloEmpresa = document.createElement('p');
    tituloEmpresa.id = 'titulo-empresa';
    tituloEmpresa.textContent = data.empresa;  // Reemplaza con la propiedad correcta del objeto data

    const fechaPublicacion = document.createElement('p');
    fechaPublicacion.id = 'fecha-publicacion';
    fechaPublicacion.textContent = 'Publicado hoy';  // Puedes agregar la lógica para obtener la fecha actual

    const tituloOferta = document.createElement('h5');
    tituloOferta.className = 'card-title py-2';
    tituloOferta.textContent = data.puesto;  // Reemplaza con la propiedad correcta del objeto data

    const descripcionOferta = document.createElement('p');
    descripcionOferta.className = 'card-text';
    descripcionOferta.textContent = data.descripcion;  // Reemplaza con la propiedad correcta del objeto data

    const ubicacionCard = document.createElement('div');
    ubicacionCard.className = 'ubicacion-card d-flex flex-column';

    const iconoGeo = document.createElement('i');
    iconoGeo.className = 'bi bi-geo-alt';
    iconoGeo.textContent = ` ${data.ubicacion}`;  // Reemplaza con la propiedad correcta del objeto data

    const iconoAcceso = document.createElement('i');
    iconoAcceso.className = 'bi bi-universal-access';
    iconoAcceso.textContent = ` ${data.tipoTrabajo}`;  // Reemplaza con la propiedad correcta del objeto data

    // Agregar elementos a la tarjeta
    ubicacionCard.appendChild(iconoGeo);
    ubicacionCard.appendChild(iconoAcceso);

    cardBody.appendChild(tituloEmpresa);
    cardBody.appendChild(fechaPublicacion);
    cardBody.appendChild(tituloOferta);
    cardBody.appendChild(descripcionOferta);
    cardBody.appendChild(ubicacionCard);

    nuevaTarjeta.appendChild(cardBody);

    return nuevaTarjeta;
}


async function obtenerDatosDeOferta(uid) {
    try {
        const url = `http://localhost:8080/api/ofertas/${uid}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data;

    } catch (error) {
        return null;
    }
}

function cargarDatosForm(usuario = '') {
    const nombreInput = document.getElementById('inputName');
    const apellidoInput = document.getElementById('inputApellido');
    const correoInput = document.getElementById('inputCorreo');

    if (nombreInput && apellidoInput && correoInput) {
        nombreInput.value = usuario.nombre || '';
        apellidoInput.value = usuario.apellido || '';
        correoInput.value = usuario.correo || '';
    }
}


function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/', '');
    return JSON.parse(window.atob(base64));
};


document.querySelector('#goHome').addEventListener('click', () => {
    window.location.href = '../index.html';
});



document.querySelector('#img-user').addEventListener('mouseover', () => {
    document.querySelector('#icon-upload-img').classList.toggle('d-none');
});

document.querySelector('#img-user').addEventListener('mouseout', () => {
    document.querySelector('#icon-upload-img').classList.toggle('d-none');
});

document.querySelector('#img-user').addEventListener('click', () => {

});



// Función para el área de arrastrar y soltar
const dropZone = document.getElementById('drop-area');
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);
dropZone.addEventListener('drop', handleDrop);

function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('bg-danger-subtle');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropZone.classList.remove('bg-danger-subtle');
}

async function handleDrop(e) {
    e.preventDefault();

    console.log('handleDrop executed');
    dropZone.removeEventListener('dragover', handleDragOver);
    dropZone.removeEventListener('drop', handleDrop);

    dropZone.classList.remove('bg-light');
    const files = e.dataTransfer.files;

    try {
        await apiRequest(files[0]);

    } catch (error) {
        console.log(error)
    }
}

async function apiRequest(file) {

    try {

        showLoaderSpinner();

        const formData = new FormData();
        formData.append('archivo', file);

        const response = await fetch(`${URL_CARGAR_IMG}${USER_UID}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error en la carga: ${response.status} ${response.statusText}`);
        }

        const { img } = await response.json();

        hideLoader();
        showSuccessMessage('Archivo cargado correctamente...');
        loadImageProfile(img);

    } catch (error) {
        console.error('Error:', error);
        hideLoader();
        showErrorMessage(error.message);
    }

}

function loadImageProfile(img) {
    const imgElement = document.getElementById('img-user');
    imgElement.src = img ? img : '../assets/PERFIL-VACIO.png';
}

function showLoaderSpinner() {
    dropZone.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>';
}

function hideLoader() {
    dropZone.innerHTML = '<h6>Arrastra y suelta aquí:</h6>';
}

function showSuccessMessage(message) {
    dropZone.innerHTML = `<p class="text-success text-center">${message}</p>`;
}

function showErrorMessage(errorMessage) {
    dropZone.innerHTML = `<p class="text-danger text-center">${errorMessage}</p>`;
}
/** END DRAG AND DROP */


/** */
/** FILE SELECT */
const fileInput = document.getElementById('file-input');

function openFileInput() {
    fileInput.click();
}

fileInput.addEventListener('change', async function () {
    const files = fileInput.files;

    if (files.length > 0) {
        try {
            await apiRequest(files[0]);

            hideLoader();
            showSuccessMessage('Archivo cargado correctamente...');

        } catch (error) {
            console.error('Error:', error);
            hideLoader();
            showErrorMessage(error.message);
        }
    }
});
/** END FILE SELECT */

async function actualizarPerfil(e) {
    e.preventDefault();

    const nombre = document.querySelector('#inputName').value;
    const apellido = document.querySelector('#inputApellido').value;
    const correo = document.querySelector('#inputCorreo').value;
    const contraseñaActual = document.querySelector('#inputPassword').value;
    const newPass = document.querySelector('#inputNewPass').value;
    const confirmPass = document.querySelector('#inputConfirmNewPass').value;

    const userObj = {
        "nombre": nombre,
        "apellido": apellido,
        "correo": correo,
    };

    if (contraseñaActual !== '' || newPass !== '' || confirmPass !== '') {
        handlePasswordUpdate(userObj, contraseñaActual, newPass, confirmPass);
    } else {
        handleProfileUpdate(userObj);
    }
}

async function handlePasswordUpdate(userObj, contraseñaActual, newPass, confirmPass) {
    if (newPass !== confirmPass) {
        messageErrorCheckPassword('Las contraseñas no coinciden');
        return;
    }

    const spinner = showSpinner();
    try {
        const rta = await checkPassword(contraseñaActual);
        if (rta.ok) {
            userObj['password'] = newPass;
            const response = await apiRequestUpdateProfile(userObj);
            messageErrorCheckPassword(response.message);
        } else {
            messageErrorCheckPassword(rta.message);
        }
    } catch (error) {
        messageErrorCheckPassword(`Error en la solicitud de actualización de perfil, ${error}`);
    } finally {
        hideSpinner(spinner);
    }
}

async function handleProfileUpdate(userObj) {
    const spinner = showSpinner();
    try {
        const response = await apiRequestUpdateProfile(userObj);
        if (response.ok) {
            messageErrorCheckPassword(response.message);
        } else {
            messageErrorCheckPassword(response.message);
        }
    } catch (error) {
        messageErrorCheckPassword(`Error en la solicitud de actualización de perfil, ${error}`);
    } finally {
        hideSpinner(spinner);
    }
}

function showSpinner() {
    const spinner = document.querySelector('.loader-container');
    spinner.classList.remove('d-none');
    return spinner;
}

function hideSpinner(spinner) {
    // Ocultar el spinner después de 5 segundos
    setTimeout(function () {
        spinner.classList.add('d-none');
    }, 1500);
}

function messageErrorCheckPassword(message) {
    let parrafo = document.querySelector('#msg-inform-p');
    parrafo.textContent = message;
    parrafo.style.color = 'red';

    let msgErroPass = document.querySelector('#msg-inform-request');
    msgErroPass.classList.remove('d-none');  // Asegúrate de que el contenedor esté visible

    // Ocultar el mensaje después de 5 segundos
    setTimeout(function () {
        msgErroPass.classList.add('d-none');
    }, 2500);
}

async function checkPassword(password) {

    try {
        const token = localStorage.getItem('x-token');
        const { uid } = parseJwt(token);
        const formData = new FormData();

        formData.append('password', password);

        const response = await fetch(`http://localhost:8080/api/usuarios/checkPass/${uid}`, {
            method: 'PUT',
            body: formData,
            headers: {
                'x-token': token
            }
        });

        // Verificar si la respuesta es exitosa (código 2xx)
        if (response.ok) {
            return { ok: true, message: response.message };
        } else {
            const errorResponse = await response.json();
            return { ok: false, message: errorResponse.message };
        }

    } catch (error) {
        return { ok: false, message: error.message };
    }
}

async function apiRequestUpdateProfile(userObj) {
    try {
        const token = localStorage.getItem('x-token');
        const { uid } = parseJwt(token);
        const formData = new FormData();

        if (userObj.password) {
            formData.append('password', userObj.password);
        }
        formData.append('nombre', userObj.nombre);
        formData.append('apellido', userObj.apellido);
        formData.append('correo', userObj.correo);

        const response = await fetch(`http://localhost:8080/api/usuarios/${uid}`, {
            method: 'PUT',
            body: formData,
            headers: {
                'x-token': token
            }
        });

        // Verificar si la solicitud fue exitosa
        if (response.ok) {
            return await response.json();
        } else {
            // En caso de error, lanzar una excepción con el mensaje de error
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    } catch (error) {
        console.error('Error en la solicitud de actualización de perfil:', error);
        throw new Error('Error en la solicitud de actualización de perfil');
    }

}

function togglePasswordFields() {
    let changePasswordCheckbox = document.querySelector('#changePassword');
    let passwordFields = document.querySelector('#passwordContent').querySelectorAll('input[type="password"]');
    let passwordFieldsArray = Array.from(passwordFields);

    for (let i = 0; i < passwordFieldsArray.length; i++) {
        // Agrega o quita el atributo "required" según el estado del checkbox
        passwordFieldsArray[i].required = changePasswordCheckbox.checked;

        // Borra el contenido del campo si el checkbox está desmarcado
        if (!changePasswordCheckbox.checked) {
            passwordFieldsArray[i].value = '';
        }
    }
}

function DeleteAccount(e) {
    e.preventDefault();

    const modal = document.querySelector('#delteModal');
    modal.style.display = 'flex';
}


function eliminarCuenta(e) {
    e.preventDefault();
    console.log('cuenta eliminada');
}

function cerrarModal(e) {
    e.preventDefault();
    const modal = document.querySelector('#delteModal');
    modal.style.display = 'none';
}

