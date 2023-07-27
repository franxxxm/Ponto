

    const horaRegistrar = document.getElementById("hora")
    const load = document.getElementById('carregar')

    load.innerHTML += `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`

    const exibirHoraAtual = async ()=>{
    var data = new Date();
    var hora = data.getHours();
    var minutos = data.getMinutes();
    var segundos = data.getSeconds();
  
    if (hora < 10) hora = "0" + hora;
    if (minutos < 10) minutos = "0" + minutos;
    if (segundos < 10) segundos = "0" + segundos;
  
    var horaAtual = hora + ":" + minutos + ":" + segundos;

   horaRegistrar.innerHTML = await `${horaAtual}`
      load.innerHTML = ''
  }
  setInterval(exibirHoraAtual, 1000)