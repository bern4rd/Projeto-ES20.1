//criando o banco no sqlite local (nome, versao, ..., tamanho)
var banco = openDatabase("MeuBanco", "1.0", "MyBase", 4048);

//criando a tabela no banco
banco.transaction(function (criar) {
	criar.executeSql("CREATE TABLE IF NOT EXISTS compras (id INTEGER PRIMARY KEY, data DATE NOT NULL, idCartao INT NOT NULL, categoria VARCHAR(100) NOT NULL, parcela INT NOT NULL, valor FLOAT NOT NULL, descricao TEXT NOT NULL)");
});

class Compra {
	constructor(data, cartao, categoria, parcela, valor, descricao) {
		this.data = data;
		this.cartao = cartao;
		this.categoria = categoria;
		this.parcela = parcela;
		this.valor = valor;
		this.descricao = descricao;
	}

	//arrumar esse validar os dados de compras
	validarDados() {

		//alert(document.getElementById('data').value);
		for (let i in this) {
			if (this[i] == undefined || this[i] == '' || this[i] == null) {

			}
		}

		if (this.valor == 'e' || this.parcela == 'e') {
			return false
		}
		else if (this.parcela < 1 || this.valor < 1) {
			return false
		}
		else if (this.parcela > 12) {
			return false
		}

		return true
	}
}

function pesquisarCompra() {
	var table = document.getElementById('listaPesquisa');
	let pesquisa = document.getElementById('pesquisa').value;

	banco.transaction(function (tx) {
		tx.executeSql('SELECT * FROM compras WHERE descricao = ? ORDER BY data DESC', [pesquisa], function (tx, resultado) {
			console.log(resultado)
			var rows = resultado.rows;
			var tr = '';
			for (var i = 0; i < rows.length; i++) {
				//criando variavel do tipo Cartao() pra salvar o cartao
				let cartao = new Cartao();

				//chamando a função localizarCartao() passando o ID, a função retorna o cartao
				cartao = bdc.localizarCartao(rows[i].idCartao);

				//organizando os dados na tabela
				tr += '<tr>';
				tr += '<td>' + rows[i].data + '</td>';
				tr += '<td>' + rows[i].categoria + '</td>';
				tr += '<td>' + rows[i].descricao + '</td>';

				//para a coluna de cartao, usando a variavel cartao sertando o nome e a bandira
				tr += '<td>' + cartao.nome + ' - ' + cartao.bandeira + '</td>';
				tr += '<td>' + rows[i].parcela + '</td>';
				tr += '<td>' + rows[i].valor + '</td>';
			}

			table.innerHTML = tr;

		});
	});
}

function addCompra() {

	let data = document.getElementById('data');
	let cartao = document.getElementById('cartao');
	let categoria = document.getElementById('categoria');
	let parcela = document.getElementById('parcela');
	let valor = document.getElementById('valor');
	let descricao = document.getElementById('descricao');

	let compra = new Compra(
		data.value,
		cartao.value,
		categoria.value,
		parcela.value,
		valor.value,
		descricao.value
	)


	if (compra.validarDados()) {
		//caso os dados sejam validados, adicionar a compra no banco Sqlite
		banco.transaction(function (adicionar) {
			//adicionando as compras no banco de dados
			adicionar.executeSql("INSERT INTO compras (data, idCartao, categoria, parcela, valor, descricao) VALUES (?,?,?,?,?,?)", [compra.data, compra.cartao, compra.categoria, compra.parcela, compra.valor, compra.descricao]);
		});

		//mostrar a tela de modal de sucesso ao adiconar a compra
		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Compra foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//mostrando assim que salvar
		mostarCompras();

		//dialog de sucesso
		$('#modalRegistraCompra').modal('show')

		//limpa os campos 
		data.value = ''
		cartao.value = ''
		categoria.value = ''
		parcela.value = ''
		descricao.value = ''
		valor.value = ''

	} else {
		//mostrar a tela de modal com aviso que os dados estão icorretos ou faltando
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

	//console.log(cartoes); //só para verificar se está recebendo os cartoes certo no console
}

//função para lista as compras na tabela da página de relatórios
function mostarCompras() {
	var table = document.getElementById('tdoby-mostarCompras');

	banco.transaction(function (tx) {
		tx.executeSql('SELECT * FROM compras ORDER BY data DESC', [], function (tx, resultado) {
			var rows = resultado.rows;
			var tr = '';
			for (var i = 0; i < rows.length; i++) {
				//criando variavel do tipo Cartao() pra salvar o cartao
				let cartao = new Cartao();

				//chamando a função localizarCartao() passando o ID, a função retorna o cartao
				cartao = bdc.localizarCartao(rows[i].idCartao);

				//organizando os dados na tabela
				tr += '<tr>';
				tr += '<td>' + rows[i].data + '</td>';
				tr += '<td>' + rows[i].categoria + '</td>';
				tr += '<td>' + rows[i].descricao + '</td>';

				//para a coluna de cartao, usando a variavel cartao sertando o nome e a bandira
				tr += '<td>' + cartao.nome + ' - ' + cartao.bandeira + '</td>';
				tr += '<td>' + rows[i].parcela + '</td>';
				tr += '<td>' + rows[i].valor + '</td>';
			}

			table.innerHTML = tr;

		});
	});

}

//Função para listar as categorias na página despesa
function listarCategorias() {

	//Array com as categorias
	const listasCategoria = ['Alimentação', 'Assinatura e serviços', 'Bares e Restaurantes', 'Casa', 'Compras', 'Cuidados Pessoais', 'Dívidas e empréstimos', 'Educação', 'Família e filhos', 'Impostos e taxas', 'Investimentos', 'Lazer e hobbies', 'Mercado', 'Pets', 'Presentes ou doações', 'Roupas', 'Saúde', 'Trabalho', 'Transporte', 'Viagem', 'Outros'];

	//acessando o elemento select na página
	let select = document.getElementById('categoria');

	//precorendo todos os itens do array
	listasCategoria.forEach(item => {

		//criando o elemento a ser adicionando ao select
		let option = document.createElement('option');

		//inserindo texto ao elemento
		option.innerText = item;

		//incluindo o elemento ao select da página
		option.text = item;
		option.value = item;
		select.appendChild(option);

		//console.log(item); //só pra verifica se ta tudo certo pelo console
	});
}

//Função que faz o tratamento dos dados para o datasets do gráfico
var categoriasList = [];
var valoresCatList = [];
function dadosGrafico() {
	banco.transaction(function (tx) {
		tx.executeSql('SELECT * FROM compras ORDER BY data DESC', [], function (tx, compras) {
			var rows = compras.rows;
			//console.log(rows);

			//precorrendo a lista de compras para pega as categorias utilizadas
			for (var i = 0; i < rows.length; i++) {
				if (existirJa(categoriasList, rows[i].categoria)) {
					continue;
				} else {
					categoriasList.push(rows[i].categoria);
				}
			}

			//fazendo o somatório  dos gastos por categoria
			for (var i = 0; i < categoriasList.length; i++) {
				var soma = 0;
				for (var j = 0; j < rows.length; j++) {
					if(categoriasList[i] == rows[j].categoria){
						soma = soma + rows[j].valor;
					}
				}
				valoresCatList.push(soma);
			}
		});
	});

	//verifica a lista de categorias/valores no console
	//console.log(valoresCatList);
}

//Função auxiliar para verificar se a categoria já existir dentro do array
function existirJa(lista, categoria) {
	//se o array for vazio, retorn false pra fazer a inclusão do primeiro elemento
	if (!lista.length) {
		return false;
	} else {
		//caso o array não seja vazio, precorre ele com for a fim de procura a categoria, se acha retorna true
		for (var i = 0; i < lista.length; i++) {
			if (lista[i] === categoria) {
				return true;
			}
		}
		//caso não se encontre a categoria dentro do array, retorna false para fazer a inclusão
		return false;
	}
}

//Função que gerar o gráfico em uma tela modal
function gerarGrafico() {
	dadosGrafico();
	var ctx = document.getElementsByClassName("line-chart");

	//Type, data e options
	var charGraph = new Chart(ctx, {
		type: 'line',
		data: {
			labels: categoriasList,
			datasets: [{
				label: "Gastos por Categorias",
				data: valoresCatList,
				borderWidth: 2,
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1,
				backgroundColor: 'transparent',
			}]
		}
	});

	$('#modalGráfico').modal('show');
}