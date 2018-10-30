var url="https://swapi.co/api/people/1/?callback=";
var personagem;
$.getJSON(url, function( dados ) {
})
.done(function(dados){
    console.log(dados);
    console.log(dados.name);
});