module.exports = (data, anoAtual, mes)=>{
    const diaMes = new Date(anoAtual, mes, 0).getDate();
            var estruturaMes = []
            var num = 1
            for (var i = 0; i < diaMes; i++) {
                var nomeDia = new Date(anoAtual, mes - 1, num).toLocaleString('pt-BR', {weekday:'long'})
                if(nomeDia != 'sábado' && nomeDia != 'domingo'){
                    estruturaMes.push({
                        dia: num,
                        entrada:'X',
                        saida:'X',
                        diaDasemana:nomeDia,
                        fds:null,
                    })
                }else{
                    estruturaMes.push({
                        dia: num,
                        entrada:null,
                        saida:null,
                        diaDasemana:nomeDia,
                        fds:true,
                    })
                }
                num++
            }
            for (const key in data) {
                    estruturaMes[data[key].dia - 1].entrada = data[key].hora_entrada || 'X'
                    estruturaMes[data[key].dia - 1].saida = data[key].hora_saida || 'X'
            }
            return estruturaMes
}