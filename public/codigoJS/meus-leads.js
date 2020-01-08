$(document).ready(function () {
    $('#carregando').hide();
    $('.windows8').hide();
    $('.carregado').show()

    $.ajax({
        type: 'POST',
        url: '/carregar-meus-leads',
        data: {
            id: localStorage.getItem('promoter'),
        },
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',

    }).done(function (resposta) {
        console.log(resposta)
    })

});


$("#sair").on("click", function (e) {
    e.preventDefault();

    //REQUISIÇÃO
    $.ajax({
        type: 'POST',
        url: '/logout',
        data: {
            registro: localStorage.getItem('registro'),
            id_promoter: localStorage.getItem('id_promoter')
        },
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',

    }).done(function (resposta) {
        switch (resposta.status) {
            case 'Logout_OK':
                localStorage.clear();
                window.location.href = '/'
                break;

            case 'Logout_erro':
                Swal.fire({
                    icon: 'error',
                    text: 'Algo deu errado ao sair, tente novamente mais tarde...',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ok',
                })
                break;
        }
    });
    //FIM REQUISIÇÃO
})


$('#voltar').on('click', function(e){
    window.location.href = '/promoter-menu'
})