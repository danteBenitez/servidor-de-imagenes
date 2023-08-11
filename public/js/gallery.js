const imgSection = document.querySelector("#gallery");
document.addEventListener("DOMContentLoaded", showImages);

async function getImages() {
  const provider = imgSection.dataset.provider;
  try {
    const response = await fetch(`/api/images/providers/${provider}`);

    if (!response.ok && response.status != 404) {
      throw response;
    } else if (response.status == 404) {
      return [];
    }

    const { images } = await response.json();

    return images;
  } catch (failedResponse) {
    console.error(failedResponse);
    const body = await failedResponse.json();
    Swal.fire({
      icon: "error",
      title: "Ocurrió un error al obtener imágenes",
      text:
        failedResponse.message ||
        body.message ||
        "Error desconocido. Contacta a los desarrolladores del sitio",
    });
  }
}

async function showImages() {
  const images = await getImages();
  console.log(images);
  if (images.length == 0) {
    imgSection.innerHTML = `
            <span class="lead text-center mx-auto my-4">No hay imágenes que mostrar</span>
        `;
    return;
  }
  const provider = imgSection.dataset.provider;
  const isLocal = provider == 1;
  console.log(provider);

  imgSection.innerHTML = images
    .map(({ id, url }) => {
      return `<div class="overflow-hidden img-container position-relative">
      <div class="overflow-hidden">
        <img
          src=${url}
          class="z-0"
        />
      </div>
      <div
        class="img-tooltip flex-row position-absolute d-flex justify-content-center gap-3 align-items-center top-0 left-0 bg-dark h-100 w-100 z-1"
      >
        <div class="m-2 text-white text-center">
          <i class="fs-3 bi bi-file-earmark-x text-white" onclick="deleteImage(${id})" role="button"></i>
          <span class="visually-hidden">Eliminar</span>
        </div>
        ${
          isLocal &&
          `
        <div class="m-2 text-white text-center">
          <a href="/update-local/${id}">
              <i class="fs-3 bi bi-pencil-fill text-white" role="button"></i>
              <span class="visually-hidden">Actualizar</span>
          </a>
        </div>`
        }
        <div class="m-2 text-white text-center">
          <a href="${url}">
              <i class="fs-3 bi bi-box-arrow-up-right text-white" role="button"></i>
              <span class="visually-hidden">Ir</span>
          </a>
        </div>

      </div>
    </div>`;
    })
    .join("");
}

async function deleteImage(id) {
  console.log;
  await Swal.fire({
    icon: "question",
    title: "¿De verdad desea eliminar la imagen?",
    showCancelButton: true,
    confirmButtonText: "Borrar",
    denyButtonText: `Cancelar`,
  }).then(performDeletion);

  async function performDeletion() {
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: "DELETE",
      });
      console.log(response);
      if (!response.ok) throw response;

      const body = await response.json();

      await Swal.fire({
        icon: "success",
        title: body.message,
      });
    } catch (failedResponse) {
      console.log(failedResponse);
      const body = await failedResponse.json();
      Swal.fire({
        icon: "error",
        title: "Ocurrió un error al obtener imágenes",
        text:
          failedResponse.message ||
          body.message ||
          "Error desconocido. Contacta a los desarrolladores del sitio",
      });
    }
  }

  showImages();
}
