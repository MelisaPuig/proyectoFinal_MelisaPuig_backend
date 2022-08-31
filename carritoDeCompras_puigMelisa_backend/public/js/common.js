function goLogin() {
  window.location.href = '/login';
}

function logout() {
  window.location.href = '/logout';
}

function formatDate(rawDate) {
  const addZero = (number) => (number < 10 ? `0${number}` : number);
  const date = new Date(rawDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${addZero(day)}/${addZero(month)}/${year} ${addZero(hours)}:${addZero(minutes)}:${addZero(
    seconds,
  )}`;
}

async function renderHandlebars(templateUrl, data) {
  const handlebarsTemplateFetch = await fetch(templateUrl);
  const handlebarsTemplate = await handlebarsTemplateFetch.text();
  const compiledTemplate = Handlebars.compile(handlebarsTemplate);
  return compiledTemplate(data);
}

async function getPayloadFromResponse(response) {
  const parsedResponse = await response.json();
  if (!parsedResponse.success) {
    alert(`Ocurrió el siguiente error consultando a la API: ${parsedResponse.error}`);
    return;
  }
  return parsedResponse.payload;
}

async function getUserToken() {
  const URL = '/token';
  const response = await fetch(URL);
  return getPayloadFromResponse(response);
}

async function getUserData() {
  const URL = '/api/users/data';
  const response = await fetch(URL);
  return getPayloadFromResponse(response);
}

async function consoleToken() {
  const URL = '/token';
  const response = await fetch(URL);
  const parsedResponse = await response.json();
  if (parsedResponse.success) {
    console.log('Token');
    console.log(`Bearer ${parsedResponse.payload}`);
  }
}

document.addEventListener(
  'DOMContentLoaded',
  async function () {
    consoleToken();
  },
  false,
);
