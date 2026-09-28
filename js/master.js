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
const labelsElem = document.querySelector("#labels");

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
  let radios = "";
  let labels = "";
  let contents = "";

  if (credencial != null || cursos != null) {
    credencialTituloElem.innerHTML = credencial[0].Nombre;
    credencialCreditosElem.innerHTML = credencial[0].Creditos;
    credencialLogroElem.innerHTML = credencial[0].Logro;
    credencialJustificacionElem.innerHTML = createLi(credencial[0].Justificacion);
    credencialCriterios.innerHTML = credencial[0].Criterios;

    for (let index = 0; index < credencial[0].Cursos; index++) {
      radios += createRadio(index);
      labels += createLabel(index, cursos[index]);
      contents += createContent(index, cursos[index]);
    }

    insertBefore(labelsElem, radios);
    insertAfter(labelsElem, contents);
    labelsElem.innerHTML = labels;
    checkradio();
    hideLoader();
  }
}

function createContent(Id, curso) {
  let contentId = Id + 1;
  let content = `
    <div id="content${contentId}" class="col-8 tab-content">
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

function createLabel(Id, curso) {
  let labelId = Id + 1;
  let labelElement = `
    <label for="tab${labelId}" class="border">
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

function checkradio() {
  const radioButtons = document.getElementsByName("tabs");
  radioButtons[0].defaultChecked = true;
}

function insertBefore(el, htmlString) {
  el.insertAdjacentHTML("beforebegin", htmlString);
}

function insertAfter(el, htmlString) {
  el.insertAdjacentHTML("afterEnd", htmlString);
}

function createRadio(Id) {
  let radioId = Id + 1;
  let radioElement = `<input type="radio" id="tab${radioId}" name="tabs">`;

  return radioElement;
}

function createLi(data) {
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
