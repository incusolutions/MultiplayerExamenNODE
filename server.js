//incluimos la librería y asignamos puerto
var io = require("socket.io").listen(6969);
var users = [];
var gana = 4;
var numerousuarios = 0;
var numerouserend = 0;
var mayor = 0;
//creamos coneccion con el cliente, cada vez que el cliente establezca conexion se dispara la funcion recibir


io.sockets.on("connection", recibir);
function recibir(socket){
    socket.on("jugador", nuevoplayer);
    socket.on("conteofin", jugadoresterminaron);

    function jugadoresterminaron(data){
    		numerouserend += 1;

    		console.log(numerousuarios+"blabla");
		    console.log(numerouserend+"llegaron");
    		
    		if(numerouserend == numerousuarios) {
    			for(var i=0; i<users.length; i++) {
					var user = users[i];
					if(user.buenas>mayor){
						mayor=user.buenas;
						var nombredelwin = user.name;
					}
					
				}
				console.log(mayor+'jugadoresterminaron');
				console.log(nombredelwin+'jugadoresterminaron');

				io.sockets.emit("ganador",nombredelwin);
			}
			
    }

  
    function nuevoplayer(data){
     var user = addUser(data);
   
      socket.on('respuesta', function () {
		user.buenas += 1;
		updateUsers();

		/*if(user.buenas == gana) {
			io.sockets.emit("win", { message: "<span class='gana'>" + user.name + "</strong> rocks!" });
		}
		*/

		//io.sockets.emit("respuestascor", { numerobuena: user.buenas });
	  });

	  socket.on('disconnect', function () {
	    removeUser(user);
		mayor=0;
	  });

    }
}


function updatemayor(){
	if(numerouserend == numerousuarios) {
    			for(var i=0; i<users.length; i++) {
					var user = users[i];
					if(user.buenas>mayor){
						mayor=user.buenas;
						var nombredelwin = user.name;
					}
					
				}
				console.log(mayor+'updatemayor');
				console.log(numerouserend+"numero de usuarios terminado en updatemayor");

				io.sockets.emit("ganador",nombredelwin);
				//io.sockets.emit("ganador",user.name);
	}
}


var addUser = function(nombre) {
	var user = {
		name: nombre,
		buenas: 0
	}
	users.push(user);
	updateUsers();
	return user;
}


var updateUsers = function() {
	var str = '';
	for(var i=0; i<users.length; i++) {
		var user = users[i];
		str +='<li data-order='+user.buenas+'><div id="gcorrecta" data-order='+user.buenas+'>'+user.buenas+'</div><span class="nombredeusuario">'+ user.name +'</span><small>(' + user.buenas + ' respuestas correctas)</small></li>';
	}
	
	numerousuarios = users.length;
	
	console.log(users.length+"len");
	io.sockets.emit("users", { users: str });
	updatemayor('actualizarusuario');

	console.log(numerouserend+"numero de usuarios terminado en update");

}


var removeUser = function(user) {
	for(var i=0; i<users.length; i++) {
		if(user.name === users[i].name) {
			users.splice(i, 1);
			updateUsers();
			if(numerouserend==0){
				numerouserend = 0;
			}
			else{
				numerouserend -= 1;
			}
			
			updatemayor('removerusuario');
			return;
		}
	}
	console.log(numerouserend+"numero de usuarios terminado en remove");
}


