//SELECT * FROM Pessoa WHERE Data BETWEEN '2000-01-01' AND '2015-01-01' (exemplo)


function pesquisarPeriodo() {

    //pegando as datas informadas
    let dataOne = document.getElementById('rel_data_inicio').value;
    let dataSecond = document.getElementById('rel_data_fim').value;
    //alert(dataOne+' - '+dataSecond); //só pra confirma se tá recebendo

    //validando os campos
    if (dataOne > dataSecond) {
        //mostrar a tela de modal com aviso que os dados estão icorretos ou faltando
        document.getElementById('modal_titulo').innerHTML = 'Erro, o período informado é inválido!'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Por favor, verifique os campos de data novamente, o período de início deve ser menos que o período final.'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'

        //dialog de erro
        $('#modalErrorData').modal('show')
    }
    if (((!dataOne || !dataSecond) != false)) {
        //mostrar a tela de modal com aviso que os dados estão icorretos ou faltando
        document.getElementById('modal_titulo').innerHTML = 'Há campos sem ser preenchidos!'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Por favor, preencha todos os campos.'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'

        //dialog de erro
        $('#modalErrorData').modal('show')
    }

    //formatando data por padrão brasileiro
    data1 = new Date(dataOne);
    data2 = new Date(dataSecond);

    dataFormat1 = data1.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    dataFormat2 = data2.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    //pegando a referecia da tabela
    var table = document.getElementById('tdoby-mostarCompras');
    document.getElementById('title-rel').innerHTML = "Relatório no Período de: " + dataFormat1 + " até " + dataFormat2;

    //fazendo a busca no banco de dados
    banco.transaction(function (tx) {
        tx.executeSql('SELECT * FROM compras WHERE data BETWEEN ? AND ? ORDER BY data ASC', [dataOne, dataSecond], function (tx, resultado) {
            var rows = resultado.rows;
            var tr = '';
            for (var i = 0; i < rows.length; i++) {
                //criando variavel do tipo Cartao() pra salvar o cartao
                let cartao = new Cartao();

                //chamando a função localizarCartao() passando o ID, a função retorna o cartao
                cartao = bdc.localizarCartao(rows[i].idCartao);

                //formatando a data por formato brasileiro
                data = new Date(rows[i].data)
                data = data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

                //organizando os dados na tabela
                tr += '<tr>';
                tr += '<td>' + data + '</td>';
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