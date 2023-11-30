const URL = 'http://localhost:8080/'


function loginFormSubmit() {

    event.preventDefault();
    // Limpiar mensajes de error previos
    document.getElementById('error-message').style.display = 'none';

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
            correo: usuario.correo,
            password: usuario.password
        })
    })
        .then(response => response.json())
        .then(loginData => {
            if (loginData.msg) {
                // Mostrar mensaje de error si lo hay
                document.getElementById('error-message').innerText = 'Usuario o contraseña incorrectos.';
                document.getElementById('error-message').style.display = 'block';
            } else {
                // Verificar si el estado del usuario es true
                if (loginData.usuario.estado) {
                    // Mostrar información del usuario y el token de inicio de sesión
                    console.log('nombre:', loginData.usuario.nombre);
                    console.log('correo:', loginData.usuario.correo);
                    console.log('Token de sesión:', loginData.token);
                    localStorage.setItem('x-token', loginData.token);
                    window.location.href = '/';
                }
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
            localStorage.setItem('x-token', resp.token);
            window.location.href = '/';
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




document.querySelector('#goHome').addEventListener('click', () => {
    window.location.href = '../index.html';
});