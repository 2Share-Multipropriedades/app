$('document').ready(function () {
    $('#carregando').hide();
    $('.windows8').hide();
    $('.carregado').show();

    var popstate = history.pushState(null, null, document.URL);
    window.addEventListener(popstate, function () {
        history.pushState(null, null, document.URL);
    });

})