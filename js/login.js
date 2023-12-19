
const URL = 'https://backjob-production.up.railway.app/'


function loginFormSubmit(event) {

    event.preventDefault();
    let correo = document.getElementById('correo').value;
    let password = document.getElementById('password').value;

    if (correo.trim() === '' || password.trim() === '') {
        sendMessageRequestToUserClient('Por favor, completa todos los campos.', true);
    }
    let user = {
        correo: correo,
        password: password
    };

    apiRequestLoginUser(user)
}

async function apiRequestLoginUser(user) {
    try {
        const response = await fetch(`${URL}api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();

        if (!response.ok) {
            sendMessageRequestToUserClient(data.msg, true);
        } else {
            if (data.usuario.estado) {
                localStorage.setItem('x-token', data.token);
                window.location.href = '/';
            }
        }
    } catch (error) {
        sendMessageRequestToUserClient('Error interno en el servidor', true);
    }
}



function sendMessageRequestToUserClient(message, errors) {
    const boxMessageRequest = document.querySelector('#msg-inform-request');
    const textMessageReq = document.querySelector('#msg-inform-p');

    boxMessageRequest.classList.toggle('d-none');
    textMessageReq.textContent = message;

    textMessageReq.style.color = errors ? 'red' : 'blue';

    setTimeout(() => {
        boxMessageRequest.classList.toggle('d-none');
        textMessageReq.textContent = '';
        textMessageReq.style.color = '';
    }, 1500);
}

function handleCredentialResponse(response) {

    const body = { id_token: response.credential }

    fetch(`${URL}api/auth/google`, {
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
