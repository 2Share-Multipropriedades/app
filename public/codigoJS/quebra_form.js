$('document').ready(function () {
    $('#parte1').show();
    $('#parte2').hide();
    $('#parte3').hide();
    $('#parte4').hide();
})

$('#proximo1').on('click', function (e) {
    e.preventDefault()
    $('#parte1').hide();
    $('#parte2').show();
    $('#parte3').hide();
    $('#parte4').hide();

    verificar_cidade($('#telefone').val())
})

$('#proximo2').on('click', function (e) {
    e.preventDefault()

    $('#parte1').hide();
    $('#parte2').hide();
    $('#parte3').show();
    $('#parte4').hide();
})

$('#proximo3').on('click', function (e) {
    e.preventDefault()
    if(!editar_endereco($('#estado').val(), $('#cidade').val())){
        Swal.fire({
            icon: 'warning',
            text: 'Preencha o estado e a cidade',
            allowOutsideClick: false,
            allowEscapeKey: false,
        })
    }else{
        $('#parte1').hide();
        $('#parte2').show();
        $('#parte3').hide();
        $('#parte4').hide();
    }
})

$('#anterior2').on('click', function (e) {
    e.preventDefault()

    $('#parte2').hide();
    $('#parte1').show();
    $('#parte3').hide();
    $('#parte4').hide();
})

$('#anterior3').on('click', function (e) {
    e.preventDefault()

    $('#parte3').hide();
    $('#parte1').hide();
    $('#parte2').show();
    $('#parte4').hide();
})

$('#anterior4').on('click', function (e) {
    e.preventDefault()

    $('#parte3').hide();
    $('#parte1').show();
    $('#parte2').hide();
    $('#parte4').hide();
})

function verificar_cidade(telefone) {
    var id = window.location.href;
    id = id.split('/')
    id = atob(id[4])

    var ddd = telefone.substr(0, 2)

    var cidade = ''
    var estado = ''

    switch ($('#ID-TIME-VENDAS').val()) {
        case '5786':
            cidade = 'São Paulo'
            estado = 'SP'
            break;
        case '10064':
            cidade = 'Londrina'
            estado = 'PR'
            break;
        case '10070':
            cidade = 'Fortaleza'
            estado = 'CE'
            break;

    }

    if ((ddd !== 11) || (ddd !== 43) || (ddd !== 85)) {

        if ($('#estado').val() == '') {
            Swal.fire({
                icon: 'info',
                html: 'Você mora em  <strong>' + cidade + '</strong> ?',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                cancelButtonColor: '#ea4335',
                reverseButtons: true,
            }).then((result) => {
                if (result.value) {
                    $('#estado').val(estado)
                    $('#cidade').val(cidade)
                    $.ajax({
                        type: 'POST',
                        url: '/lead/editar',
                        data: {
                            id: id,
                            cidade: cidade,
                            estado: estado
                        },
                        dataType: 'json',
                        contentType: 'application/x-www-form-urlencoded',
                    }).done(function (resposta) {
                        if (resposta.status == 'error') {
                            Swal.fire({
                                icon: 'error',
                                title: 'Ops...',
                                text: 'Algo deu errado, recarregue a pagina e tente novamente',
                            })
                        }
                    })
                } else {
                    $('#parte2').hide();
                    $('#parte4').show();
                }
            })
        } else {
            $('#parte2').hide();
            $('#parte4').show();
        }
    }
}

function editar_endereco(estado, cidade) {
    var id = window.location.href;
    id = id.split('/')
    id = atob(id[4])

    if (($('#estado').val() == '') || ($('#cidade').val() == '')) {
        return false
    } else {
        $.ajax({
            type: 'POST',
            url: '/lead/editar',
            data: {
                id: id,
                cidade: cidade,
                estado: estado
            },
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded',
        }).done(function (resposta) {
            if (resposta.status == 'error') {
                Swal.fire({
                    icon: 'error',
                    title: 'Ops...',
                    text: 'Algo deu errado, recarregue a pagina e tente novamente',
                })
            }
        })
        return true
    }

}