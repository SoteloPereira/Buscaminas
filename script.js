const contenedorCeldas = document.querySelector(".contenedorCeldas")
let modal = document.querySelector(".modal")
let modalP = document.querySelector(".modalPreg")
let mensaje = document.querySelector(".mensaje")
let btnR = document.getElementById('prueba')
let minas = document.querySelectorAll(".minas")
document.oncontextmenu = new Function("return false")  //se deshabilita el menu de opciones del click derecho
let reiniciar = document.querySelectorAll(".reiniciar")
let numFilas = 10
let numColumnas = 10
let cantidadMinas; //segun dificultad que elija el usuario
let nivelJuego; //nivel que elije el usuario
let celdasParaGanar = 0 //Facil:90 - Intermedio:80 - Dificil:70

//Funcion para detectar en que celda se disparó el evento
function abrir(e){
		let cell = e.currentTarget //se obtiene el elemento.
		let filaCelda = parseInt(cell.dataset.fila)
		let columnaCelda = parseInt(cell.dataset.columna)
		validarCelda(filaCelda,columnaCelda) //vamos a validar el contenido de la celda
}
//Funcion para validar contenido de la celda y realizar determinada instrucción dependiendo del valor de este.
let contadorGanador=0 //se inicia contador para celdas abiertas.
function validarCelda(filaCelda,columnaCelda){
	if(filaCelda > -1 && filaCelda < numFilas && columnaCelda >-1 && columnaCelda < numColumnas) //validamos que la celda esta entre el 0 y el 9 de fila y columna
	{	
		let cell = document.getElementById("f"+filaCelda+"_c"+columnaCelda)
		if(!cell.classList.contains("abierta") && !cell.classList.contains("bandera"))
		{	
			cell.classList.add("abierta")
			contadorGanador++ //cuenta las celdas abiertas
			cell.innerHTML = arrayCeldasVacias[filaCelda][columnaCelda] //le damos el valor que tiene el array espejo en esa ubicacion
			if(arrayCeldasVacias[filaCelda][columnaCelda] !=="💣") //validamos que no sea una mina
			{
				if(arrayCeldasVacias[filaCelda][columnaCelda] === 0 )  //validamos si el valor es 0, usamos recursividad para recorrer las casillas alrededor
				{ 				
					validarCelda(filaCelda-1,columnaCelda-1); //revisa fila de arriba
					validarCelda(filaCelda-1,columnaCelda);				
					validarCelda(filaCelda-1,columnaCelda+1);					
					validarCelda(filaCelda,columnaCelda-1); // reivsa misma fila de la celda ya abierta
					validarCelda(filaCelda,columnaCelda+1);
					validarCelda(filaCelda+1,columnaCelda-1); //revisa fila de abajo
					validarCelda(filaCelda+1,columnaCelda);
					validarCelda(filaCelda+1,columnaCelda+1);
					cell.innerHTML=""; //al ser 0, dejamos el contenido de la celda vacío
				}
			}else { //si es igual a 💣 mostrar Minas y bloquear
					for(let ubi of ubicacionMinas){
						let mina = contenedorCeldas.children[ubi];
						mina.classList.remove('bandera')
						mina.textContent = "💣"
						mina.style.backgroundColor = "rgb(244, 79, 79)";
						contenedorCeldas.classList.add("celdasDesactivadas")
					}
				}		
			if(contadorGanador >= celdasParaGanar){
				modal.style.display = "block";
				mensaje.innerHTML = "FELICITACIONES!!! HAS GANADO!!!! 🥳🥳🥳🥳🥳🥳";
				contenedorCeldas.style.filter ="blur(10px)";
				contenedorCeldas.classList.add("celdasDesactivadas")
			}
			
		}
	}
}

for (let btn of reiniciar){ //para reiniciar desde boton "Reiniciar" durante el juego, y desde "Juego nuevo" del modal
	btn.addEventListener("click",(e)=>{
		if(btn.name === "reiniciar"){
			modalP.children[0].textContent ="¿ Estas seguro que deseas reiniciar la partida ? ";
			modalP.style.display = "block";
			contenedorCeldas.style.filter ="blur(3px)";
			let btnModalP = document.querySelectorAll(".btnP")
			for(let respuesta of btnModalP){
				respuesta.addEventListener("click",(e)=>{
					if (respuesta.value === "si") reiniciarJuego();
					else modalP.style.display = "none";
					contenedorCeldas.style.filter ="";
				})
			}
		}else{
			reiniciarJuego()
		}
	 })
}
function reiniciarJuego(){
	location.reload();
}

//bucle for para crear los div de celdas que contendrán las minas
for (let fi=0; fi<numFilas; fi++){ //loop para filas
	for(let co=0; co<numColumnas; co++) //loop para columnas
	{
		let celda = document.createElement("div");
		celda.classList.add("cell","desactivarCell");
		celda.setAttribute("id","f"+fi+"_c"+co); //lo colocamos un id para poder acceder luego a la celda
		celda.dataset.fila = fi; //para usar los datos del array espejo
		celda.dataset.columna = co;	
		celda.addEventListener("click",abrir)
		celda.addEventListener("contextmenu",(e)=>{  
	    let cell = e.currentTarget;  //obtenemos el elemento que ha disparado el evento
	    let filaCelda = cell.dataset.fila;  //obtenemos la fila de las propiedades dataset.
	    let columnaCelda = cell.dataset.columna; //lo propio con la columna
	        if(!cell.classList.contains("abierta"))
	        {     //si ya fue abierta, no se puede marcar
		        if (filaCelda >=0 && columnaCelda >= 0 && filaCelda < numFilas && columnaCelda < numColumnas)
		        {
		            if (cell.classList.contains("bandera"))  //si esta marcada,se quita la bandera
		            {   
		                cell.classList.remove("bandera");
		        	}else if (!cell.classList.contains("bandera")){
		                cell.classList.add("bandera");  //si no está marcada la marcamos como "bandera"
		            }
		    	} 		
			}
		});
		contenedorCeldas.appendChild(celda);  //agregamos los div (celdas) al div contenedor
	}
}

//creamos un array espejo (tamaño de la grilla) para guardar las bombas aleatoriamente.
let arrayCeldasVacias = new Array(numFilas); 
for(let k=0; k<10; k++){ 
	arrayCeldasVacias[k] = new Array(numColumnas)
}

let ubicacionMinas = []; //array vacio que guardará las coordenadas de las bombas
//funcion donde agregamos las minas (segun nivel) al array espejo
function agregarMinas (cantidadMinas){
	let minas =0;
	while(minas < cantidadMinas){
		//while para que mientras no ubique una mina busque otra posición en el array donde dejar la mina
		let ubicMinaFi = parseInt(Math.random() * 10);
		let ubicMinaCo = parseInt(Math.random() * 10);
			if(arrayCeldasVacias[ubicMinaFi][ubicMinaCo] != "💣")
			{
				arrayCeldasVacias[ubicMinaFi][ubicMinaCo] = "💣"
				ubicacionMinas.push("f"+ubicMinaFi+"_c"+ubicMinaCo); //array para luego mostrar las bombas (al perder)	
				minas++;
			}
	}
}

function contarMinas(){
	for(let fila=0; fila < 10; fila ++){
		for(let col=0; col<10; col++){
			if(arrayCeldasVacias[fila][col]!="💣")
				contarMinasAdy(fila,col);
		}
	}
}

function contarMinasAdy (fila, col){
	let contadorMinas=0;
	for(let fi = fila-1; fi <= fila + 1 ; fi ++){ //toma la fila anterior hasta la siguiente
		for(let co = col-1; co <= col+1; co ++){ //toma la columna anterior hasta la siguiente
			if(fi > -1 && fi < 10 && co > -1 && co < 10)
			{
				if(arrayCeldasVacias[fi][co] == "💣"){ 
					contadorMinas++} //valida que su valor sea una mina y las suma al contador
			}
		}
	}
	arrayCeldasVacias[fila][col] = contadorMinas; //se le asigna a la espacio en el array el valor de minas encontradas
}

let jugando = false;
function elegirNivel(){
	btnR.classList.remove('desactivarCell');
	if(jugando === false){
		jugando = true;
		let cantMinas = document.querySelector(".cantidadMinas");
		let tiempo = document.querySelector(".tiempo");
		let niveles = document.getElementsByName("nivel"); //tomamos los elementos de radio button para obtener el nivel elegido
			for (let nivel of niveles)
			{	//tomar el valor seleccionado por usuario
				if (nivel.checked) nivelJuego = nivel.value; 
			}	//se valida la selección de usuario para determinar cantidad de minas
				if(nivelJuego ==="F"){
					cantidadMinas = 10; 
					celdasParaGanar = 90;		
				}else if(nivelJuego ==="I"){
					cantidadMinas = 20;
					celdasParaGanar = 80;		
				}else if(nivelJuego = "D"){
					cantidadMinas = 30;
					celdasParaGanar = 70;}
					cantMinas.innerHTML += "Cantidad de minas: "+cantidadMinas;
				agregarMinas(cantidadMinas);
				contarMinas();
				console.log(arrayCeldasVacias); //mostrar array con ubicacion de minas
				let celdas = document.querySelectorAll(".cell")
					//activar las celdas luego de elegir el nivel
					for (let celda of celdas){
						celda.classList.remove("desactivarCell");
					}	
			let m = 4 ;
			let s = 60 ;
			function cronometro(){
				s--;
				var cuentaRegresiva = setTimeout(cronometro, 1000);
				if(s === 0){ 
					if(m < 10){
						if(m === 0){
							tiempo.innerHTML = "0"+m+":0"+s;
							mensaje.innerHTML = "¡ Se acabó el tiempo! <br> Has perdido la partida 😞"
							modal.style.display = "block";
							contenedorCeldas.style.filter ="blur(10px)";
							contenedorCeldas.classList.add("celdasDesactivadas")
							clearTimeout(cuentaRegresiva)
						}else{
							tiempo.innerHTML = "0"+m+":0"+s;
							m--; 
							s = 60;}
					}else {
						tiempo.innerHTML = m+":0"+s;
						m--; 
						s = 60; }
				} else if(m < 10){
						if(s < 10){
							tiempo.innerHTML = "0"+m+":0"+s;}
						else{
							tiempo.innerHTML = "0"+m+":"+s; }
					}else if (s < 10){
							tiempo.innerHTML = m+":0"+s;
						}else{
							tiempo.innerHTML = m+":"+s;}
			}	
			cronometro() }
	else{
			location.reload();
			jugando = false; }
}
