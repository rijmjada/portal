


const URL = 'http://localhost:8080/'    


document.querySelector('#goHome').addEventListener('click', () => {
    window.location.href = '../index.html';
});



function handleFormSubmit() {
    event.preventDefault(); // Evitar la recarga de la página

    let nombre = document.getElementById('nombre').value;
    let apellido = document.getElementById('apellido').value;
    let correo = document.getElementById('correo').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    // Validación
    if (nombre.trim() === '' || apellido.trim() === '' || correo.trim() === '' || password.trim() === '') {
        alert('Por favor, completa todos los campos.');
        return; // No ejecutar más código si la validación falla
    }

    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden. Por favor, verifica.');
        return; // No ejecutar más código si las contraseñas no coinciden
    }

    // Construir el objeto de usuario con el rol
    let usuario = {
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        password: password,
        rol: 'USER'
    };

    // Realizar la solicitud POST
    fetch(`${URL}api/usuarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta
            if (data.errors) {
                // Mostrar errores si los hay
                alert('Error: ' + data.errors[0].msg);
            } else if (data.usuario) {
                // Mostrar información del usuario registrado
                console.log('Usuario registrado:', data.usuario);
                // Realizar la solicitud POST para iniciar sesión
                fetch(`${URL}api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        correo: data.usuario.correo,  // Usar el correo del usuario registrado
                        password: password  // Usar la contraseña del formulario de registro
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
                            console.log('Usuario logueado:', loginData.usuario);
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
        })
        .catch(error => {
            // Manejar errores de red u otros
            console.error('Error en la solicitud:', error);
        });
}
