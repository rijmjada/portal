function obtenerInformacionUsuario() {

    // Obtener el token del localStorage
    const token = localStorage.getItem('x-token');

    // Si no hay un token, el usuario no está autenticado
    if (!token) {
        alert('ERROR')
        return;
    }

    const { uid } = parseJwt(token);
    console.log(uid)

    // Realizar una solicitud GET para obtener la información del usuario
    fetch(`http://localhost:8080/api/usuarios/${uid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(resp => {
            // Verificar si la solicitud fue exitosa (código de estado 2xx)
            if (!resp.ok) {
                throw new Error(`Error en la solicitud: ${resp.status}`);
            }
            return resp.json();
        })
        .then(resp => {
            // Obtener el nombre del usuario desde la respuesta
            console.log(resp)
        })
        .catch(error => {
            console.warn(`Error al obtener información del usuario: ${error.message}`);
        });
}

window.onload = function () {
    obtenerInformacionUsuario();
};