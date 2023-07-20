

    const horaRegistrar = document.getElementById("hora")

    const exibirHoraAtual= ()=>{
    var data = new Date();
    var hora = data.getHours();
    var minutos = data.getMinutes();
    var segundos = data.getSeconds();
  
    // Formatação para adicionar um zero à esquerda se os valores forem menores que 10
    if (hora < 10) hora = "0" + hora;
    if (minutos < 10) minutos = "0" + minutos;
    if (segundos < 10) segundos = "0" + segundos;
  
    var horaAtual = hora + ":" + minutos + ":" + segundos;

    horaRegistrar.innerHTML = `${horaAtual}` 
  }
  setInterval(exibirHoraAtual, 1000)