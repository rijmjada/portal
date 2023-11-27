const URL = 'http://localhost:8080/'



function loginFormSubmit() {
    event.preventDefault(); // Evitar la recarga de la página

    let correo = document.getElementById('correo').value;
    let password = document.getElementById('password').value;

    // Validación
    if (correo.trim() === '' || password.trim() === '') {
        alert('Por favor, completa todos los campos.');
        return; // No ejecutar más código si la validación falla
    }

    // Construir el objeto de usuario con el rol
    let usuario = {
        correo: correo,
        password: password
    };

    // Realizar la solicitud POST para iniciar sesión
    fetch(`${URL}api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            correo: usuario.correo,  // Usar el correo del usuario registrado
            password: usuario.password  // Usar la contraseña del formulario de registro
        })
    })
        .then(response => response.json())
        .then(loginData => {
            // Manejar la respuesta del inicio de sesión
            if (loginData.msg) {
                // Mostrar mensaje de error si lo hay
                alert('Error en el inicio de sesión: ' + loginData.msg);
            } else {
                // Mostrar información del usuario y el token de inicio de sesión
                console.log('nombre:', loginData.usuario.nombre);
                console.log('correo:', loginData.usuario.correo);
                console.log('Token de sesión:', loginData.token);
                localStorage.setItem('x-token', loginData.token);
                window.location.href = '/';

            }
        })
        .catch(loginError => {
            // Manejar errores de red u otros en el inicio de sesión
            console.error('Error en la solicitud de inicio de sesión:', loginError);
        });
}


function handleCredentialResponse(response) {

    const body = { id_token: response.credential }

    fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp)
            localStorage.setItem('email', resp.usuario.correo);
        })
        .catch(console.warn)

}

const btnSignOut = document.querySelector('#google_signOut');
btnSignOut.addEventListener('click', async () => {

    console.log(google.accounts.id)
    google.accounts.id.disableAutoSelect()
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        console.log('consent revoked');
        localStorage.clear()
        location.reload()
    });
});