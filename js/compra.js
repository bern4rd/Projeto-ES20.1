class Compra {
	constructor(data, cartao, categoria, parcela, valor, descricao) {
		this.data = data;
		this.cartao = cartao;
		this.categoria = categoria;
		this.parcela = parcela;
		this.valor = valor;
		this.descricao = descricao;
	}

	validarDados() {

		//alert(document.getElementById('data').value);
		for (let i in this) {
			if (this[i] == undefined || this[i] == '' || this[i] == null) {

			}
		}

		if (this.valor == 'e' || this.dia == 'e') {
			return false
		}
		else if (this.dia < 1 || this.valor < 1) {
			return false
		}
		else if (this.dia > 31) {
			return false
		}
		else if (this.dia > 29 && this.mes == '2') {
			return false
		}
		else if (this.dia > 30 && ((this.mes == '4') || (this.mes == '6') || (this.mes == '9') || (this.mes == '11'))) {
			return false
		}

		return true
	}
}


function addCompra() {

	let data = document.getElementById('data')
	let cartao = document.getElementById('cartao')
	let categoria = document.getElementById('categoria')
	let parcela = document.getElementById('parcela')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let compra = new Compra(
		data.value,
		cartao.value,
		categoria.value,
		parcela.value,
		descricao.value,
		valor.value
	)


	if (compra.validarDados()) {
		bd.gravar(compra)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Compra foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//dialog de sucesso
		$('#modalRegistraCompra').modal('show')

		data.value = ''
		cartao.value = ''
		categoria.value = ''
		parcela.value = ''
		descricao.value = ''
		valor.value = ''

	} else {

		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		//dialog de erro
		$('#modalRegistraCompra').modal('show')
	}
}
//função para lista todos os cartoes no select
function listarCartoes() {

	//criando variavel para acessa o banco de dados do cartao
	let recCartoes = new Bdc();

	//array com os cartoes cadastrados
	let cartoes = recCartoes.recuperarTodosCartoes();

	//acessando o elemento select na página
	let select = document.getElementById('cartao');

	//precorendo todos os itens do array
	cartoes.forEach(item => {

		//criando o elemento a ser adicionando ao select
		let option = document.createElement('option');

		//inserindo texto ao elemento
		option.innerText = item;

		//incluindo o elemento ao select da página
		option.text = item.nome + ' - ' + item.bandeira; //o texto que vai aparece na opção do select
		option.value = item.id; //o valor atribuido quando seleciona a opção - esse valor referece ao id do cartao no banco de dado de cartao
		select.appendChild(option);

		//console.log(item);
	});

	console.log(cartoes);
}

//criando o banco no sqlite local (nome, versao, ..., tamanho)
var banco = openDatabase("MeuBanco", "1.0", "MyBase", 4048);
//criando a tabela no banco
banco.transaction (function(criar){
	criar.executeSql("CREATE TABLE IF NOT EXISTS compras (id AUTO_INCREMENT PRIMARY KEY, data DATE, idCartao INT, categoria TEXT, parcela INT, valor REAL, descricao TEXT)");
});