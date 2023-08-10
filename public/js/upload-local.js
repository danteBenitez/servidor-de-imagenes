const form = document.querySelector('form');
const fileInput = document.querySelector('input[type=file]');
console.log("Hello, world");
form.addEventListener('submit', async (e) => {
    
    e.preventDefault();

    const formData = new FormData();
    try {
        console.log(fileInput.files);
        Array.from(fileInput.files).forEach(file => {
            formData.append(file.name, file);
        })
        const response = await fetch('/api/images/local', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw response;

        await Swal.fire({
            icon: 'success',
            title: 'El archivo se envío correctamente',
            text: 'Redireccionándolo a la página principal'
        });

        setTimeout(() => {
            window.location.assign('/');
        }, 500);

    } catch(err) {
        Swal.fire({
          icon: "error",
          title: "Ocurrió un error",
          text: err.message || "Error desconocido. Contacta a los desarrolladores del sitio",
        });
    }



})