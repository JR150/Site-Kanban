const $modal = document.getElementById('modal');
const $descricaoInput = document.getElementById('descricao');
const $prioridadeInput = document.getElementById('prioridade');
const $tempoInput = document.getElementById('tempo');
const $columnInput = document.getElementById('column');
const $idInput = document.getElementById("idInput")


const creationModeTitle = document.getElementById('tituloCriar');
const editingModeTitle = document.getElementById('tituloEditar');

const creationModeBtn = document.getElementById('btnCriar');
const editingModeBtn = document.getElementById('btnEditar');

var tasks = localStorage.getItem("tasks");

var taskList = tasks ? JSON.parse(tasks) : [];

gerarCards();

function abrirModal(data_column) {
    $modal.style.display = 'flex';

    $columnInput.value = data_column;

    creationModeTitle.style.display = "block";
    creationModeBtn.style.display = "block";

    editingModeTitle.style.display = "none";
    editingModeBtn.style.display = "none";
}

function abrirModalParaEditar(id) {
    $modal.style.display = 'flex';

        creationModeTitle.style.display = "none";
        creationModeBtn.style.display = "none";

        editingModeTitle.style.display = "block";
        editingModeBtn.style.display = "block";

        const index = taskList.findIndex(function(tarefa){
            return tarefa.id == id;
        });

        const task = taskList[index];

        $idInput.value = task.id;
        $descricaoInput.value = task.descricao;
        $prioridadeInput.value = task.prioridade;
        $tempoInput.value = task.prazo;
        $columnInput.value = task.coluna;
}

function fecharModal() {
    $modal.style.display = 'none';

    $idInput.value = "";
    $descricaoInput.value = "";
    $prioridadeInput.value = "";
    $tempoInput.value = "";
    $columnInput.value = "";
}

function resetColumns () {
    document.querySelector(`[data-column="1"] .body .cards_list`).innerHTML = '';
    document.querySelector(`[data-column="2"] .body .cards_list`).innerHTML = '';
    document.querySelector(`[data-column="3"] .body .cards_list`).innerHTML = '';
}
function gerarCards() {

    resetColumns ();
    
    taskList.forEach(function(tarefa) {

        const columnBody = document.querySelector(`[data-column="${tarefa.coluna}"] .body .cards_list`);

        const card = `
            <div 
                id = "${tarefa.id}"
                class="card" 
                ondblclick="abrirModalParaEditar(${tarefa.id})"
                draggable="true"
                ondragstart="dragstartHandler(event)"
            >
                <div class="info"> 
                    <b>Descrição:</b>
                    <span>${tarefa.descricao}</span>
                </div>

                <div class="info"> 
                    <b>Prioridade:</b>
                    <span>${tarefa.prioridade}</span>
                </div>

                <div class="info"> 
                    <b>Prazo:</b>
                    <span>${tarefa.prazo}</span>
                </div>
            </div>
        `;

        columnBody.innerHTML += card;
    });

}

function criarTarefa() {
    const novaTarefa = {
        id: Math.floor(Math.random() * 9999999),
        descricao: $descricaoInput.value,
        prioridade: $prioridadeInput.value,
        prazo: $tempoInput.value,
        coluna: $columnInput.value,
    }

    taskList.push(novaTarefa);

    localStorage.setItem("tasks", JSON.stringify(taskList));

    fecharModal();
    gerarCards();
}

function AtualizarTarefa() {
    const atualizar = {
        id: $idInput.value,
        descricao: $descricaoInput.value,
        prioridade: $prioridadeInput.value,
        prazo: $tempoInput.value,
        coluna: $columnInput.value,
    }

    const index = taskList.findIndex(function(tarefa){
        return tarefa.id == $idInput.value;
    });

    taskList[index] = atualizar;

    localStorage.setItem("tasks", JSON.stringify(taskList));

    fecharModal();
    gerarCards();
}

function mudarColuna(tarefa_id, column_id) {
    if (tarefa_id && column_id) {
        taskList = taskList.map((tarefa) => {
            if (tarefa.id == tarefa_id) {
                return {
                    ...tarefa,
                    coluna: column_id, 
                };
            }
            return tarefa; 
        });
    }

    localStorage.setItem("tasks", JSON.stringify(taskList));

    gerarCards(); 
}


function dragstartHandler(ev) {
    ev.dataTransfer.setData("my_custom_data", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
  }

  function dragoverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  }

  function dropHandler(ev) {
    ev.preventDefault();
    const tarefa_id = ev.dataTransfer.getData("my_custom_data");
    const column_id = ev.target.dataset.column;

    mudarColuna (tarefa_id, column_id);
  }