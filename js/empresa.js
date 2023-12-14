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
        console.log(usuario);
        cargarDatosFormulario(USER_DATA)
    } catch (error) {
        console.log(`Error al obtener información del usuario: ${error.message}`);
    }
}

function cargarDatosFormulario(user) {
    const nombre = document.querySelector('#inputName');
    const razon_social = document.querySelector('#inputRazonSocial');
    const direccion = document.querySelector('#inputDireccion');
    const telefono = document.querySelector('#inputTelefono');
    const sector = document.querySelector('#selectSector');
    const cantidad_trabajadores = document.querySelector('#cantidadTrabajadores');


    nombre.value = user.nombreEmpresa;
    razon_social.value = user.razonSocial;
    direccion.value = user.direccion;
    telefono.value = user.telefono;
    sector.value = user.sector;
    cantidad_trabajadores.value = user.numero_trabajadores;


}

function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/', '');
    return JSON.parse(window.atob(base64));
};

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


document.addEventListener('DOMContentLoaded', async function () {
    const spinner = showSpinner(`Cargando...`);
    await obtenerInformacionUsuario();
    hideSpinner(spinner)
});

const sector  = document.querySelector('#selecSector');
sector.addEventListener('change', ()=> {
    console.log(sector.value)
});

// function cargarLocalidades() {
//     // Array de provincias y localidades
//     let datosProvincias = cargarProvinciasDatos();

//     // Obtener el elemento del primer dropdown (Provincia)
//     let provinciaDropdown = document.getElementById('selectProvincia');

//     // Obtener el valor seleccionado del primer dropdown
//     let provinciaSeleccionada = provinciaDropdown.value;

//     // Obtener el elemento del segundo dropdown (Localidad)
//     let localidadDropdown = document.getElementById('selectLocalidad');

//     // Limpiar las opciones actuales del segundo dropdown
//     localidadDropdown.innerHTML = '';

//     // Buscar las localidades correspondientes en el array
//     let datosProvincia = datosProvincias.find(function (item) {
//         return item.provincia === provinciaSeleccionada;
//     });

//     // Agregar opciones al segundo dropdown según la provincia seleccionada
//     if (datosProvincia) {
//         datosProvincia.localidades.forEach(function (localidad) {
//             agregarOpcion(localidadDropdown, localidad);
//         });
//     }

//     // Función para agregar opciones al dropdown
//     function agregarOpcion(dropdown, valor) {
//         let option = document.createElement('option');
//         option.text = valor;
//         option.value = valor;
//         dropdown.add(option);
//     }


//     function cargarProvinciasDatos() {
//         return [
//             {
//                 provincia: 'Capital Federal',
//                 localidades: [
//                     'Agronomía',
//                     'Almagro',
//                     'Balvanera',
//                     'Barracas',
//                     'Belgrano',
//                     'Boca',
//                     'Boedo',
//                     'Caballito',
//                     'Chacarita',
//                     'Colegiales',
//                     'Constitución',
//                     'Flores',
//                     'Floresta',
//                     'La Paternal',
//                     'Liniers',
//                     'Mataderos',
//                     'Monserrat',
//                     'Monte Castro',
//                     'Nueva Pompeya',
//                     'Núñez',
//                     'Palermo',
//                     'Parque Avellaneda',
//                     'Parque Chacabuco',
//                     'Parque Chas',
//                     'Parque Patricios',
//                     'Puerto Madero',
//                     'Recoleta',
//                     'Retiro',
//                     'Saavedra',
//                     'San Cristóbal',
//                     'San Nicolás',
//                     'San Telmo',
//                     'Vélez Sársfield',
//                     'Versalles',
//                     'Villa Crespo',
//                     'Villa del Parque',
//                     'Villa Devoto',
//                     'Villa Gral. Mitre',
//                     'Villa Lugano',
//                     'Villa Luro',
//                     'Villa Ortúzar',
//                     'Villa Pueyrredón',
//                     'Villa Real',
//                     'Villa Riachuelo',
//                     'Villa Santa Rita',
//                     'Villa Soldati',
//                     'Villa Urquiza',
//                 ]
//             },
//             {
//                 provincia: 'Buenos Aires',
//                 localidades: ['25 de Mayo',
//                     '3 de Febrero',
//                     '9 de Julio',
//                     'A. Alsina',
//                     'A. Gonzáles Cháves',
//                     'Aguas Verdes',
//                     'Alberti',
//                     'Arrecifes',
//                     'Ayacucho',
//                     'Azul',
//                     'Bahía Blanca',
//                     'Balcarce',
//                     'Baradero',
//                     'Bartolome Mitre',
//                     'Benito Juárez',
//                     'Berisso',
//                     'Bolívar',
//                     'Bragado',
//                     'Brandsen',
//                     'Campana',
//                     'Cañuelas',
//                     'Capilla del Señor',
//                     'Capitán Sarmiento',
//                     'Carapachay',
//                     'Carhue',
//                     'Cariló',
//                     'Carlos Casares',
//                     'Carlos Tejedor',
//                     'Carmen de Areco',
//                     'Carmen de Patagones',
//                     'Castelli',
//                     'Chacabuco',
//                     'Chascomús',
//                     'Chivilcoy',
//                     'Colón',
//                     'Coronel Dorrego',
//                     'Coronel Pringles',
//                     'Coronel Rosales',
//                     'Coronel Suarez',
//                     'Costa Azul',
//                     'Costa Chica',
//                     'Costa del Este',
//                     'Costa Esmeralda',
//                     'Daireaux',
//                     'Darregueira',
//                     'Del Viso',
//                     'Dolores',
//                     'Don Torcuato',
//                     'Ensenada',
//                     'Escobar',
//                     'Exaltación de la Cruz',
//                     'Florentino Ameghino',
//                     'Garín',
//                     'Gral. Alvarado',
//                     'Gral. Alvear',
//                     'Gral. Arenales',
//                     'Gral. Belgrano',
//                     'Gral. Guido',
//                     'Gral. Lamadrid',
//                     'Gral. Las Heras',
//                     'Gral. Lavalle',
//                     'Gral. Madariaga',
//                     'Gral. Pacheco',
//                     'Gral. Paz',
//                     'Gral. Pinto',
//                     'Gral. Pueyrredón',
//                     'Gral. Rodríguez',
//                     'Gral. Viamonte',
//                     'Gral. Villegas',
//                     'Guaminí',
//                     'Guernica',
//                     'Hipólito Yrigoyen',
//                     'Ing. Maschwitz',
//                     'Junín',
//                     'La Plata',
//                     'Laprida',
//                     'Las Flores',
//                     'Las Toninas',
//                     'Leandro N. Alem',
//                     'Lincoln',
//                     'Loberia',
//                     'Lobos',
//                     'Los Cardales',
//                     'Los Toldos',
//                     'Lucila del Mar',
//                     'Luján',
//                     'Magdalena',
//                     'Maipú',
//                     'Mar Chiquita',
//                     'Mar de Ajó',
//                     'Mar de las Pampas',
//                     'Mar del Plata',
//                     'Mar del Tuyú',
//                     'Marcos Paz',
//                     'Mercedes',
//                     'Miramar',
//                     'Monte',
//                     'Monte Hermoso',
//                     'Munro',
//                     'Navarro',
//                     'Necochea',
//                     'Olavarría',
//                     'Partido de la Costa',
//                     'Pehuajó',
//                     'Pellegrini',
//                     'Pergamino',
//                     'Pigüé',
//                     'Pila',
//                     'Pilar',
//                     'Pinamar',
//                     'Pinar del Sol',
//                     'Polvorines',
//                     'Pte. Perón',
//                     'Puán',
//                     'Punta Indio',
//                     'Ramallo',
//                     'Rauch',
//                     'Rivadavia',
//                     'Rojas',
//                     'Roque Pérez',
//                     'Saavedra',
//                     'Saladillo',
//                     'Salliqueló',
//                     'Salto',
//                     'San Andrés de Giles',
//                     'San Antonio de Areco',
//                     'San Antonio de Padua',
//                     'San Bernardo',
//                     'San Cayetano',
//                     'San Clemente del Tuyú',
//                     'San Nicolás',
//                     'San Pedro',
//                     'San Vicente',
//                     'Santa Teresita',
//                     'Suipacha',
//                     'Tandil',
//                     'Tapalqué',
//                     'Tordillo',
//                     'Tornquist',
//                     'Trenque Lauquen',
//                     'Tres arroyos',
//                     'Tres Lomas',
//                     'Villa Gesell',
//                     'Villarino',
//                     'Zárate',]
//             },
//             {
//                 provincia: 'Buenos Aires-GBA',
//                 localidades: ['11 de Septiembre',
//                     '20 de Junio',
//                     '25 de Mayo',
//                     '9 de Abril',
//                     'Acassuso',
//                     'Adrogué',
//                     'Aldo Bonzi',
//                     'Almirante Brown',
//                     'Área Reserva Cinturón Ecológico',
//                     'Avellaneda',
//                     'Banfield',
//                     'Barrio Parque',
//                     'Barrio Santa Teresita',
//                     'Beccar',
//                     'Bella Vista',
//                     'Berazategui',
//                     'Bernal Este',
//                     'Bernal Oeste',
//                     'Billinghurst',
//                     'Boulogne',
//                     'Burzaco',
//                     'Carapachay',
//                     'Caseros',
//                     'Castelar',
//                     'Churruca',
//                     'Ciudad Evita',
//                     'Ciudad Madero',
//                     'Ciudadela',
//                     'Claypole',
//                     'Crucecita',
//                     'Dock Sud',
//                     'Don Bosco',
//                     'Don Orione',
//                     'El Jagüel',
//                     'El Libertador',
//                     'El Palomar',
//                     'El Tala',
//                     'El Trébol',
//                     'Ezeiza',
//                     'Ezpeleta',
//                     'Florencio Varela',
//                     'Florida',
//                     'Francisco Álvarez',
//                     'Gerli',
//                     'Glew',
//                     'González Catán',
//                     'Gral. Lamadrid',
//                     'Grand Bourg',
//                     'Gregorio de Laferrere',
//                     'Guillermo Enrique Hudson',
//                     'Haedo',
//                     'Hurlingham',
//                     'Ing. Sourdeaux',
//                     'Isidro Casanova',
//                     'Ituzaingó',
//                     'José C. Paz',
//                     'José Ingenieros',
//                     'José Marmol',
//                     'La Lucila',
//                     'La Reja',
//                     'La Tablada',
//                     'Lanús',
//                     'Llavallol',
//                     'Loma Hermosa',
//                     'Lomas de Zamora',
//                     'Lomas del Millón',
//                     'Lomas del Mirador',
//                     'Longchamps',
//                     'Los Polvorines',
//                     'Luis Guillón',
//                     'Malvinas Argentinas',
//                     'Martín Coronado',
//                     'Martínez',
//                     'Merlo',
//                     'Ministro Rivadavia',
//                     'Monte Chingolo',
//                     'Monte Grande',
//                     'Moreno',
//                     'Morón',
//                     'Muñiz',
//                     'Olivos',
//                     'Pablo Nogués',
//                     'Pablo Podestá',
//                     'Paso del Rey',
//                     'Pereyra',
//                     'Piñeiro',
//                     'Plátanos',
//                     'Pontevedra',
//                     'Quilmes',
//                     'Rafael Calzada',
//                     'Rafael Castillo',
//                     'Ramos Mejía',
//                     'Ranelagh',
//                     'Remedios de Escalada',
//                     'Sáenz Peña',
//                     'San Antonio de Padua',
//                     'San Fernando',
//                     'San Francisco Solano',
//                     'San Isidro',
//                     'San José',
//                     'San Justo',
//                     'San Martín',
//                     'San Miguel',
//                     'Santos Lugares',
//                     'Sarandí',
//                     'Sourigues',
//                     'Tapiales',
//                     'Temperley',
//                     'Tigre',
//                     'Tortuguitas',
//                     'Tristán Suárez',
//                     'Trujui',
//                     'Turdera',
//                     'Valentín Alsina',
//                     'Vicente López',
//                     'Villa Adelina',
//                     'Villa Ballester',
//                     'Villa Bosch',
//                     'Villa Caraza',
//                     'Villa Celina',
//                     'Villa Centenario',
//                     'Villa de Mayo',
//                     'Villa Diamante',
//                     'Villa Domínico',
//                     'Villa España',
//                     'Villa Fiorito',
//                     'Villa Guillermina',
//                     'Villa Insuperable',
//                     'Villa José León Suárez',
//                     'Villa La Florida',
//                     'Villa Luzuriaga',
//                     'Villa Martelli',
//                     'Villa Obrera',
//                     'Villa Progreso',
//                     'Villa Raffo',
//                     'Villa Sarmiento',
//                     'Villa Tesei',
//                     'Villa Udaondo',
//                     'Virrey del Pino',
//                     'Wilde',
//                     'William Morris',]
//             },
//             {
//                 provincia: 'Catamarca',
//                 localidades: [
//                     'Aconquija',
//                     'Ambato',
//                     'Ancasti',
//                     'Andalgalá',
//                     'Antofagasta',
//                     'Belén',
//                     'Capayán',
//                     'Catamarca',
//                     'Corral Quemado',
//                     'El Alto',
//                     'El Rodeo',
//                     'F.Mamerto Esquiú',
//                     'Fiambalá',
//                     'Hualfín',
//                     'Huillapima',
//                     'Icaño',
//                     'La Puerta',
//                     'Las Juntas',
//                     'Londres',
//                     'Los Altos',
//                     'Los Varela',
//                     'Mutquín',
//                     'Paclín',
//                     'Poman',
//                     'Pozo de La Piedra',
//                     'Puerta de Corral',
//                     'Puerta San José',
//                     'Recreo',
//                     'S.F.V de 4',
//                     'San Fernando',
//                     'San Fernando del Valle',
//                     'San José',
//                     'Santa María',
//                     'Santa Rosa',
//                     'Saujil',
//                     'Tapso',
//                     'Tinogasta',
//                     'Valle Viejo',
//                     'Villa Vil',
//                 ]
//             },
//             {
//                 provincia: 'Córdoba',
//                 localidades: ['Localidad A', 'Localidad B']
//             },
//             {
//                 provincia: 'Buenos Aires',
//                 localidades: ['Localidad A', 'Localidad B']
//             },
//             {
//                 provincia: 'Buenos Aires',
//                 localidades: ['Localidad A', 'Localidad B']
//             },
//             {
//                 provincia: 'Buenos Aires',
//                 localidades: ['Localidad A', 'Localidad B']
//             },
//             {
//                 provincia: 'Buenos Aires',
//                 localidades: ['Localidad A', 'Localidad B']
//             },
//             {
//                 provincia: 'Buenos Aires',
//                 localidades: ['Localidad A', 'Localidad B']
//             }, {
//                 provincia: 'Buenos Aires',
//                 localidades: ['Localidad A', 'Localidad B']
//             },
//             {
//                 provincia: 'Buenos Aires',
//                 localidades: ['Localidad A', 'Localidad B']
//             },
//             {
//                 provincia: 'Buenos Aires',
//                 localidades: ['Localidad A', 'Localidad B']
//             },
//             // Agrega más provincias y localidades según sea necesario
//         ];
//     }
// }