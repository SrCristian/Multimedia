var reproduce;

function loadPage(){    
    montarLista();
    reproduce = reproducciones[0];
    addEvento();
    $('#titulo').text(reproduce.titulo);
    $('#0').css({"background": "darkblue",
                    "color": "white"});
    $('#0 .ejecutado').show();
    reproducirVideo();
    tiempo();
}

function montarLista(){
    for(var aux = 0 ; aux < reproducciones.length; aux++){
        var reproduccion = document.createElement('div');
        reproduccion.setAttribute("id",  aux);
        reproduccion.setAttribute("class",  'seleccion');
        reproduccion.setAttribute("onclick",  'reproducir('+aux+')');
        reproduccion.setAttribute("tabindex", 0);

        var title = document.createElement('h3');
        title.appendChild(document.createTextNode(reproducciones[aux].titulo));
        reproduccion.appendChild(title);

        var div = document.createElement('div');
        div.setAttribute("class",  'datos');

        var tiempo = document.createElement('p');
        tiempo.appendChild(document.createTextNode(reproducciones[aux].duracion));
        div.appendChild(tiempo);

        var svgns = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(svgns,'svg');
        svg.setAttributeNS(null,"class",  'ejecutado');
        svg.setAttributeNS(null,"viewBox",  '0 0 100 100');
        svg.setAttributeNS(null,"version",  '1.1');

        var path = document.createElementNS(svgns,'path');
        path.setAttributeNS(null,"d",  'M5 0 L100 50 L5 95 Z');
        svg.appendChild(path);
        div.appendChild(svg);

        reproduccion.appendChild(div);

        document.getElementsByClassName('izquierda')[0].appendChild(reproduccion);
        
    }
}

function addEvento(){
        $( document ).ready(function() {
            for(var aux = 0 ; aux < reproducciones.length; aux++){
                $("#"+aux).click(function() {
                    reproducir(this.id);
                });
            }
            $("#play").click(function() {
                play();
            });   
            $("#pausa").click(function() {
                pausa();
            });
            $("#adelantar").click(function() {
                adelantar();
            });
            $("#volumen").click(function() {
                silencio();
            });
            $("#silencio").click(function() {
                quitarSilencio();
            });
            $("#subir").click(function() {
                subir();
            });
            $("#bajar").click(function() {
                bajar();
            });
            document.getElementById("video").onended = function() {
                siguiente();
            };
            document.getElementById("audio").onended = function() {
                siguiente();
            };
        });
}

function subir(){
    if(document.getElementById(reproduce.tipo).volume < 1){
        document.getElementById(reproduce.tipo).volume += 0.1;
        quitarSilencio();
    }
}

function bajar(){
    if(document.getElementById(reproduce.tipo).volume > 0.1){
        document.getElementById(reproduce.tipo).volume -= 0.1;
    }else{
        silencio();
    }
}

function play(){
    document.getElementById(reproduce.tipo).play();
    $('#play').hide();
    $('#pausa').show();
}

function pausa(){
    document.getElementById(reproduce.tipo).pause();
    $('#pausa').hide();
    $('#play').show();
}

function adelantar(){
    var multimedia = document.getElementById(reproduce.tipo);
    var adelantar = multimedia.currentTime + 10;
    if(multimedia.duration <= multimedia.currentTime){
        adelantar = multimedia.duration;
    }
    multimedia.currentTime = adelantar;
    mostrarTiempo();
}

function silencio(){
    $('#volumen').hide();
    $('#silencio').show();
    document.getElementById(reproduce.tipo).muted = true;
}

function quitarSilencio(){
    $('#silencio').hide();
    $('#volumen').show();
    document.getElementById(reproduce.tipo).muted = false;
}

function reproducir(id){
    $('.seleccion').css({"background": "lightblue",
                    "color": "black"});
    $('#'+id).css({"background": "darkblue",
                    "color": "white"});
    $('.ejecutado').hide();
    $('#'+id+' .ejecutado').show();
    reproduce = reproducciones[id];
    $('#titulo').text(reproduce.titulo);
    if(reproduce.tipo == 'video'){
        $('#subtitulo').show();
        reproducirVideo();
    }else{
        $('#subtitulo').hide();
        reproducirAudio();
    }
    quitarSilencio();
}

function reproducirVideo(){
    document.getElementById("audio").pause();
    $('#imagenAudio').hide();
    $('#audio').hide();
    $('#video').show();
    document.getElementById("mp4_src").src = reproduce.mp4_src;
    document.getElementById("ogg_src").src = reproduce.ogg_src;
    document.getElementById("webm_src").src = reproduce.webm_src;
    document.getElementById('trackSub').src = reproduce.subtitulo;
    //document.getElementById('trackSub').default = true;
    document.getElementById("video").load();
    document.getElementById("video").play();
    mostrarSub();
}

function mostrarSub(){
    var videoElement = document.querySelector("video");
    var textTracks = videoElement.textTracks;
    var textTrack = textTracks[0];
    textTrack.mode = 'showing';
}

function reproducirAudio(){
    document.getElementById("video").pause();
    $('#video').hide();
    $('#imagenAudio').show();
    $('#audio').show();
    document.getElementById("imagenAudio").style.backgroundImage = 'url('+reproduce.imagen+')';
    document.getElementById("mp3_src").src = reproduce.audio;
    document.getElementById("audio").load();
    document.getElementById("audio").play();
}

function siguiente(){
    var id = 0;
    for(var aux = 0 ; aux < reproducciones.length; aux++){        
        if(reproducciones[aux] == reproduce){
            if(aux+1 != reproducciones.length){
                id = aux + 1;
            }
        }
    }
    reproducir(id);
    mostrarTiempo();
}

function tiempo(){
    setInterval(function(){
        mostrarTiempo();
    },1000);
}

function mostrarTiempo(){
    var multimedia = document.getElementById(reproduce.tipo);
        var min = parseInt(multimedia.currentTime/60);
        var seg = parseInt(multimedia.currentTime - (60 * min));        
        $('#tiempo').text(min+' : '+seg+' / '+reproduce.duracion);
}