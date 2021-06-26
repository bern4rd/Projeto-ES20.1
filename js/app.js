class Compra {
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
		let compras = Array()

		let id = localStorage.getItem('id')

		//recuperar todas as compras cadastradas em localStorage
		for(let i = 1; i <= id; i++) {

			//recuperar a compra
			let compra = JSON.parse(localStorage.getItem(i))

			//pular índices removidos
			if(compra === null) {
				continue
			}
			compra.id = i
			compras.push(compra)
		}

		return compras
	}

	pesquisar(compra){

		let comprasFiltradas = Array()
		comprasFiltradas = this.recuperarTodosRegistros()
		console.log(comprasFiltradas);
		console.log(compra)

		//ano
		if(compra.ano != ''){
			console.log("filtro de ano");
			comprasFiltradas = comprasFiltradas.filter(d => d.ano == compra.ano)
		}
			
		//mes
		if(compra.mes != ''){
			console.log("filtro de mes");
			comprasFiltradas = comprasFiltradas.filter(d => d.mes == compra.mes)
		}

		//dia
		if(compra.dia != ''){
			console.log("filtro de dia");
			comprasFiltradas = comprasFiltradas.filter(d => d.dia == compra.dia)
		}

		//categoria
		if(compra.categoria != ''){
			console.log("filtro de categoria");
			comprasFiltradas = comprasFiltradas.filter(d => d.categoria == compra.categoria)
		}

		//descricao
		if(compra.descricao != ''){
			console.log("filtro de descricao");
			comprasFiltradas = comprasFiltradas.filter(d => d.descricao == compra.descricao)
		}

		//valor
		if(compra.valor != ''){
			console.log("filtro de valor");
			comprasFiltradas = comprasFiltradas.filter(d => d.valor == compra.valor)
		}

		//cartao
		if(compra.cartao != ''){
			console.log("filtro de cartão");
			comprasFiltradas = comprasFiltradas.filter(d => d.cartao == compra.cartao)
		}		
		
		return comprasFiltradas

	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()


function addCompra() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let cartao = document.getElementById('cartao')
	let categoria = document.getElementById('categoria')
	let parcela = document.getElementById('parcela')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')
		
	let compra = new Compra(
		ano.value, 
		mes.value, 
		dia.value, 
		cartao.value,		
		categoria.value, 
		parcela.value,
		descricao.value,
		valor.value		
	)


	if(compra.validarDados()) {
		bd.gravar(compra)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Compra foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//dialog de sucesso
		$('#modalRegistraCompra').modal('show') 

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
		$('#modalRegistraCompra').modal('show') 
	}
}

function carregaListaCompras(compras = Array(), filtro = false) {

    if(compras.length == 0 && filtro == false){
		compras = bd.recuperarTodosRegistros() 
	}

	let listaCompras = document.getElementById("listaCompras")
    listaCompras.innerHTML = ''
	compras.forEach(function(d){

		//Criando a linha (tr)
		var linha = listaCompras.insertRow();


		//Ajustar o ano
		switch(d.ano){
			case '1': d.ano = '2021'
				break
			case '2': d.ano = '2022'
				break
			case '3': d.ano = '2023'
		}

		//Criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		//Ajustar a categoria
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

		//Ajustar a parcela
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
		btn.id = `id_compra_${d.id}`
		btn.onclick = function(){
			let id = this.id.replace('id_compra_','')
			//alert(id)
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(6).append(btn)
		console.log(d)
	})

 }

 
 function pesquisarCompra(){
	 
	let ano  = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let cartao = document.getElementById("cartao").value
	let categoria = document.getElementById("categoria").value
	let parcela = document.getElementById("parcela").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	let compra = new Compra(ano, mes, dia, cartao, categoria, parcela, descricao, valor)

	let compras = bd.pesquisar(compra)
	 
	this.carregaListaCompras(compras, true)

 }
