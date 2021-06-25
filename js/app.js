class Despesa {
	constructor(ano, mes, dia, cartao, categoria, parcela, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.cartao = cartao
		this.categoria = categoria
		this.parcela = parcela	
		this.descricao = descricao
		this.valor = valor			
	}

	validarDados() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {

		//array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')

		//recuperar todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++) {

			//recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver índices que foram pulados/removidos
			//nestes casos nós vamos pular esses índices
			if(despesa === null) {
				continue
			}
			despesa.id = i
			despesas.push(despesa)
		}

		return despesas
	}

	pesquisar(despesa){

		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()
		console.log(despesasFiltradas);
		console.log(despesa)

		//ano
		if(despesa.ano != ''){
			console.log("filtro de ano");
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}
			
		//mes
		if(despesa.mes != ''){
			console.log("filtro de mes");
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		//dia
		if(despesa.dia != ''){
			console.log("filtro de dia");
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		//categoria
		if(despesa.categoria != ''){
			console.log("filtro de categoria");
			despesasFiltradas = despesasFiltradas.filter(d => d.categoria == despesa.categoria)
		}

		//descricao
		if(despesa.descricao != ''){
			console.log("filtro de descricao");
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		//valor
		if(despesa.valor != ''){
			console.log("filtro de valor");
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		//cartao
		if(despesa.cartao != ''){
			console.log("filtro de cartão");
			despesasFiltradas = despesasFiltradas.filter(d => d.cartao == despesa.cartao)
		}		
		
		return despesasFiltradas

	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()


function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let cartao = document.getElementById('cartao')
	let categoria = document.getElementById('categoria')
	let parcela = document.getElementById('parcela')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')
		
	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		cartao.value,		
		categoria.value, 
		parcela.value,
		descricao.value,
		valor.value		
	)


	if(despesa.validarDados()) {
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show') 

		ano.value = '' 
		mes.value = ''
		dia.value = ''
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
		$('#modalRegistraDespesa').modal('show') 
	}
}

function carregaListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros() 
	}
	

	/*

	<tr>
		<td>15/03/2018</td>
		<td>Alimentação</td>
		<td>Compras do mês</td>
		<td>444.75</td>
	</tr>

	*/

	let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = ''
	despesas.forEach(function(d){

		//Criando a linha (tr)
		var linha = listaDespesas.insertRow();

		//Criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		//Ajustar o categoria
		switch(d.categoria){
			case '1': d.categoria = 'Alimentação'
				break
			case '2': d.categoria = 'Assinatura e serviços'
				break
			case '3': d.categoria = 'Bares e Restaurantes'
				break
			case '4': d.categoria = 'Casa'
				break
			case '5': d.categoria = 'Compras'
				break
			case '6': d.categoria = 'Cuidados Pessoais'
				break
			case '7': d.categoria = 'Dívidas e empréstimos'
				break
			case '8': d.categoria = 'Educação'
				break
			case '9': d.categoria = 'Família e filhos'
				break
			case '10': d.categoria = 'Impostos e taxas'
				break
			case '11': d.categoria = 'Investimentos'
				break
			case '12': d.categoria = 'Lazer e hobbies'
				break
			case '13': d.categoria = 'Mercado'
				break
			case '14': d.categoria = 'Outros'
				break
			case '15': d.categoria = 'Pets'
				break
			case '16': d.categoria = 'Presentes e doações'
				break
			case '17': d.categoria = 'Roupas'
				break
			case '18': d.categoria = 'Saúde'
				break
			case '19': d.categoria = 'Trabalho'
				break
			case '20': d.categoria = 'Transporte'
				break
			case '21': d.categoria = 'Viagem'
				break
			
		}

		linha.insertCell(1).innerHTML = d.categoria

		//Ajustar o cartão
		switch(d.cartao){
			case '1': d.cartao = 'Visa'
				break
			case '2': d.cartao = 'Master'
				break
			case '3': d.cartao = 'Cielo'
				break
		}

		linha.insertCell(2).innerHTML = d.cartao		
		linha.insertCell(3).innerHTML = d.descricao
		linha.insertCell(4).innerHTML = d.valor

		switch(d.parcela){
			case '1': d.parcela = '1x'
				break
			case '2': d.parcela = '2x'
				break
			case '3': d.parcela = '3x'
				break
			case '4': d.parcela = '4x'
				break
			case '5': d.parcela = '5x'
				break
			case '6': d.parcela = '6x'
				break
			case '7': d.parcela = '7x'
				break
			case '8': d.parcela = '8x'
				break
			case '9': d.parcela = '9x'
				break
			case '10': d.parcela = '10x'
				break
			case '11': d.parcela = '11x'
				break
			case '12': d.parcela = '12x'
				break
		}

		linha.insertCell(5).innerHTML = d.parcela

		//Criar o botão de exclusão
		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fa fa-times"  ></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function(){
			let id = this.id.replace('id_despesa_','')
			//alert(id)
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(6).append(btn)
		console.log(d)
	})

 }

 
 function pesquisarDespesa(){
	 
	let ano  = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let cartao = document.getElementById("cartao").value
	let categoria = document.getElementById("categoria").value
	let parcela = document.getElementById("parcela").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	let despesa = new Despesa(ano, mes, dia, cartao, categoria, parcela, descricao, valor)

	let despesas = bd.pesquisar(despesa)
	 
	this.carregaListaDespesas(despesas, true)

 }
