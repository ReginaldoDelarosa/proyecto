
const nombre = document.querySelector('#nombre')
const apellido = document.querySelector('#apellido')
const identificacion = document.querySelector('#identificacion')
const pruebas = document.querySelector('#pruebas')
const estrato = document.querySelector('#estrato')
const colegios = document.querySelector('#colegios')
const localidad = document.querySelector('#localidad')
const email = document.querySelector('#email')
const btnAgregar=document.querySelector('#agregar')
const btnListar=document.querySelector('#listar')
const tablacontent = document.querySelector('#tabla-info tbody');
const btnDelete = document.getElementById('identificacion')

    
btnAgregar.addEventListener('click',async()=>{
    let response = await fetch(`/validarId/${identificacion.value}`)
    let data = await response.json()                        
    
    if(!nombre.value || !apellido.value || !identificacion.value || !pruebas.value || !estrato.value || !colegios.value || !localidad.value || !email.value ){
        alert("rellene todos los campos")
        return
    }else if (!email.value.includes("@")) {
        alert("El email debe contener '@'");
        return;
    }else if(data.message){
        alert("El estudiante ya existe");
        return;
    }
    else{
        window.location.href=`agregar/${nombre.value}/${apellido.value}/${identificacion.value}/${pruebas.value}/${estrato.value}/${colegios.value}/${localidad.value}/${email.value}`
    }
})
function listar (){
    
    fetch("/listarEstudiantes")
     .then((res)=> res.json())
     .then((data)=>{
        
        tablacontent.innerHTML='<tbody>'+ data.message+'</tbody>'
         const botones = document.querySelectorAll('.botonEliminar')
         const botones2= document.querySelectorAll('.botonEditar')
         botones2.forEach((e)=>{
            e.addEventListener('click',()=>{
                editarId(e.id)
            })
         })
         botones.forEach((e)=>{
            e.addEventListener('click',()=>{
                eliminarId(e.id)
            })
         })
     })}

btnListar.addEventListener('click',listar
)

const editarId=async(id_estudiante)=>{
    let response=await fetch(`/editar/${nombre.value}/${apellido.value}/${identificacion.value}/${pruebas.value}/${estrato.value}/${colegios.value}/${localidad.value}/${email.value}/${id_estudiante}`)
    let data = await response.json()
    listar()
}

const eliminarId =async(id_estudiante)=>{
    let response = await fetch(`/borrar/${id_estudiante}`)
    let data = await response.json()
    listar()           

}
function filtrarDatos() {
    let searchValue = document.getElementById('searchInput').value;
    fetch(`/buscarEstudiantes/${searchValue}`)
      .then((res) => res.json())
      .then((data) => {
        tablacontent.innerHTML = '<tbody>' + data.message + '</tbody>';
        const botones = document.querySelectorAll('.botonEliminar')
        const botones2= document.querySelectorAll('.botonEditar')
        botones2.forEach((e)=>{
           e.addEventListener('click',()=>{
               editarId(e.id)
           })
        })
        botones.forEach((e)=>{
           e.addEventListener('click',()=>{
               eliminarId(e.id)
           })
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }
  

  
/*document.addEventListener('DOMContentLoaded', function() {
  // Obtener el botón por su ID o cualquier otro selector adecuado
  const exportarBtn = document.getElementById('exportarBtn');

  // Asignar el evento click al botón
  exportarBtn.addEventListener('click', function() {
    // Realizar la llamada a la ruta correspondiente para exportar el CSV
    window.location.href = '/exportar';
  });
});*/
/*document.getElementById('exportarBtn').addEventListener('click', () => {
    fetch('/exportar')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al exportar los datos');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'estudiantes.csv';
        link.click();
      })
      .catch((error) => {
        console.error('Error al exportar los datos:', error);
      });
  });*/
  /*document.getElementById('exportarBtn').addEventListener('click', () => {
    fetch('/exportar')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al exportar los datos');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'estudiantes.csv';
        link.click();
      })
      .catch((error) => {
        console.error('Error al exportar los datos:', error);
      });
  });*/
  document.getElementById('exportarBtn').addEventListener('click', () => {
    fetch('/exportar')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al exportar los datos');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'estudiantes.csv';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error al exportar los datos:', error);
      });
  });
  
  
  


