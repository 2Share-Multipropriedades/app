$('document').ready(function(){
    $('#parte2').hide();
    $('#parte3').hide();
    $('#parte4').hide();
})

$('#proximo1').on('click', function(e){
    e.preventDefault()
    $('#parte1').hide();
    $('#parte2').show();
    $('#parte3').hide();
    $('#parte4').hide();
})

$('#proximo2').on('click', function(e){
    e.preventDefault()
    
    $('#parte1').hide();
    $('#parte2').hide();
    $('#parte3').show();
    $('#parte4').hide();
})

$('#proximo3').on('click', function(e){
    e.preventDefault()
    
    $('#parte1').hide();
    $('#parte2').hide();
    $('#parte3').hide();
    $('#parte4').show();
})

$('#anterior2').on('click', function(e){
    e.preventDefault()
    
    $('#parte2').hide();
    $('#parte1').show();
    $('#parte3').hide();
    $('#parte4').hide();
})

$('#anterior3').on('click', function(e){
    e.preventDefault()
    
    $('#parte3').hide();
    $('#parte1').hide();
    $('#parte2').show();
    $('#parte4').hide();
})