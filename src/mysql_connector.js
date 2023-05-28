import mysql from 'mysql'
import util from 'util'
const connector =mysql.createConnection(
    {
        host: 'localhost',
        user:'UniConnect2',
        password:'123456',
        database:'estudiantes'
    }
)

const query = util.promisify(connector.query).bind(connector)

const conectar =()=>{
    connector.connect(err =>{
        if (err) throw err
        console.log("conectado")
    })
}

/*const agregarUsuario =(nombre,apellido,identificacion,pruebas,estrato,colegios,localidad,email) =>{
    const sql =`INSERT INTO estudiantes (id_estudiante, nombre, apellido, identificacion_estudiante, puntaje_pruebas_estudiante, estrato_estudiante, colegio_estudiante, localidad_estudiante, email_estudiante) VALUES (${null},"${nombre}","${apellido}",${identificacion},${pruebas},${estrato},"${colegios}","${localidad}","${email}")`
    connector.query(sql, function(err,result,filed){
        if(err) throw err
        console.log(result)
    })
}*/
const insertarEstudiantes = (estudiantes) => {
    const query = 'INSERT INTO estudiantes (nombre, apellido, identificacion_estudiante, puntaje_pruebas_estudiante, estrato_estudiante, colegio_estudiante, localidad_estudiante, email_estudiante) VALUES ?';
  
    const values = estudiantes.map((estudiante) => [
      estudiante.nombre,
      estudiante.apellido,
      estudiante.identificacion_estudiante,
      estudiante.puntaje_pruebas_estudiante,
      estudiante.estrato_estudiante,
      estudiante.colegio_estudiante,
      estudiante.localidad_estudiante,
      estudiante.email_estudiante,
    ]);
  
    connector.query(query, [values], (error, result) => {
      if (error) {
        console.error('Error al insertar estudiantes:', error);
      } else {
        console.log('Estudiantes insertados correctamente');
      }
    });
  };
const agregarUsuario = (nombre, apellido, identificacion, pruebas, estrato, colegios, localidad, email) => {
    const estudiante = {
      nombre,
      apellido,
      identificacion_estudiante: identificacion,
      puntaje_pruebas_estudiante: pruebas,
      estrato_estudiante: estrato,
      colegio_estudiante: colegios,
      localidad_estudiante: localidad,
      email_estudiante: email,
    };
  
    insertarEstudiantes([estudiante]);
  };
  
const atraparDatos=async(searchValue)=>{
    let datal = ''
    const atrapar= `SELECT * FROM estudiantes WHERE status = 1 AND (nombre LIKE '%${searchValue}%' OR apellido LIKE '%${searchValue}%' OR identificacion_estudiante LIKE '%${searchValue}%' OR puntaje_pruebas_estudiante LIKE '%${searchValue}%' OR estrato_estudiante LIKE '%${searchValue}%' OR colegio_estudiante LIKE '%${searchValue}%' OR localidad_estudiante LIKE '%${searchValue}%' OR email_estudiante LIKE '%${searchValue}%')`
    let result= await query(atrapar)
    for (let i =0;i<result.length;i++){
        datal += `<tr><th>${result[i].nombre}</th>
        <td>${result[i].apellido}</td>
        <td>${result[i].identificacion_estudiante}</td>
        <td>${result[i].puntaje_pruebas_estudiante}</td>
        <td>${result[i].estrato_estudiante}</td>
        <td>${result[i].colegio_estudiante}</td>
        <td>${result[i].localidad_estudiante}</td>
        <td>${result[i].email_estudiante}</td>
        <td><button id=${result[i].id_estudiante} class="botonEliminar btn btn-outline-success" type="submit">Delete</button></td>
        <td><button id=${result[i].id_estudiante}  class="botonEditar btn btn-outline-success" type="submit">Editar</button></td>    
        </tr> `

    }   
  
    
    
    return datal
}
const atraparDatos2=async()=>{
    let datal = ''
    const atrapar= `SELECT * FROM estudiantes WHERE status = 1 AND (nombre LIKE '%${searchValue}%' OR apellido LIKE '%${searchValue}%' OR identificacion_estudiante LIKE '%${searchValue}%' OR puntaje_pruebas_estudiante LIKE '%${searchValue}%' OR estrato_estudiante LIKE '%${searchValue}%' OR colegio_estudiante LIKE '%${searchValue}%' OR localidad_estudiante LIKE '%${searchValue}%' OR email_estudiante LIKE '%${searchValue}%')`
    let result= await query(atrapar)
    for (let i =0;i<result.length;i++){
        datal += `<tr><th>${result[i].nombre}</th>
        <td>${result[i].apellido}</td>
        <td>${result[i].identificacion_estudiante}</td>
        <td>${result[i].puntaje_pruebas_estudiante}</td>
        <td>${result[i].estrato_estudiante}</td>
        <td>${result[i].colegio_estudiante}</td>
        <td>${result[i].localidad_estudiante}</td>
        <td>${result[i].email_estudiante}</td>
        <td><button id=${result[i].id_estudiante} class="botonEliminar btn btn-outline-success" type="submit">Delete</button></td>
        <td><button id=${result[i].id_estudiante}  class="botonEditar btn btn-outline-success" type="submit">Editar</button></td>    
        </tr> `

    }   
  

    
    return datal
}

let ides=[]
const atraparId=()=>{
    const atrapar= `SELECT * FROM estudiantes`
    connector.query(atrapar,function(err,result,filed){
        if(err) throw err
        const atrapados=result
        
        for (let i =0;i<result.length;i++){
            ides.push(result[i].identificacion_estudiante)  
            
        }
        console.log(ides)
    })
    
    return ides
}
const validar= async(identificacion_estudiante)=>{
    
    const atrapar= `SELECT * FROM estudiantes WHERE identificacion_estudiante = ${identificacion_estudiante} AND status = 1`
    let condicion =false
    let rows=await  query(atrapar)

    console.log(rows.length>0)
    
    return rows.length>0
}

const borrar =async(id_estudiante)=>{
    const borrado = `UPDATE estudiantes SET status =-1 WHERE id_estudiante=${id_estudiante}`
    await query(borrado)
}
const editar =async(nombre,apellido,identificacion,pruebas,estrato,colegios,localidad,email,id_estudiante)=>{
    const editado = `UPDATE estudiantes SET nombre="${nombre}", apellido="${apellido}", identificacion_estudiante=${identificacion}, puntaje_pruebas_estudiante=${pruebas}, estrato_estudiante=${estrato}, colegio_estudiante="${colegios}", localidad_estudiante="${localidad}", email_estudiante="${email}" WHERE id_estudiante =${id_estudiante} `
    await query(editado)
}

const exportarEstudiantes = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM estudiantes'; // Consulta para obtener los datos de la tabla estudiantes
  
      connector.query(sql, (err, result) => {
        if (err) {
          console.error('Error al ejecutar la consulta:', err);
          reject(err);
        } else {
         // console.log('Datos obtenidos correctamente:', result);
          resolve(result);
        }
      });
    });
  };
  
  console.log("BUENAAAS",exportarEstudiantes())
console.log(validar(1213))
export {agregarUsuario,atraparDatos,atraparId,validar,borrar,editar,insertarEstudiantes,exportarEstudiantes}
export {conectar}
