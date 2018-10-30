const URL_API_SWAPI_GET_PEOPLE = "https://swapi.co/api/people";
const resultadosPorPagina = 10;
const selectP = document.querySelector("#selectPersonagem");
const carregando = document.querySelector("#carregando");
let personagens = [];
let totalPersonagens;
let pageNumber = 1;

let arrayApi = [];

function ordenar(itemA, itemB) {
  if (itemA.name < itemB.name) return -1;
  if (itemA.name > itemB.name) return 1;
  return 0;
}

// consome api para buscar personagens
async function buscarPersonagens(pageNumber) {
  console.log("aqui", pageNumber);
  let response = await $.getJSON(
    URL_API_SWAPI_GET_PEOPLE,
    {
      page: pageNumber
    },
    function(data) {
      totalPersonagens = Number(data.count);
    }
  );
  response.results.map(item => {
    personagens.push(item);
  });
  return personagens;
}

buscarTodosPersonagens(pageNumber);

function buscarTodosPersonagens(pageNumber) {
  buscarPersonagens(pageNumber)
    .then(response => {
      if (pageNumber < totalPersonagens / resultadosPorPagina) {
        pageNumber++;
        buscarTodosPersonagens(pageNumber);
      } else {
        popularSelect(personagens.sort(ordenar));
      }
    })
    .catch(error => {
      console.log(error, "error");
    });
}

function popularSelect(personagens) {
  let html = "";

  html += `<option value=''>Selecione um personagem</option>`;
  personagens.forEach(item => {
    html += `
      <option value="${item.url}">${item.name}</option>
    `;
  });

  selectP.innerHTML = html;
}

$("#selectPersonagem").change(function() {
  let html = "";
  let url = $("#selectPersonagem option:selected").val();
  $('#resultado').addClass('fade-in');
  $("#resultado").html(html)
  detalharInformacoes(url)
    .then(personagemSelecionado => {
      let html = "";

      html +=`<h3>A força está com:</h3>
        <p>Nome: ${personagemSelecionado.name}</p>
        <p>Sexo: ${personagemSelecionado.gender}</p>
      `;
      detalharInformacoes(personagemSelecionado.species[0])
        .then(especie => {
          if (especie!=undefined){
              html +=`
              <p>Espécie: ${especie.name}</p>
            `;
          }
        detalharInformacoes(personagemSelecionado.homeworld)
          .then(planeta => {
            if (planeta!=undefined){
              html +=`
                <p>Planeta natal: ${planeta.name}</p>
                <p>Filmes: 
              `;
            }
          for (let i = 0; i < personagemSelecionado.films.length; i++) {
            detalharInformacoes(personagemSelecionado.films[i])
              .then(filme => {
                if (filme!=undefined){
                  html +=`${filme.title}<br />`;
                }
                console.log(html)
                if (i==personagemSelecionado.films.length-1)
                  $("#resultado").html(html)
            })
          }
        })
      })
    })
    .catch(error => {
      console.log(error, "error");
      alert("Selecione novamente")
    });
});

async function detalharInformacoes(url) {
  if (url!=undefined){
    let infoPersonagem = await $.getJSON(url, function(data) {});
    return infoPersonagem;
  }
}

document.addEventListener("mousemove", () => {
  const audio = document.querySelector("audio");
  audio.play();
});

function pararAnimacao() { // add fade out
  
  setTimeout(() => {
    document.querySelector('header').classList += 'fade-in';
    document.querySelector('main').classList += ' fade-in';
    document.querySelector('body').style.overflowY = 'scroll';
    document.querySelector('.fade').style.display = 'none';
    document.querySelector('.starwars').style.display = 'none';
  }, 30000);
}
pararAnimacao();
