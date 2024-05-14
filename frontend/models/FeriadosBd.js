const { default: axios } = require("axios");


const getAll = async ()=>{ 
    try {
      return await axios.get('http://192.168.88.52:2000/api/ferias')  
    } catch (error) {
        console.log(error)
    }
    
}

const create = async (nome, data, dataSec, nacional)=>{
    try {
	return await axios.post('http://192.168.88.52:2000/api/ferias', {nome, data, dataSec, nacional})
} catch (error) {
	console.log(error)
}
}


const delet = async (id) =>{
    try {
	return await axios.delete(`http://192.168.88.52:2000/api/ferias/${id}`)
} catch (error) {
	console.log(error)
}
}



module.exports = {
    create, 
    delet,
    getAll
}