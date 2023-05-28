import  express from 'express';
import {conectar,agregarUsuario,atraparDatos,atraparId, validar,borrar, editar,insertarEstudiantes,exportarEstudiantes} from './src/mysql_connector.js';
import multer from 'multer';
import fs from 'fs';
import csvParser from 'csv-parser';
import path from 'path'
import { Parser } from 'json2csv';
import json2csv from 'json2csv'



const app= express()

app.listen('8000',function(){
    console.log('aplicacion iniciada en el puerto 8000')
})
//config pug

app.set('views','./vistas')
app.set('view engine', 'pug')

//config archivos estaticos
app.use(express.static('./vistas'))
app.use(express.static('./'))
app.use(express.static('./css'))
app.use(express.static('exports'));

/*app.get('/exportar', async (req, res) => {
    try {
      const datos = await exportarEstudiantes();
  
      // Crear un objeto CSV Parser
      const csvParser = new Parser();
      const csvData = csvParser.parse(datos);
  
      // Escribir los datos CSV en un archivo
      const fileName = 'datos.csv';
      fs.writeFileSync(fileName, csvData, 'utf8');
  
      res.status(200).json({ message: 'Exportación exitosa' });
    } catch (error) {
      res.status(500).json({ error: 'Error al exportar los datos a CSV' });
    }
  });*/
  /*app.get('/exportar', (req, res) => {
    exportarEstudiantes()
      .then((result) => {
        const csv = json2csv.parse(result);
        console.log(csv)
        const blob = new Blob([csv], { type: 'text/csv' });
        res.setHeader('Content-Disposition', 'attachment; filename=estudiantes.csv');
        res.setHeader('Content-Type', 'text/csv');
        res.send(blob);
      })
      .catch((error) => {
        console.error('Error al exportar los datos:', error);
        res.status(500).send('Error al exportar los datos');
      });
  });*/
  app.get('/exportar', (req, res) => {
    exportarEstudiantes()
      .then((result) => {
        const csv = json2csv.parse(result);
        res.setHeader('Content-Disposition', 'attachment; filename=estudiantes.csv');
        res.setHeader('Content-Type', 'text/csv');
        res.send(csv);
      })
      .catch((error) => {
        console.error('Error al exportar los datos:', error);
        res.status(500).send('Error al exportar los datos');
      });
  });
  

  
app.get('/',function(req,res){

    res.render('index')
    
    
})

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const convertToCSV = (data) => {
    const headers = Object.keys(data[0]); // Obtener los encabezados (nombres de las columnas) del primer objeto
  
    // Crear las filas del CSV
    const rows = data.map((item) => {
      return headers.map((header) => item[header]);
    });
  
    // Agregar los encabezados como la primera fila del CSV
    rows.unshift(headers);
  
    // Unir todas las filas con las celdas separadas por comas
    const csvData = rows.map((row) => row.join(',')).join('\n');
  
    return csvData;
  };
  app.get('/exportar', async (req, res) => {
    try {
      const result = await exportarEstudiantes();
      const csv = json2csv.parse(result);
      const blob = new Blob([csv], { type: 'text/csv' });
      res.setHeader('Content-Disposition', 'attachment; filename=estudiantes.csv');
      res.setHeader('Content-Type', 'text/csv');
      res.send(blob);
    } catch (error) {
      console.error('Error al exportar los datos:', error);
      res.status(500).send('Error al exportar los datos');
    }
  });
  

app.post('/importar', upload.single('archivoCSV'), (req, res) => {
  const archivoCSV = req.file; // Archivo CSV subido

  // Verificar si se subió un archivo
  if (!archivoCSV) {
    res.status(400).json({ error: 'No se ha subido ningún archivo CSV' });
    return;
  }
  fs.createReadStream(archivoCSV.path)
  .pipe(csvParser())
  .on('data', (rowData) => {
    const nombre = rowData.nombre?.trim();
    const apellido = rowData.apellido?.trim();
    const identificacion = rowData.identificacion_estudiante?.trim();
    const pruebas = rowData.puntaje_pruebas_estudiante?.trim();
    const estrato = rowData.estrato_estudiante?.trim();
    const colegios = rowData.colegio_estudiante?.trim();
    const localidad = rowData.localidad_estudiante?.trim();
    const email = rowData.email_estudiante?.trim();

    agregarUsuario(nombre, apellido, identificacion, pruebas, estrato, colegios, localidad, email);
  })
  .on('end', () => {
    res.redirect('/'); // Redirige al inicio después de la importación
  });
});
  // Procesar el archivo CSV
 /* const resultados = [];*/

  /*const csvStream = csvParser({ separator: ',' })
   .on('data', (data) => {
      const estudiante = {
        nombre: data[0].trim(),
        apellido: data[1].trim(),
        identificacion_estudiante: data[2].trim(),
        puntaje_pruebas_estudiante: data[3].trim(),
        estrato_estudiante: data[4].trim(),
        colegio_estudiante: data[5].trim(),
        localidad_estudiante: data[6].trim(),
        email_estudiante: data[7].trim(),
      };
      
      resultados.push(estudiante);
      console.log(resultados)
    })
    .on('end', () => {
        // Aquí puedes realizar las operaciones de inserción en la base de datos utilizando los datos obtenidos del archivo CSV
        // Puedes iterar sobre el arreglo 'resultados' y realizar una operación de inserción por cada estudiante
        insertarEstudiantes(resultados);

      res.redirect('/'); // Redirige al inicio después de la importación
    })
    .on('error', (error) => {
      console.error(error);
      res.status(500).json({ error: 'Error al procesar el archivo CSV' });
    });

  // Leer el archivo CSV
  fs.createReadStream(archivoCSV.path).pipe(csvStream);
});*/

// Resto del código de la aplicación...




app.get('/agregar/:nombre/:apellido/:identificacion/:pruebas/:estrato/:colegio/:localidad/:email',function(req,res){
    let nombre =req.params.nombre
    let apellido= req.params.apellido
    let identificacion=req.params.identificacion
    let pruebas=req.params.pruebas
    let estrato=req.params.estrato
    let colegio=req.params.colegio
    let localidad=req.params.localidad
    let email=req.params.email
    agregarUsuario(nombre,apellido,identificacion,pruebas,estrato,colegio,localidad,email)
    res.redirect('/')
    console.log(nombre,apellido,identificacion,pruebas,estrato,colegio,localidad,email)
    
    
}) 
app.get('/listarEstudiantes',async function(req,res){
    const estudiantes=await atraparDatos('')
    res.json({message:estudiantes})
    
}) 

app.get('/borrar/:identificacion', function(req,res){
    const identificacion=req.params.identificacion
    borrar(identificacion)
    return res.json({message:identificacion})
})
app.get('/editar/:nombre/:apellido/:identificacion/:pruebas/:estrato/:colegio/:localidad/:email/:id_estudiante', function(req,res){
    let id_estudiante=req.params.id_estudiante
    let nombre =req.params.nombre
    let apellido= req.params.apellido
    let identificacion=req.params.identificacion
    let pruebas=req.params.pruebas
    let estrato=req.params.estrato
    let colegio=req.params.colegio
    let localidad=req.params.localidad
    let email=req.params.email
    editar(nombre,apellido,identificacion,pruebas,estrato,colegio,localidad,email,id_estudiante)
    res.json({message:id_estudiante})
    
    
})
app.get('/validarId/:identificacion',async(req,res)=>{
    const identificacion=req.params.identificacion
    const validacion=await validar(identificacion)
    res.json({message:validacion})
})

app.get('/buscarEstudiantes/:searchValue', async (req, res) => {
    const searchValue = req.params.searchValue;
    try {
      const result = await atraparDatos(searchValue);
      res.json({ message: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  