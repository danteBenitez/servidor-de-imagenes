const form = document.querySelector('form');
const fileInput = document.querySelector('input[type=file]');
const submitButton = document.querySelector('input[type=submit]');

form.addEventListener('submit', async (e) => {
    submitButton.value = 'Enviando...';
    e.preventDefault();

    const formData = new FormData();
    try {
        // Incluimos todos los archivos en la petición
        Array.from(fileInput.files).forEach(file => {
            formData.append(file.name, file);
        });

        const response = await fetch(`/api/images/local/`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw response;

        await Swal.fire({
            icon: 'success',
            title: 'El archivo se envío correctamente',
            text: 'redireccionándolo a la página principal'
        });

        setTimeout(() => {
            window.location.assign('/');
        }, 500);

    } catch(failedResponse) {
        // Obtenemos el cuerpo de la petición para poder ver el mensaje de error
        const body = await failedResponse?.json();
        Swal.fire({
          icon: "error",
          title: "Ocurrió un error",
          text: failedResponse.message || body.message || "Error desconocido. Contacta a los desarrolladores del sitio",
        });
    }
    submitButton.value = 'Enviar'
})