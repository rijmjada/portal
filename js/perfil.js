
let USER = '';
let URL_CARGAR_IMG = 'http://localhost:8080/api/upload/usuarios/';

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
        cargarDatosForm(usuario);
        loadImageProfile(usuario.img)
        USER = usuario.uid;

    } catch (error) {
        console.warn(`Error al obtener información del usuario: ${error.message}`);
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
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

document.querySelector('#goHome').addEventListener('click', () => {
    window.location.href = '../index.html';
});


window.onload = function () {
    obtenerInformacionUsuario();
};


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

        const response = await fetch(`${URL_CARGAR_IMG}${USER}`, {
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
