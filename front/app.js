// 1. Constantes y configuración

const API_STUDENTS_URL = "http://localhost:5001/api/students";
const API_CAREERS_URL = "http://localhost:5001/api/careers";
const API_CATEGORIES_URL = "http://localhost:5001/api/categories";
const API_KEY = "12345ABCDEF";

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
};

// 2. Servicios de estudiantes (API) -
// Registra un nuevo estudiante enviando nombre y carrera al backend.
// Obtiene un estudiante por su ID desde el backend.
// Obtiene todos los estudiantes de una carrera específica.
// Elimina un estudiante por su ID.


async function registerStudentService(name, career) {
     const response = await fetch(API_STUDENTS_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ name, career })
    });
    return response.json(); }
async function getStudentByIdService(id) { 
    const response = await fetch(`${API_STUDENTS_URL}/${id}`, {
        method: "GET",
        headers
    });
    return response.json();
 }
async function getStudentsByCareerService(career) { 
    const response = await fetch(`${API_STUDENTS_URL}?career=${career}`, {
        method: "GET",
        headers
    });
    return response.json();
 }
async function deleteStudentService(id) { 
    const response = await fetch(`${API_STUDENTS_URL}/${id}`, {
        method: "DELETE",
        headers
    });
    return response.json();
 }

// 3. Servicios de carreras (API)
// Registra una nueva carrera en el sistema.
// Busca una carrera por su nombre.
// Elimina una carrera por su ID.   


async function registerCareerService(name) { 
    const response = await fetch(`${API_CAREERS_URL}`, {  
        method: "POST",
        headers,
        body: JSON.stringify({ name })
    });
    return response.json();
 }
async function getCareerByNameService(name) { 
    const response = await fetch(`${API_CAREERS_URL}?name=${encodeURIComponent(name)}`, {
        method: "GET",
        headers
    });
    return response.json();
 }
async function deleteCareerService(id) { 
    const response = await fetch(`${API_CAREERS_URL}/${id}`, {
        method: "DELETE",
        headers
    });
    return response.json();
 }

// 4. Servicios de categorías (API)
// Registra una nueva categoría en el sistema.
// Busca una categoría por su nombre.

async function registerCategoryService(name) { 
    const response = await fetch(`${API_CATEGORIES_URL}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name })
    });
    return response.json();
 }
async function getCategoryByNameService(name) { const response = await fetch(`${API_CATEGORIES_URL}?name=${encodeURIComponent(name)}`, {
        method: "GET",
        headers
    });
    return response.json(); }


// 5. Funciones de interfaz - Estudiantes
// Toma los datos del formulario y registra un estudiante.
// Consulta y muestra un estudiante por su ID.
// Consulta y muestra todos los estudiantes de una carrera.
// Elimina un estudiante por su ID y muestra el resultado.


async function registerStudent() { 
    const name = document.getElementById('registerName').value.trim();
    const career = document.getElementById('registerCareer').value.trim();
    const resultContainer = document.getElementById('registerResult');

    if (!name || !career) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor completa ambos campos: Nombre y Carrera.'
        });
        return;
    }

    try {
        const result = await registerStudentService(name, career);

        if (result.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.error
            });
            return;
        }

        Swal.fire({
            title: "Registro Exitoso",
            text: "Bienvenido a nuestra comunidad",
            icon: "success"
        });

        // Limpia los inputs
        document.getElementById('registerName').value = '';
        document.getElementById('registerCareer').value = '';

    } catch (error) {
        console.error("Error registering student:", error);
        resultContainer.textContent = "Failed to register student.";
    }
 }
async function getStudentById() { 
    const id = document.getElementById('studentId').value.trim();

    if (!id) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'Por favor ingresa el ID del estudiante.'
        });
        return;
    }

    try {
        const student = await getStudentByIdService(id);
        const resultContainer = document.getElementById('getResult');
        if (student.error) {
            resultContainer.textContent = student.error;
        } else {
            resultContainer.innerHTML = `
                <strong>ID:</strong> ${student.id}<br>
                <strong>Name:</strong> ${student.name}<br>
                <strong>Career:</strong> ${student.career}
            `;
        }
        } catch (error) {
        console.error("Error fetching student:", error);
        document.getElementById('getResult').textContent = "No se puede obtener el estudiante.";
    }
 }
async function getStudentsByCareer() {  
    const career = document.getElementById('careerFilter').value.trim();

    if (!career) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'Por favor ingresa una carrera para filtrar.'
        });
        return;
    }

    try {
        const students = await getStudentsByCareerService(career);
        const resultContainer = document.getElementById('careerResult');

        if (students.length === 0) {
            resultContainer.textContent = "No se encontraron estudiantes para esa carrera.";
            return;
        }
    // Limpiar resultados anteriores
        resultContainer.innerHTML = '';

    // Muestra cada estudiante en una tarjeta
        students.forEach(student => {
            const studentDiv = document.createElement('div');
            studentDiv.classList.add('student-card');
            studentDiv.innerHTML = `
                <strong>ID:</strong> ${student.id}<br>
                <strong>Name:</strong> ${student.name}<br>
                <strong>Career:</strong> ${student.career}
            `;
            resultContainer.appendChild(studentDiv);

    // Separador entre tarjetas (opcional)
            const hr = document.createElement('hr');
            resultContainer.appendChild(hr);
        });

    } catch (error) {
        console.error("Error fetching students:", error);
        document.getElementById('careerResult').textContent = "Failed to fetch students.";
    }
}

async function deleteStudent() { 
const id = document.getElementById('deleteId').value.trim();

    if (!id) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'Por favor ingresa el ID del estudiante a eliminar.'
        });
        return;
    }

    try {
        const result = await deleteStudentService(id);
        document.getElementById('deleteResult').textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        console.error("Error al eliminar estudiante:", error);
        document.getElementById('deleteResult').textContent = "No se pudo eliminar al estudiante";
    }
 }

// 6. Funciones de interfaz - Carreras
// Registra una nueva carrera desde el formulario.
// Elimina una carrera por su ID y muestra el resultado.
// Carga las carreras disponibles en el <select> del formulario de registro de estudiantes.
// Carga la tabla de carreras en la interfaz.


async function registerCareer() { 
const name = document.getElementById('careerName').value.trim();
    const resultContainer = document.getElementById('careerRegisterResult');

    if (!name) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'Por favor ingresa el nombre de la carrera.'
        });
        return;
    }

    try {
        const result = await registerCareerService(name);

        if (result.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.error
            });
            return;
        }

        Swal.fire({
            title: "¡Carrera registrada!",
            text: "La carrera fue agregada exitosamente.",
            icon: "success"
        });

        document.getElementById('careerName').value = '';
        resultContainer.textContent = "";
    } catch (error) {
        console.error("Error registrando carrera:", error);
        resultContainer.textContent = "No se pudo registrar la carrera.";
    }
 }

async function eliminarCarrera(id) { 
 try {
        const result = await deleteCareerService(id);
        if (result.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.error
            });
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Carrera eliminada',
            text: 'La carrera fue eliminada correctamente.'
        });
        // Refresca la tabla de carreras si tienes una función para eso
        // cargarCarreras();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la carrera.'
        });
    }
 }

async function cargarCarrerasEnSelect() { 
    const select = document.getElementById('careerSelect');
    if (!select) return;

    // Limpia el select y agrega la opción por defecto
    select.innerHTML = '<option value="">Selecciona una carrera</option>';

    try {
        const response = await fetch(API_CAREERS_URL, { headers });
        const carreras = await response.json();

        carreras.forEach(carrera => {
            const option = document.createElement('option');
            option.value = carrera.name;
            option.textContent = carrera.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando carreras:", error);
    }

    // Sincroniza el campo oculto al cambiar
    select.onchange = function() {
        document.getElementById('registerCareer').value = this.value;
    };
 }
async function cargarTablaCarreras() { 
    const tableBody = document.getElementById('careerTableBody');
    if (!tableBody) return;

    // Limpia la tabla
    tableBody.innerHTML = '';

    try {
        const response = await fetch(API_CAREERS_URL, { headers });
        const carreras = await response.json();
        console.log("Carreras obtenidas:", carreras);
        carreras.forEach(carrera => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${carrera.id}</td>
                <td>${carrera.name}</td>
                <td>
                    <button class="btn btn-danger" onclick="eliminarCarrera(${carrera.id})">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error cargando carreras:", error);
    }
 }

// 7. Funciones de interfaz - Categorías
// Registra una nueva categoría desde el formulario.
// Carga las categorías disponibles en el <select> del formulario de registro de estudiantes.   
// Carga la tabla de categorías en la interfaz.
// Elimina una categoría por su ID y muestra el resultado.

async function registerCategory() { 
    const name = document.getElementById('categoryName').value.trim();
    const resultContainer = document.getElementById('categoryRegisterResult');

    if (!name) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'Por favor ingresa el nombre de la categoría.'
        });
        return;
    }

    try {
        const response = await fetch(API_CATEGORIES_URL, {
            method: "POST",
            headers,
            body: JSON.stringify({ name })
        });
        const result = await response.json();

        if (result.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.error
            });
            resultContainer.textContent = result.error;
            return;
        }

        Swal.fire({
            icon: 'success',
            title: '¡Categoría registrada!',
            text: 'La categoría fue agregada exitosamente.'
        });
            resultContainer.textContent = "";
        document.getElementById('categoryName').value = '';
        // Si tienes una tabla/lista de categorías, recárgala aquí:
        // cargarTablaCategorias();

        await cargarTablaCategorias(); // Refresca la tabla de categorías

    } catch (error) {
        console.error("Error registrando categoría:", error);
        resultContainer.textContent = "No se pudo registrar la categoría.";
    }
 }
async function cargarCategoriasEnSelect() { 
    const select = document.getElementById('categorySelect');
    if (!select) return;

    // Limpia el select y agrega la opción por defecto
    select.innerHTML = '<option value="">Selecciona una categoría</option>';

    try {
        const response = await fetch(API_CATEGORIES_URL, { headers });
        const categorias = await response.json();

        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.name;
            option.textContent = categoria.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando categorías:", error);
    }

    // Sincroniza el campo oculto al cambiar (si lo usas)
    select.onchange = function() {
        const hidden = document.getElementById('registerCategory');
        if (hidden) hidden.value = this.value;
    };
 }
async function cargarTablaCategorias() { 
    const tableBody = document.getElementById('categoryTableBody');
    if (!tableBody) return;

    // Limpia la tabla
    tableBody.innerHTML = '';

    try {
        const response = await fetch(API_CATEGORIES_URL, { headers });
        const categorias = await response.json();
        categorias.forEach(categoria => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${categoria.id}</td>
                <td>${categoria.name}</td>
                <td>
                    <button class="btn btn-danger" onclick="eliminarCategoria(${categoria.id})">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error cargando categorías:", error);
    }
 }

async function eliminarCategoria(id) { 
    try {
        const response = await fetch(`${API_CATEGORIES_URL}/${id}`, {
            method: "DELETE",
            headers
        });
        const result = await response.json();
        if (result.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.error
            });
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Categoría eliminada',
            text: 'La categoría fue eliminada correctamente.'
        });
        cargarTablaCategorias(); // Refresca la tabla
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la categoría.'
        });
    }
 }

// 8. Eventos de carga de DOM
// Evento para cargar carreras al iniciar la página.
// Evento para cargar categorías al iniciar la página.


document.addEventListener('DOMContentLoaded', async () => {
    await cargarCarrerasEnSelect();
    await cargarTablaCarreras();
});
document.addEventListener('DOMContentLoaded', async () => {
    await cargarCategoriasEnSelect();
    await cargarTablaCategorias();
});



/* 
-----------------------------------------------------------
RESUMEN DEL FLUJO DE LA APLICACIÓN

- El usuario puede registrar, consultar y eliminar estudiantes, carreras y categorías.
- Cada acción en la interfaz llama a una función que se comunica con el backend usando fetch y muestra los resultados en pantalla.
- Al cargar la página, se inicializan los select y tablas con los datos actuales del backend.
- Se utilizan alertas (SweetAlert2) para informar al usuario sobre el éxito o error de las operaciones.
- El código está organizado en funciones de servicio (API) y funciones de interfaz (UI) para mayor claridad y mantenimiento.

-----------------------------------------------------------
*/