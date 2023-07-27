module.exports = (data, selecionado)=>{
    var anoAtual = data[0].ano
    var ano = []
    for (key in data) {
           if(anoAtual == data[key].ano){
            const filtro = ano.filter(ano => ano == data[key].ano)
            if(filtro.length == 0){
                ano.push({ano:data[key].ano, selecionado:selecionado == data[key].ano ? true : null})
                anoAtual++
            }
           }
    }
    return ano
}