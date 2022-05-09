(function() {
    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');
    
    
    document.addEventListener('DOMContentLoaded', () => {
        crearDB();
    
        if(window.indexedDB.open('citas2', 1)) {
            obtenerClientes();
        }
        listadoClientes.addEventListener("click", eliminarRegistro);
    });

    function eliminarRegistro(e) {
        if (e.target.classList.contains("eliminar")) {
            const idEliminar = Number(e.target.dataset.cliente);
            const confirmar = confirm("Deseas eliminar este Proovedor");
            if (confirmar) {
                const transaction = DB.transaction(["citas2"], "readwrite");
                const objectStore = transaction.objectStore("citas");  
                
                objectStore.delete(idEliminar);
                transaction.oncomplete = function (params) {
                    console.log("eliminado");
                    e.target.parentElement.parentElement.remove();
                }
                transaction.onerror= function (params) {
                    console.log("ERROR");
                }
            }
        };
    }
    
    // Código de IndexedDB
    function crearDB() {
        // crear base de datos con la versión 1
        const crearDB = window.indexedDB.open("citas2", 1);
    
        // si hay un error, lanzarlo
        crearDB.onerror = function() {
            console.log("Hubo un error");
        };
    
        // si todo esta bien, asignar a database el resultado
        crearDB.onsuccess = function() {
            // guardamos el resultado
            DB = crearDB.result;
        };
    
        // este método solo corre una vez
        crearDB.onupgradeneeded = function(e) {
            // el evento que se va a correr tomamos la base de datos
            const db = e.target.result;
    
            
            // definir el objectstore, primer parametro el nombre de la BD, segundo las opciones
            // keypath es de donde se van a obtener los indices
            const objectStore = db.createObjectStore("citas", { keyPath: 'id',  autoIncrement: true } );
    
            //createindex, nombre y keypath, 3ro los parametros
            objectStore.createIndex("macota", "mascota", {unique: false} );
            objectStore.createIndex("propietario", "propietario", {unique: false} );
            objectStore.createIndex("telefono", "telefono", {unique: false} );
            objectStore.createIndex("fecha", "fecha", {unique: false} );
            objectStore.createIndex("hora", "hora", {unique: false} );
            objectStore.createIndex("sintomas", "sintomas", {unique: false} );
            objectStore.createIndex("id", "id", {unique: true} );
    
            
            console.log('Database creada y lista');
        };
    
    }


    function obtenerClientes() {

        let abrirConexion = window.indexedDB.open('citas2', 1);

        // si hay un error, lanzarlo
        abrirConexion.onerror = function() {
            console.log('Hubo un error');
        };
    
        // si todo esta bien, asignar a database el resultado
        abrirConexion.onsuccess = function() {
            // guardamos el resultado
            DB = abrirConexion.result;

            const objectStore = DB.transaction('citas').objectStore('citas');


            // retorna un objeto request o petición, 
            objectStore.openCursor().onsuccess = function(e) {
                 // cursor se va a ubicar en el registro indicado para accede ra los datos
                 const cursor = e.target.result;

                //  console.log(e.target);
     
                 if(cursor) {
                    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cursor.value;
                    
                    
                    listadoClientes.innerHTML += `

                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${mascota} </p>
                                <p class="text-sm leading-10 text-gray-700">Nombre Dueño: ${propietario} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${fecha}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${hora}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${sintomas}</p>
                    `;
        
                    cursor.continue();
                 } else {
                    //  console.log('llegamos al final...');
                 }
             };



        };


    }
    

})();