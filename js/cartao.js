//Função para listar as bandeiras na página
function listarBandeiras() {

    //Array com as bandeiras
    const listasBandeira = ['Agicard', 'Amex', 'Aura', 'Avista', 'Banescard', 'Cabal', 'CredSystem', 'Diners', 'Discover', 'Elo', 'Good Card', 'Green Card', 'Hipercard', 'JCB', 'MasterCard', 'Policard', 'Sorocard', 'VR Benefícios', 'Valecard', 'Verocheque', 'Visa'];

    //acessando o elemento select na página
    let select = document.getElementById('bandeira');

    //precorendo todos os itens do array
    listasBandeira.forEach(item => {

        //criando o elemento a ser adicionando ao select
        let option = document.createElement('option');

        //inserindo texto ao elemento
        option.innerText = item;

        //incluindo o elemento ao select da página
        option.text = item;
        option.value = item;
        select.appendChild(option);

        //console.log(item);
    });
}

class Cartao {
    constructor(bandeira, nome, vencimento, limite) {
        this.bandeira = bandeira;
        this.nome = nome;
        this.vencimento = vencimento;
        this.limite = limite;
    }

    //arrumar para validar todos os campos
    validarDadosC() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false;
            }
        }

        if (this.vencimento == 'e' || this.limite == 'e') {
            return false
        }
        else if (this.vecimento < 1 || this.limite < 1) {
            return false
        }
        else if (this.vencimento > 31) {
            return false
        }

        return true;
    }
}

class Bdc {

    constructor() {
        let id = localStorage.getItem('id');

        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    gravarCartao(c) {
        let id = this.getProximoId();

        localStorage.setItem(id, JSON.stringify(c));

        localStorage.setItem('id', id);
    }

    recuperarTodosCartoes() {

        //array de cartoes
        let cartoes = Array();

        let id = localStorage.getItem('id');

        //recuperar todos os cartões cadastrado no localStore
        for (let i = 1; i <= id; i++) {
            //recuperar o cartão
            let cartao = JSON.parse(localStorage.getItem(i));

            //existe a possibilidade indices nulo/removido
            //nesse caso, pular os indices
            if (cartao === null) {
                continue;
            }

            cartao.id = i;
            cartoes.push(cartao);
        }

        return cartoes;
    }

    removerCartao(id) {
        localStorage.removeItem(id);
    }

    localizarCartao(id) {
        let cartao = JSON.parse(localStorage.getItem(id));
        return cartao;
    }
}

let bdc = new Bdc();

function cadastrarCartao() {

    let bandeira = document.getElementById('bandeira');
    let nome = document.getElementById('nome');
    let vencimento = document.getElementById('vencimento');
    let limite = document.getElementById('limite');

    let cartao = new Cartao(
        bandeira.value,
        nome.value,
        vencimento.value,
        limite.value
    );

    if (cartao.validarDadosC()) {
        bdc.gravarCartao(cartao);

        //mostrar a tela de modal de sucesso ao adiconar a cartao
        document.getElementById('modal_titulo').innerHTML = 'Cartão inserido com sucesso!'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Cartao foi cadastrada com sucesso!'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'

        //dialog de sucesso
        $('#modalRegistraCartao').modal('show')

        //setando os valores do campo para vazio
        bandeira.value = "";
        nome.value = "";
        vencimento.value = "";
        limite.value = "";

    } else {
        //mostrar a tela de modal com aviso que os dados estão icorretos ou faltando
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do cartão'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'

        //dialog de erro
        $('#modalRegistraCartao').modal('show')
    }

}

function carregaListasCartoes() {

    let cartoes = Array();
    cartoes = bdc.recuperarTodosCartoes();

    //selecionando o elemento tbody
    let listaCartoes = document.getElementById('listaCartoes');

    //precorrer array cartoes e listando de forma dinâmica
    cartoes.forEach(function (c) {

        //console.log(c);

        //criando linhas/ <tr>
        let linha = listaCartoes.insertRow();

        //criar as colunas/ <td>
        linha.insertCell(0).innerHTML = c.bandeira;
        linha.insertCell(1).innerHTML = c.nome;
        linha.insertCell(2).innerHTML = "Dia " + c.vencimento;
        linha.insertCell(3).innerHTML = "R$ " + c.limite;

        //botão de remover cartão
        let btn = document.createElement("button");
        btn.className = "btn btn-danger";
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = `id_cartao_${c.id}`;
        btn.onclick = function () {
            //remover cartão
            let id = this.id.replace('id_cartao_', '');
            //alert(id);

            bdc.removerCartao(id);

            //atualizar a tabela de cartoe após a adição
            carregaListasCartoes();

        }
        linha.insertCell(4).append(btn);

        //console.log(c);
    });
}

function lembretePagamento() {
    //pegando a data do dia
    now = new Date();

    //recuperando os cartoes para checagem
    let cartoes = Array();
    cartoes = bdc.recuperarTodosCartoes();

    //precorrendo todos os cartoes para verificar o dia do vencimento
    for (var i = 0; i < cartoes.length; i++) {
        //verificando se o dia do vencimento  é igual ao dia atual
        if (cartoes[i].vencimento == now.getDate()) {

            //mostrar a tela de modal de sucesso ao adiconar a cartao
            var mensagem = 'O vencimento do cartão <b>' + cartoes[i].nome + '</b>, bandeira <b>' + cartoes[i].bandeira + '</b> é hoje.';
            document.getElementById('dadosCartao').innerHTML = mensagem;

            //Mostrando mensagem ao usuário
            $('#modalLembreteCartao').modal('show')
            //alert("Pagamendo do cartão hoje!");
        }
    }
}