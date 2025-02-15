document.getElementById("soporteForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let archivoInput = document.getElementById("archivo");
    let archivos = archivoInput.files;
    let archivosBase64 = [];

    for (let archivo of archivos) {
        if (archivo.size > 5 * 1024 * 1024) { // Límite de 5MB por archivo
           alert("El archivo \"" + archivo.name + "\" supera el límite de 5MB.");

            return;
        }
        let base64 = await convertirArchivoBase64(archivo);
        archivosBase64.push({ nombre: archivo.name, contenido: base64 });
    }

    mostrarModal("Enviando solicitud... <br><br> <span class='loading-spinner'></span>");
    
    enviarFormulario(archivosBase64);
});

async function convertirArchivoBase64(archivo) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(archivo);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = error => reject(error);
    });
}

async function enviarFormulario(archivosBase64) {
    let datos = {
        titulo: document.getElementById("titulo").value.trim(),
        pais: document.getElementById("pais").value.trim(),
        nombre: document.getElementById("nombre").value.trim(),
        email: document.getElementById("email").value.trim(),
        celular: document.getElementById("celular").value.trim(),
        empresa: document.getElementById("empresa").value.trim(),
        sistema: document.getElementById("Software").value,  // Corrige "sistema" a "Software"
        problema: document.getElementById("problema").value.trim(),
        archivos: archivosBase64
    };

    try {
        let respuesta = await fetch("https://prod-16.westus.logic.azure.com:443/workflows/2cfaeb058ecb47e5b679c083da7b1d44/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=pbZy62GIyFMt6GheeC82rP90gXBdwiLfE2hWjz_BQZQ", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        if (respuesta.ok) {
            mostrarModal("✅ Su solicitud ha sido enviada con éxito. <br> Revise su correo electrónico para el seguimiento a su requerimiento.");
            setTimeout(() => cerrarModal(), 3000);
            document.getElementById("soporteForm").reset();
        } else {
            mostrarModal("❌ Error al enviar el formulario. Inténtelo de nuevo.");
            setTimeout(() => cerrarModal(), 3000);
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarModal("⚠️ Hubo un problema al enviar los datos. Verifique su conexión e inténtelo de nuevo.");
        setTimeout(() => cerrarModal(), 3000);
    }
}

// Función para mostrar el modal
function mostrarModal(mensaje) {
    let modal = document.getElementById("modal");
    let modalMessage = document.getElementById("modal-message");
    modalMessage.innerHTML = mensaje;
    modal.style.display = "flex";
}

// Función para cerrar el modal
function cerrarModal() {
    let modal = document.getElementById("modal");
    modal.style.display = "none";
}
function mostrarOpcionesERP() {
    var softwareSeleccionado = document.getElementById("Software").value;
    var erpOptions = document.getElementById("erpOptions");

    if (softwareSeleccionado === "ERP") {
        erpOptions.style.display = "block";
    } else {
        erpOptions.style.display = "none";
    }
}

function obtenerProblemasERP() {
    let checkboxes = document.querySelectorAll('input[name="erpProblema"]:checked');
    let problemasSeleccionados = Array.from(checkboxes).map(checkbox => checkbox.value);
    return problemasSeleccionados;
}

async function enviarFormulario() {
    let datos = {
        titulo: document.getElementById("titulo").value.trim(),
        pais: document.getElementById("pais").value.trim(),
        nombre: document.getElementById("nombre").value.trim(),
        email: document.getElementById("email").value.trim(),
        celular: document.getElementById("celular").value.trim(),
        empresa: document.getElementById("empresa").value.trim(),
        sistema: document.getElementById("Software").value,
        problema: document.getElementById("problema").value.trim(),
        problemasERP: obtenerProblemasERP(), // Captura los problemas ERP si están seleccionados
    };

    console.log(datos); // Puedes verificar en la consola si se capturan bien los datos

    try {
        let respuesta = await fetch("URL_DEL_SERVIDOR", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });

        if (respuesta.ok) {
            alert("Formulario enviado correctamente");
            document.getElementById("soporteForm").reset();
            document.getElementById("erpOptions").style.display = "none"; // Oculta ERP después de enviar
        } else {
            alert("Error al enviar el formulario");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al enviar los datos");
    }
}