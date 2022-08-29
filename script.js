const contenedorCeldas = document.getElementById("contenedorCeldas");
let modal = document.getElementById("modal");
let bloqueo = document.getElementById("bloqueo");
document.oncontextmenu = new Function("return false");  //se deshabilita el menu de opciones del click derecho
let reiniciar = document.querySelector(".reiniciar");
let jugar = document.querySelector(".jugar");
let numFilas = 10; 
let numColumnas = 10;
let cantidadMinas;
let nivelJuego;
let juegoNuevo = document.getElementById("reiniciar");
let celdasParaGanar = 0;

//Funcion para detectar en que celda se disparó el evento
function abrir(e){
		let cell = e.currentTarget; //se obtiene el elemento.
		let filaCelda = parseInt(cell.dataset.fila);
		let columnaCelda = parseInt(cell.dataset.columna);
		validarCelda(filaCelda,columnaCelda);
}
//Funcion para validar contenido de la celda y realizar determinada instrucción dependiende de este.
let contadorGanador=0; //se inicia contador para celdas abiertas.
function validarCelda(filaCelda,columnaCelda){
	if(filaCelda>-1 && filaCelda < numFilas && columnaCelda >-1 && columnaCelda < numColumnas) //validamos que la celda esta entre el 0 y el 9 de fila y columna
	{	
		let cell = document.getElementById("f"+filaCelda+"_c"+columnaCelda); 
		if(!cell.classList.contains("abierta") && !cell.classList.contains("bandera"))
		{	
			cell.classList.add("abierta");
			contadorGanador++ //cuenta las celdas abiertas
			cell.innerHTML = arrayCeldasVacias[filaCelda][columnaCelda]; //le damos el valor que tiene el array en esa ubicacion
			if(arrayCeldasVacias[filaCelda][columnaCelda] !=="💣") //validamos que no sea una mina
			{
				if(arrayCeldasVacias[filaCelda][columnaCelda] === 0 )  //validamos si el valor es 0
				{ 				
					validarCelda(filaCelda-1,columnaCelda-1); //revisa fila de arriba
					validarCelda(filaCelda-1,columnaCelda);				
					validarCelda(filaCelda-1,columnaCelda+1);					
					validarCelda(filaCelda,columnaCelda-1); // reivsa misma fila de la celda ya abierta
					validarCelda(filaCelda,columnaCelda+1);
					validarCelda(filaCelda+1,columnaCelda-1); //revisa fila de abajo
					validarCelda(filaCelda+1,columnaCelda);
					validarCelda(filaCelda+1,columnaCelda+1);
					cell.innerHTML="";
				}
			}else {
				modal.style.display = "flex";
				bloqueo.style.display = "block"
			}
			if(contadorGanador>=celdasParaGanar){ //
				modal.style.display = "flex";
				modal.childNodes[0].innerHTML = "FELICITACIONES!!! HAS GANADO!!!! <br>🥳🥳🥳🥳🥳🥳";
				contenedorCeldas.style.filter ="blur(10px)";
			}
		}
	}
}

reiniciar.addEventListener("click",(e)=>{
	reiniciarJuego();
})

juegoNuevo.addEventListener("click",(e)=>{
	reiniciarJuego();	
})
function reiniciarJuego(){
	location.reload();
}

//bucle for para crear los div de celdas que contendrán las minas
for (let fi=0; fi<numFilas; fi++) //bucle para filas
{
	for(let co=0; co<numColumnas; co++) //bucle para columnas
	{
		let celda = document.createElement("div");
		celda.classList.add("cell");
		celda.setAttribute("id","f"+fi+"_c"+co); 
		celda.dataset.fila = fi;
		celda.dataset.columna = co;	
		celda.addEventListener("click",abrir)
		celda.addEventListener("contextmenu",(e)=>{  
	    let cell = e.currentTarget;  //obtenemos el elemento que ha disparado el evento
	    let filaCelda = cell.dataset.fila;  //obtenemos la fila de las propiedades dataset.
	    let columnaCelda = cell.dataset.columna;
	        if(!cell.classList.contains("abierta"))
	        {     //si ya fue abierta, no se puede marcar
		        if (filaCelda>=0 && columnaCelda>=0 && filaCelda< numFilas && columnaCelda < numColumnas)
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
		contenedorCeldas.appendChild(celda);  //agregamos los div (celdas) al div principal
	}
}

//creamos un array espejo (tamaño de la grilla) para guardar las bombas aleatoriamente.
let arrayCeldasVacias = new Array(numFilas); 
for(let k=0; k<10; k++)
{ 
	arrayCeldasVacias[k] = new Array(numColumnas)
}

function agregarMinas (cantidadMinas){
	let minas =0;
	while(minas < cantidadMinas){
		//while para que mientras sea un numero repetido en el array busque otro
		let ubicMinaFi = parseInt(Math.random() * 10);
		let ubicMinaCo = parseInt(Math.random() * 10);
			if(arrayCeldasVacias[ubicMinaFi][ubicMinaCo] != "💣")
			{
				arrayCeldasVacias[ubicMinaFi][ubicMinaCo] = "💣"
				minas++;
			}
	}
}
console.log(arrayCeldasVacias)
function contarMinasAdy (fila, col){
	let contadorMinas=0;
	for(let fi = fila-1; fi <= fila+1 ; fi ++) //toma la fila anterior hasta la siguiente
	{
		for(let co = col-1; co <= col+1; co ++) //toma la columna anterior hasta la siguiente
		{
			if(fi>-1 && fi<10 && co>-1 && co<10)
			{
				if(arrayCeldasVacias[fi][co] == "💣"){ 
					contadorMinas++}
			}
		}
	}
	arrayCeldasVacias[fila][col] = contadorMinas; 
}

function contarMinas(){
	for(let fila=0; fila < 10; fila ++){
		for(let col=0; col<10; col++){
			if(arrayCeldasVacias[fila][col]!="💣")
				contarMinasAdy(fila,col);
		}
	}
}

function elegirNivel(){
	mensaje.innerHTML = "";
	let niveles = document.getElementsByName("nivel");
	for (let nivel of niveles)
	{
		if (nivel.checked)
			nivelJuego = nivel.value;
	}
			if(nivelJuego ==="F"){
				cantidadMinas = 10;
				celdasParaGanar = 90;
				
			}else if(nivelJuego ==="I"){
				cantidadMinas = 20;
				celdasParaGanar = 80;
				
			}else if(nivelJuego ==="D"){
				cantidadMinas = 30;
				celdasParaGanar = 70;
			}
			agregarMinas(cantidadMinas)
			contarMinas();
			bloqueo.style.display ="none";	
}