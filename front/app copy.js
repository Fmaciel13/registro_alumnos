// ============================================
// Constantes y Headers generales
// ============================================
const API_KEY = "12345ABCDEF";
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${API_KEY}`
};

// ============================================
// Clase base APIClient
// ============================================
class APIClient {
  constructor(baseURL, headers) {
    this.baseURL = baseURL;
    this.headers = headers;
  }
  
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: this.headers,
        ...options
      });
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error en request:", error);
      throw error;
    }
  }
  
  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }
  
  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
  
  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

// ============================================
// Servicios específicos
// ============================================

class StudentService extends APIClient {
  constructor() {
    super("http://localhost:5001/api/students", headers);
  }
  
  registerStudent(name, career) {
    return this.post("", { name, career });
  }
  
  getStudentById(id) {
    return this.get(`/${id}`);
  }
  
  getStudentsByCareer(career) {
    return this.get(`?career=${encodeURIComponent(career)}`);
  }
  
  deleteStudent(id) {
    return this.delete(`/${id}`);
  }
}

class CareerService extends APIClient {
  constructor() {
    super("http://localhost:5001/api/careers", headers);
  }
  
  registerCareer(name) {
    return this.post("", { name });
  }
  
  getCareers() {
    return this.get("");
  }
  
  getCareerByName(name) {
    return this.get(`?name=${encodeURIComponent(name)}`);
  }
  
  deleteCareer(id) {
    return this.delete(`/${id}`);
  }
}

class CategoryService extends APIClient {
  constructor() {
    super("http://localhost:5001/api/categories", headers);
  }
  
  registerCategory(name) {
    return this.post("", { name });
  }
  
  getCategoryByName(name) {
    return this.get(`?name=${encodeURIComponent(name)}`);
  }
}

// ============================================
// Instancias de los servicios
// ============================================
const studentService = new StudentService();
const careerService = new CareerService();
const categoryService = new CategoryService();


// ============================================
// Funciones de interfaz (UI)
// ============================================

// Función para agregar Categorías
async function agregarCategoria() {
    const nombre = document.getElementById('nombreCategoria').value.trim();

    if (!nombre) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'Por favor ingresa el nombre de la categoría.'
        });
        return;
    }

    try {
        const result = await categoryService.registerCategory(nombre);

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
            title: '¡Categoría agregada!',
            text: 'La categoría fue registrada exitosamente.'
        });

        document.getElementById('nombreCategoria').value = '';
        // Si tienes una función para refrescar la tabla de categorías, invócala aquí
        // ejemplo: cargarCategorias();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo registrar la categoría.'
        });
        console.error("Error registrando categoría:", error);
    }
}

// Función para cargar carreras en el select
async function cargarCarrerasEnSelect() {
    const select = document.getElementById('careerSelect');
    if (!select) return;

    // Limpia el select y agrega la opción por defecto
    select.innerHTML = '<option value="">Selecciona una carrera</option>';

    try {
        const carreras = await careerService.getCareers();
        carreras.forEach(carrera => {
            const option = document.createElement('option');
            option.value = carrera.name;
            option.textContent = carrera.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando carreras:", error);
    }

    // Sincroniza el campo oculto al cambiar el select
    select.onchange = function() {
        document.getElementById('registerCareer').value = this.value;
    };
}

// Función para cargar los datos de carreras en una tabla
async function cargarTablaCarreras() {
    const tableBody = document.getElementById('careerTableBody');
    if (!tableBody) return;

    // Limpia la tabla
    tableBody.innerHTML = '';

    try {
        const carreras = await careerService.getCareers();
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

// Función para eliminar una carrera (ya definida en el código anteriormente refactorizado)
async function eliminarCarrera(id) {
    try {
        const result = await careerService.deleteCareer(id);
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
        // Se puede refrescar la tabla de carreras si es necesario
        await cargarTablaCarreras();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la carrera.'
        });
    }
}

// ============================================
// Carga inicial cuando el DOM está listo
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    await cargarCarrerasEnSelect();
    await cargarTablaCarreras();
});
