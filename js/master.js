const credencial =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTUchQFbdYFGKukEjibPD6hG6e-zXv0SYIzluqDbHu8u7NWvnGN0LgEzPGcF-sJrQ/pub?gid=680415088&single=true&output=csv";

const cursos =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTUchQFbdYFGKukEjibPD6hG6e-zXv0SYIzluqDbHu8u7NWvnGN0LgEzPGcF-sJrQ/pub?gid=1215013168&single=true&output=csv";

window.addEventListener("DOMContentLoaded", init);

const loaderElem = document.querySelector(".loader");
const credencialTituloElem = document.querySelector("#credencialTitulo");
const credencialCreditosElem = document.querySelector("#credencialCreditos");
const credencialLogroElem = document.querySelector("#credencialLogro");
const credencialJustificacionElem = document.querySelector("#credencialJustificacion");
const credencialCriteriosElem = document.querySelector("#credencialCriterios");
const tabsContainerElem = document.querySelector("#tabs-container");

let infoCredencial;
let infoCursos;

function init() {
  Papa.parse(credencial, {
    download: true,
    header: true,
    complete: getInfoCredencial,
  });
}

function getInfoCredencial(dataCredencial) {
  Papa.parse(cursos, {
    download: true,
    header: true,
    complete: getInfoCursos,
  });

  infoCredencial = dataCredencial.data;
}

function getInfoCursos(dataCursos) {
  infoCursos = dataCursos.data;
  printInfo(infoCredencial, infoCursos);
}

function printInfo(credencial, cursos) {
  if (credencial != null || cursos != null) {
    credencialTituloElem.innerHTML = credencial[0].Nombre;
    credencialCreditosElem.innerHTML = credencial[0].Creditos;
    credencialLogroElem.innerHTML = credencial[0].Logro;
    credencialJustificacionElem.innerHTML = createLi(credencial[0].Justificacion);
    credencialCriterios.innerHTML = credencial[0].Criterios;

    // 1. Agrupar cursos por facultad
    const cursosPorFacultad = cursos.reduce((acc, curso) => {
      const facultad = curso.Facultad || "Sin Facultad";
      if (!acc[facultad]) {
        acc[facultad] = [];
      }
      acc[facultad].push(curso);
      return acc;
    }, {});

    // 2. Generar HTML para las pestañas horizontales (facultades)
    let facultyTabsHTML = '<div class="col-12 horizontal-tabs">';
    let facultyLabelsHTML = '<div class="horizontal-tab-labels">';
    let facultyContentsHTML = '<div class="horizontal-tab-contents">';

    Object.keys(cursosPorFacultad).forEach((facultad, facultyIndex) => {
      const facultyId = `faculty-${facultyIndex}`;
      const isFirstFaculty = facultyIndex === 0;

      // Input y Label para la pestaña de facultad
      facultyLabelsHTML += `<input type="radio" id="${facultyId}" name="faculty-tabs" ${isFirstFaculty ? "checked" : ""}>`;
      facultyLabelsHTML += `<label for="${facultyId}">${facultad}</label>`;

      let courseLabels = '<div class="tab-labels col-4 p-r-3 m-b-3">';
      let courseContents = '<div class="col-8">'; // Contenedor para todos los contenidos de los cursos
      const cursosDeFacultad = cursosPorFacultad[facultad];

      // Generar pestañas verticales para los cursos de esta facultad
      cursosDeFacultad.forEach((curso, courseIndex) => {
        const courseId = `${facultyId}-course-${courseIndex}`;
        const isFirstCourse = courseIndex === 0;
        // Colocar el input DENTRO del contenedor de labels, justo antes de su label
        courseLabels += createRadio(courseId, `course-tabs-${facultyId}`, isFirstCourse);
        courseLabels += createLabel(courseId, curso);
        courseContents += createContent(courseId, curso, `course-tabs-${facultyId}`);
      });

      courseLabels += "</div>";
      courseContents += "</div>";

      // Contenido de la pestaña de facultad (que contendrá las pestañas de cursos)
      facultyContentsHTML += `<div id="content-${facultyId}" class="horizontal-tab-content">`;
      facultyContentsHTML += `<div class="tabs row">${courseLabels}${courseContents}</div>`;
      facultyContentsHTML += `</div>`; // Cierre de .horizontal-tab-content
    });
    facultyLabelsHTML += "</div>"; // Cierre de .horizontal-tab-labels
    facultyContentsHTML += "</div>"; // Cierre de .horizontal-tab-contents
    facultyTabsHTML += facultyLabelsHTML + facultyContentsHTML + "</div>"; // Cierre de .horizontal-tabs

    tabsContainerElem.innerHTML = facultyTabsHTML;
    hideLoader();
    addTabEventListeners();
    addCourseTabListeners();
  }
}

function addTabEventListeners() {
  const facultyRadios = document.querySelectorAll('input[name="faculty-tabs"]');
  const facultyContents = document.querySelectorAll(".horizontal-tab-content");

  facultyRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      // Ocultar todos los contenidos
      facultyContents.forEach((content) => {
        content.style.display = "none";
      });

      // Mostrar el contenido correspondiente
      const contentId = `content-${radio.id}`;
      const activeContent = document.getElementById(contentId);
      if (activeContent) activeContent.style.display = "block";
    });
  });

  // Disparar el evento 'change' para el radio seleccionado por defecto al cargar
  const checkedRadio = document.querySelector('input[name="faculty-tabs"]:checked');
  if (checkedRadio) {
    checkedRadio.dispatchEvent(new Event("change"));
  }
}

function addCourseTabListeners() {
  // Selecciona todos los contenedores de pestañas de cursos
  const courseTabContainers = document.querySelectorAll(".horizontal-tab-content .tabs");

  courseTabContainers.forEach((container) => {
    const courseRadios = container.querySelectorAll('input[name^="course-tabs-"]');
    const courseContents = container.querySelectorAll(".tab-content");

    courseRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        // Dentro de este grupo, oculta todos los contenidos
        courseContents.forEach((content) => (content.style.display = "none"));

        // Muestra el contenido correspondiente al radio seleccionado
        const contentId = `content-${radio.id}`;
        const activeContent = container.querySelector(`#${contentId}`);
        if (activeContent) activeContent.style.display = "block";
      });
    });

    // Activa la primera pestaña de cada grupo al cargar
    const firstRadio = container.querySelector('input[name^="course-tabs-"]');
    if (firstRadio) firstRadio.dispatchEvent(new Event("change"));
  });
}

function createContent(id, curso, groupName) {
  let content = `
    <div id="content-${id}" class="tab-content">
              <h1 class="lined m-b-2">${curso.Nombre}</h1>
              <h2 class="icon left m-b-2"><img src="img/icons/icon-obtiene.png" alt=""> Descripción</h2>
              <p class="m-b-2">${curso.Descripcion}</p>
              <p ><strong>Nivel: </strong>${curso.Nivel}</p>
              <p class="m-b-2"><strong>Prerequisito: </strong>${curso.Prerequisito}</p>
              <div class="metadata">
                <div class="metadata-item ">
                  <div class="credits border">
                    <h2 class="p-t-1">${curso.Creditos}</h2>
                    <span class="${curso.Requisito} p-x-1">Créditos</span>
                  </div>
                </div>
                <div class="metadata-item ${curso.Requisito}">
                  <p class="m-b-1"><b>Curso obligatorio o electivo</b></p>
                  <div class="color">
                    ${curso.Requisito}
                  </div>
                </div>
                <div class="metadata-item">
                  <p class="m-b-1"><b>Facultad(es)</b></p>
                  <div>${curso.Facultad}</div>
                </div>
              </div>
              <div class="m-y-3">
                <details name="accordion-group-2" class="m-b-3">
                  <summary>
                    <h3>Resultados de aprendizaje</h3>
                    <span class="arrow">
                      <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false"
                        fill="currentColor" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowDownIcon">
                        <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path>
                      </svg>
                    </span>
                  </summary>
                  <div class="content p-y-2">
                    <ul>
                      ${createLi(curso.Objetivos)}
                    </ul>
                  </div>
                </details>
                <details name="accordion-group-2" class="m-b-3">
                  <summary>
                    <h3>Metodología</h3>
                    <span class="arrow">
                      <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false"
                        fill="currentColor" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowDownIcon">
                        <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path>
                      </svg>
                    </span>
                  </summary>
                  <div class="content p-y-2">
                    <p class="m-b-2">${curso.Metodologia}</p>
                  </div>
                </details>
                <details name="accordion-group-2" class="m-b-2">
                  <summary>
                    <h3>Aportes al proyecto integrador</h3>
                    <span class="arrow">
                      <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false"
                        fill="currentColor" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowDownIcon">
                        <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path>
                      </svg>
                    </span>
                  </summary>
                  <div class="content p-y-2">
                    <p class="m-b-2">${curso.Aportes}</p>
                  </div>
                </details>
              </div>
            </div>
  `;
  return content;
}

function createLabel(id, curso) {
  let labelElement = `
    <label for="${id}" class="border">
                <h5 class="number ${curso.Requisito} m-0">${curso.Orden}</h5>
                <p>${curso.Nombre}</p>
                <div class="actions">
                  <span class="ca">
                    <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false"
                      fill="currentColor" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowDownIcon">
                      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path>
                    </svg>
                  </span>
                  <span>+</span>
                </div>
              </label>
  `;

  return labelElement;
}

function insertBefore(el, htmlString) {
  el.insertAdjacentHTML("beforebegin", htmlString);
}

function insertAfter(el, htmlString) {
  el.insertAdjacentHTML("afterEnd", htmlString);
}

function createRadio(id, name, isChecked = false) {
  return `<input type="radio" id="${id}" name="${name}" ${isChecked ? "checked" : ""}>`;
}

function createLi(data) {
  if (!data) return "";
  let datasplit = data.split("|");
  let liElements = "";
  datasplit.forEach((string) => {
    liElements += `<li>${string}</li>`;
  });
  return liElements;
}

function hideLoader() {
  loaderElem.style.top = "-100vw";
  setTimeout(() => {
    loaderElem.style.zIndex = 0;
    loaderElem.style.display = "none";
  }, 800);
}
