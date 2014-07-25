			navigator.vibrate = navigator.vibrate ||
      		 navigator.webkitVibrate ||
      		 navigator.mozVibrate ||
      		 navigator.msVibrate;

			var websocket = io.connect("http://72.14.184.91:6969");

			var number = 0;
			var buenas = 0;
			var jugadoresterminaron = 0;
			//var url = self.location.href.match( /\/([^/]+)$/)[1];
			//var urlNum = url.length;
			
	    	
			function mostrarnombre (nombre){
				$(".nombredel").append(nombre);
				websocket.emit("jugador", nombre);
			}


			function preguntasvis() {
				if ($(".pregunta").is(":visible")) {
				console.log("no pasa nada");
				}
				else{
					console.log("se acabaron las preguntas");
					$("#allpreguntas").html("<span>Esperando que terminen todos los jugadores</span>");

					jugadoresterminaron += 1;
					websocket.emit("conteofin", jugadoresterminaron);
				}
			}
			


	    	$(document).on('touchstart click', '.continuar', function(){ 
		    	$(this).parent().parent().hide();
	    	 });
	    	
	    	
	    	function recorrerp(){
	    		$(".pregunta").each(function(index){
	    			if(index==0){
	    				$(this).show();
	    			}
	    		});
	    	}

	    	function recorreselect(idEnviar,elementos,padre) {
		    	
		    		 var solucion = $("#"+padre+"  option:selected").val();
		    		 var className = $("#"+padre+" option:selected").attr('class');
		    		 var idElemento =$("#"+padre+"  option:selected").attr('id');
		    		

		    		 if(padre.length == 8){
			    		 var number = padre.substr(6,2);
		    		 }
		    		 else{
			    		 var number = padre.substr(6,1);
		    		 }
		    		 
		    		 validacion(solucion,number,idEnviar,elementos);
	    		
			}
	    	
	    	function validacion(solucion,number,idEnviar,elementos) {
		    	 $.getJSON("ans/"+idEnviar+".json",function(data){ 
		    			var respuesta;
		    				    			
		    			$.each(data.ans,function(index){
		    				if(this.pre==number){
		    					var respuesta = this.res;
		    					comprobar(respuesta);
		    				}
		    			});
		    			
		    			function comprobar(r) {
			    			preguntasvis();
			    			console.log(r);
			    			if(solucion==r){
				    			console.log("respuesta correcta");
				    			websocket.emit("respuesta");
				    			if(buenas==elementos){
					    			console.log("todas son buenas");
					    		}
				    			else{
					    			console.log("esfuerzate un poco, alguna respuesta es erronea");
					    			$("#error").css("display","block");
				    			}
			    			}
			    			else{
				    			console.log("respuesta erronea");
				    		}
			    		}
		    			
	        	 });
		    }

		    websocket.on('users', function (data) {
			 	 console.log(data);
			  	 $("#mostrar").html("<span class='posi'>Tabla de posiciones:</span><br /><ol class='boxes-list'>" + data.users +'</ol>');
			  	 actualizarli();
			  	 document.getElementById('updatessound').play();
			  	 navigator.vibrate(1000);
			});

			websocket.on('win', function (data) {
					$("#allpreguntas").html(data.message);
					$("#allpreguntas").append("<img src='img/gana.png'>");
					
			});

			websocket.on('ganador', function (data) {
					$("#allpreguntas").html("<span class='gana'>" + data + "</strong> rocks!");
					$("#allpreguntas").append("<img src='img/gana.png'>");
					 setTimeout(function () {
       					window.location.href = "index.html"; 
    				}, 4000); //will call the function after 2 secs.

					
			});

		   
		    /*
		    websocket.on('respuestascor', function (data) {
			    console.log(data.numerobuena);

			 	var $Ul = $('ol.boxes-list');
			 	var altool = $Ul.height()+ 13;

				$Ul.css({position:'relative',height:$Ul.height(),display:'block'});
				var iLnH;
				var $Li = $('ol.boxes-list>li');
				$Li.each(function(i,el){
					var iY = $(el).position().top;
					$.data(el,'h',iY);
					if (i===1) iLnH = iY;
				});
				$Li.tsort('#gcorrecta',{order:'desc'}).each(function(i,el){
					var $El = $(el);
					var iFr = $.data(el,'h')+13;
					var iTo = (i*iLnH) + (13*i);
					$El.css({position:'absolute',top:iFr}).animate({top:iTo},500);
				});



			 	 //$('.boxes-list>li').tsort('#gcorrecta',{order:'desc'});


			});
			*/




			function actualizarli(){
				var $Ul = $('ol.boxes-list');
			 	var altool = $Ul.height()+ 13;

				$Ul.css({position:'relative',height:$Ul.height(),display:'block'});
				var iLnH;
				var $Li = $('ol.boxes-list>li');
				$Li.each(function(i,el){
					var iY = $(el).position().top;
					$.data(el,'h',iY);
					if (i===1) iLnH = iY;
				});
				$Li.tsort('#gcorrecta',{order:'desc'}).each(function(i,el){
					var $El = $(el);
					var iFr = $.data(el,'h')+13;
					var iTo = (i*iLnH) + (13*i);
					$El.css({position:'absolute',top:iFr}).animate({top:iTo},500);
				});
			}
	    	
