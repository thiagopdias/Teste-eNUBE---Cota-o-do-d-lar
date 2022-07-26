const buttonFazBuscaPorData = document.querySelector('#buttonFazBuscaPorData')
const buttonFazBuscaPorPeriodo = document.querySelector('#buttonFazBuscaPorPeriodo')

const cotacaoPorPeriodoInicial = document.querySelector('#dataInicialPeriodo')
const cotacaoPorPeriodoFinal = document.querySelector('#dataFinalPeriodo')

// FUNÇÃO PARA COTAÇÃO POR DATA DETERMINADA
buttonFazBuscaPorData.addEventListener('click', () => {
    const paragrafo = document.getElementById('erro')
    paragrafo.innerHTML = ''

    try {
        const cotacaoPorData = document.querySelector('#dataDoDia')

        let tHead = document.getElementById('tabelaCotacaoPorDiaThead')
        let tBody = document.getElementById('tabelaCotacaoPorDiaTbody')
        function resetarTabela() {
            tHead.innerHTML = ''
            tBody.innerHTML = ''
        }

        resetarTabela()

        // Formatação da data
        const cotacaoPorDataValue = cotacaoPorData.value
        
        let data = new Date(cotacaoPorDataValue)
        const mes = data.getMonth() + 1
        const dia = data.getUTCDate()
        const ano = data.getUTCFullYear()

        const diaDaSemana = data.getDay()

        if(diaDaSemana == 5 || diaDaSemana == 6) {
            throw 'Infelizmente a cotação de Sábado e Domingo não está disponíveis'
        }
            
        const dataFormatada = `${mes}-${dia}-${ano}`
        
        function pegarDados(url) {
            let requisicao = new XMLHttpRequest()
            requisicao.open("GET", url, false)
            requisicao.send()
            return requisicao.responseText
        }

        let trHead = document.createElement('tr')

        let thCotacaoCompra = document.createElement('th')
        let thCotacaoVenda = document.createElement('th')
        let thHoraDataCotacao = document.createElement('th')

        tHead.appendChild(trHead)

        thCotacaoCompra.innerHTML = 'Cotação da Compra'
        thCotacaoVenda.innerHTML = 'Cotação da Venda'
        thHoraDataCotacao.innerHTML = 'Data e Hora da cotação'

        trHead.appendChild(thCotacaoCompra)
        trHead.appendChild(thCotacaoVenda)
        trHead.appendChild(thHoraDataCotacao)

        // VARIÁVEIS PARA CONVERTER O DOLAR PARA O REAL
        const dolarCompra = document.getElementById('dolarCompra')
        const buttonCompra = document.getElementById('buttonCompra')
        const paragrafoCompra = document.getElementById('paragrafoCompra')

        const dolarVenda = document.getElementById('dolarVenda')
        const buttonVenda = document.getElementById('buttonVenda')
        const paragrafoVenda = document.getElementById('paragrafoVenda')

        function adicionaValoresNaTabela(dados) {
            let trBody = document.createElement('tr')
        
            let tdCompra = document.createElement('td')
            let tdVenda = document.createElement('td')
            let tdHoraData = document.createElement('td')

            let cotacaoCompra = dados.cotacaoCompra
            cotacaoCompra.toFixed(2).replace('.', ',')
            const cotacaoCompraFormatada = cotacaoCompra.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
            tdCompra.innerHTML = cotacaoCompraFormatada

            let cotacaoVenda = dados.cotacaoVenda
            cotacaoVenda.toFixed(2).replace('.', ',')
            const cotacaoVendaFormatada = cotacaoVenda.toLocaleString('pt-Br', {style: 'currency', currency: 'BRL'})
            tdVenda.innerHTML = cotacaoVendaFormatada
            
            tdHoraData.innerHTML = dados.dataHoraCotacao
        
            trBody.appendChild(tdCompra)
            trBody.appendChild(tdVenda)
            trBody.appendChild(tdHoraData)

            buttonCompra.addEventListener('click', () => {
                const dolarCompraValue = dolarCompra.value
                
                let valorCompra = dolarCompraValue * cotacaoCompra
                valorCompra.toFixed(2).replace('.', ',')
                const valorCompraFormatado = valorCompra.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
                paragrafoCompra.innerHTML = valorCompraFormatado
            })

            buttonVenda.addEventListener('click', () => {
                const dolarVendaValue = dolarVenda.value
                
                let valorVenda = dolarVendaValue * cotacaoCompra
                valorVenda.toFixed(2).replace('.', ',')
                const valorVendaFormatado = valorVenda.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
                paragrafoVenda.innerHTML = valorVendaFormatado
            })

            return trBody
        }

        
        function carregaOsDados() {
            const dados = pegarDados(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${dataFormatada}'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`)
            const formatarDados = JSON.parse(dados)
        
            const novoArray = new Array(formatarDados)
        
            const desestruturação = novoArray.map(elemento => {
                return elemento.value
            })

            const valores = desestruturação.map(elemento => {
                return elemento
            })
        
            valores.forEach(element => {
                for (let index of element) {
                    console.log(index)
                    let linha = adicionaValoresNaTabela(index)
                    tBody.appendChild(linha)
                }
            })
        }
        
        carregaOsDados()

    } catch (error) {
        paragrafo.innerHTML = error
    }
})

// FUNÇÃO PARA COTAÇÃO POR PERÍODO
buttonFazBuscaPorPeriodo.addEventListener('click', () => {
    let tHead = document.getElementById('tabelaCotacaoPorPeriodoThead')
    let tBody = document.getElementById('tabelaCotacaoPorPeriodoTbody')
    function resetarTabela() {
        tHead.innerHTML = ''
        tBody.innerHTML = ''
    }

    resetarTabela()

    // FORMATAÇÃO DATA INICIAL
    const cotacaoPorPeriodoInicialValue = cotacaoPorPeriodoInicial.value
    let dataInicial = new Date(cotacaoPorPeriodoInicialValue)
    const mesInicial = dataInicial.getUTCMonth() + 1
    const diaInicial = dataInicial.getUTCDate()
    const anoInicial = dataInicial.getUTCFullYear()           
    const dataFormatadaInicial = `${mesInicial}-${diaInicial}-${anoInicial}`

    // FORMATAÇÃO DATA FINAL
    const cotacaoPorPeriodoFinalValue = cotacaoPorPeriodoFinal.value
    let dataFinal = new Date(cotacaoPorPeriodoFinalValue)
    const mesFinal = dataFinal.getMonth() + 1
    const diaFinal = dataFinal.getUTCDate()
    const anoFinal = dataFinal.getUTCFullYear()           
    const dataFormatadaFinal = `${mesFinal}-${diaFinal}-${anoFinal}`

    function pegarDados(url) {
        let requisicao = new XMLHttpRequest()
        requisicao.open("GET", url, false)
        requisicao.send()
        return requisicao.responseText
    }

    let trHead = document.createElement('tr')

    let thCotacaoCompra = document.createElement('th')
    let thCotacaoVenda = document.createElement('th')
    let thHoraDataCotacao = document.createElement('th')

    tHead.appendChild(trHead)

    thCotacaoCompra.innerHTML = 'Cotação da Compra'
    thCotacaoVenda.innerHTML = 'Cotação da Venda'
    thHoraDataCotacao.innerHTML = 'Data e Hora da cotação'

    trHead.appendChild(thCotacaoCompra)
    trHead.appendChild(thCotacaoVenda)
    trHead.appendChild(thHoraDataCotacao)

    function adicionaValoresNaTabela(dados) {
        console.log(dados)
        
        let trBody = document.createElement('tr')

        let tdCompra = document.createElement('td')
        let tdVenda = document.createElement('td')
        let tdHoraData = document.createElement('td')

        let cotacaoCompra = dados.cotacaoCompra
        cotacaoCompra.toFixed(2).replace('.', ',')
        const cotacaoCompraFormatada = cotacaoCompra.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
        tdCompra.innerHTML = cotacaoCompraFormatada

        let cotacaoVenda = dados.cotacaoVenda
        cotacaoCompra.toFixed(2).replace('.', ',')
        const cotacaoVendaFormatada = cotacaoCompra.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
        tdVenda.innerHTML = cotacaoVendaFormatada

        tdHoraData.innerHTML = dados.dataHoraCotacao
        
        trBody.appendChild(tdCompra)
        trBody.appendChild(tdVenda)
        trBody.appendChild(tdHoraData)

        return trBody
    }

    function carregaOsDados() {
        const dados = pegarDados(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${dataFormatadaInicial}'&@dataFinalCotacao='${dataFormatadaFinal}'&$top=262&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`)

        const formatarDados = JSON.parse(dados)

        const novoArray = new Array(formatarDados)
    
        const desestruturação = novoArray.map(elemento => {
            return elemento.value
        })
    
        const valores = desestruturação.map(elemento => {
            return elemento
        })

        console.log(valores)
        
        valores.forEach(elemento => {
            for (let index of elemento) {
                console.log(index)
                let linha = adicionaValoresNaTabela(index)
                tBody.appendChild(linha)
            }
        });
    }

    carregaOsDados()
})