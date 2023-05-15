if (localStorage.getItem("token") == null) {
  alert("Você precisa estar logado para acessar essa página");
  window.location.href = "../../auth/auth.html";
}

function fetchData(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Failed to fetch data: ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => reject(new Error('Failed to fetch data'));
    xhr.send();
  });
}

function moveParaArmario1(serial){
  // let modalSimNao = document.getElementById('modalSimNao');

  let sim = document.getElementById('sim');
  let nao = document.getElementById('nao');

  let simNao = false;

  sim.addEventListener('click', function(){
    let request = new XMLHttpRequest();
    request.open("POST", `http://localhost:11032/api/Armario3/MoverParaArmario1/${serial}`);
    request.send();
    location.reload();
  });

  nao.addEventListener("click", function(){
    console.log("Mover para Armario 1 cancelado!");
    location.reload();
  });
}

function moveParaDefeito(serial){
  createCaixaSelectForms();
  let sim = document.getElementById('inputSim');
  let nao = document.getElementById('inputNao');
  let selectedOption = document.getElementById('inputMotivo');
  let selectedOptionCaixa = document.getElementById('inputCaixa');
  let motivo = '';
  let caixa = '';

  selectedOption.addEventListener('change',function(){
    motivo = selectedOption.value
  });

  selectedOptionCaixa.addEventListener('change', function(){
    caixa = selectedOptionCaixa.value
  });
  sim.addEventListener('click', function(){
      let url = "http://localhost:11032/api/Armario3/MoverParaDefeito";
      let params = JSON.stringify({
          "serial": serial,
          "caixa": caixa,
          "motivo": motivo
      });
      fazPostBody(url, params)
  });

  nao.addEventListener("click", function(){
    console.log("Mover para Armario 1 cancelado!");
    location.reload();
  });
};


async function main() {
  try {
    const armario3 = await fetchData('http://localhost:11032/api/Armario3');
    $('#tabela').DataTable({
      data: armario3,
      columns: [
        { data: 'serial' },
        { data: 'modelo' },
        { data: 'status' },
        { data: 'situacao' },
        { data: 'local' },
        {
          data: null,
          render: function(data, type, row) {
            return `
            <div class="dropdown">
            <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
              ...
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
              <li><button class="dropdown-item" type="button" data-bs-toggle="modal" data-bs-target="#modalSimNao" id="botaoMoverArmario1" onclick="moveParaArmario1('${row.serial}')">Mover Para Armário 1</button></li>
              <li><button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalEnviarDefeito" onclick="moveParaDefeito('${row.serial}')" type="button">Mover Para Defeito</button></li>
            </ul>
          </div>
            `;
          }
        }
      ]
    });
  } 
  catch (error) {
    console.error(error);
  }
}


async function modelos() {
  try {
    const data = await fetchData('http://localhost:11032/api/Armario3/Modelos');
    const d3Pro2 = document.getElementById('d3Pro2');
    const d3ProRefurbished = document.getElementById('d3ProRefurbished');
    const total = document.getElementById('total');

    d3Pro2.innerHTML = data[0].d3Pro2;
    d3ProRefurbished.innerHTML = data[0].d3ProRefurbished;
    total.innerHTML = data[0].total;
  } catch (error) {
    console.error(error);
  }
}

$(document).ready(function() {
  modelos();
  main();
});
