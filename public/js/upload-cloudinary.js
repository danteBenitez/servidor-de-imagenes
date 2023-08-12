const form = document.querySelector('form');
const fileInput = document.querySelector('input[type=file]');
const urlContainer = document.querySelector('#url-container');
const submitButton = document.querySelector('input[type=submit]');

form.addEventListener('submit', async (e) => {
    submitButton.value = "Enviando...";
    e.preventDefault();

    const formData = new FormData();
    try {
        // Incluimos todos los archivos en la petición
        Array.from(fileInput.files).forEach(file => {
            formData.append(file.name, file);
        });

        const response = await fetch('/api/images/cloudinary', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw response;

        const { uploaded }= await response.json();

        await Swal.fire({
            icon: 'success',
            title: 'Los archivos se enviaron correctamente',
            text: 'Puede ver las URLs  de las imágenes abajo'
        });

        showUrls(uploaded);

    } catch(failedResponse) {
        console.log(failedResponse);
        // Obtenemos el cuerpo de la petición para poder ver el mensaje de error
        const body = await failedResponse?.json();

        Swal.fire({
          icon: "error",
          title: "Ocurrió un error",
          text: failedResponse.message || body.message || "Error desconocido. Contacta a los desarrolladores del sitio",
        });
    }
    submitButton.value = "Enviar";
});

function showUrls(images) {
    urlContainer.innerHTML = `
        <h1 class="fs-3 lead mt-4">Imágenes subidas: </h1>
    `

    urlContainer.innerHTML += images.map(({ image: originalName, url }) => {
        // Acortar nombre de imagen para mostrarla
        const name = originalName < 10 ? originalName : originalName.slice(0, 10) + "...";

        return `
    <div
      class="d-flex flex-column flex-sm-row w-100 p-3 h-25 border border-1 shadow rounded-3 justify-content-between align-items-center gap-3"
    >
      <div
        class="p-2 d-flex flex-row flex-sm-row border-1 gap-3 border-bottom fs-6 overflow-hidden text-wrap text-truncate align-items-center justify-content-center justify-content-sm-start"
      >
        <i class="bi bi-image-fill"></i>
        ${name}
      </div>
      <small class="fs-5 lead">
        <a href="${url}" target="__blank" class="link-accent overflow-hidden">
            ${url}
        </a>
        <i class="bi bi-box-arrow-up-right mx-2"></i>
      </small>
      <img
        src="${url}"
        class="small-img"
      />
    </div>
        
        `;
    }).join('');
}