$(document).ready(function () {
    $('#carregando').hide();
    $('.windows8').hide();
    $('.carregado').show()

    $('.tel').mask('(00) 00000-0000');

    $.ajax({
        type: 'POST',
        url: '/carregar-meus-leads',
        data: {
            id: localStorage.getItem('promoter'),
            ordem: 'DESC',
        },
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',

    }).done(function (resposta) {
        //console.log(resposta.dados)

        resposta.dados.forEach(element => {
            var teste = element.telefone
            var teste2 = teste.split('')
            var telefone_mask = '(' + teste2[0] + teste2[1] + ')' + ' ' + teste2[2] + teste2[3] + teste2[4] + teste2[5] + teste2[6] + '-' + teste2[7] + teste2[8] + teste2[9] + teste2[10]


            var card =
                '<div class="card my-3">' +
                '<div class="card-body">' +
                '<div class="col-8 float-left">' +
                '<h5 class="card-title dado1">' + element.nome + '</h5>' +
                '<h6 class="card-subtitle mb-2 dado2">' + element.status + '</h6>' +
                '<p class="dado3">' + telefone_mask + '</p>' +
                '</div>' +
                '<div class="col-4 text-center float-left">' +
                '<a class="btn btn-claro-VCI text-white btn-block sms" onclick="sms(' + element.telefone + ',' + element.id + ')">SMS</a>' +
                '</div>' +
                '</div>'
            '</div>'
            $('#caixa').append(card)

        });
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


$('#voltar').on('click', function (e) {
    window.location.href = '/promoter-menu'
})


$('#filtrar').on('click', function (e) {
    e.preventDefault()


    if ($("#ordem").val() == '') {
        Swal.fire({
            icon: 'warning',
            text: 'Escolha uma forma de ordenação'
        })
    } else {
        document.getElementById("caixa").innerHTML = "";

        $.ajax({
            type: 'POST',
            url: '/carregar-meus-leads',
            data: {
                id: localStorage.getItem('promoter'),
                ordem: $("#ordem").val(),
            },
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded',

        }).done(function (resposta) {
            resposta.dados.forEach(element => {
                var teste = element.telefone
                var teste2 = teste.split('')
                var telefone_mask = '(' + teste2[0] + teste2[1] + ')' + ' ' + teste2[2] + teste2[3] + teste2[4] + teste2[5] + teste2[6] + '-' + teste2[7] + teste2[8] + teste2[9] + teste2[10]


                var card =
                    '<div class="card my-3">' +
                    '<div class="card-body">' +
                    '<div class="col-8 float-left">' +
                    '<h5 class="card-title dado1">' + element.nome + '</h5>' +
                    '<h6 class="card-subtitle mb-2 dado2">' + element.status + '</h6>' +
                    '<p class="dado3">' + telefone_mask + '</p>' +
                    '</div>' +
                    '<div class="col-4 text-center float-left">' +
                    '<a class="btn btn-claro-VCI text-white btn-block sms" onclick="sms(' + element.telefone + ',' + element.id + ')">SMS</a>' +
                    '</div>' +
                    '</div>'
                '</div>'
                $('#caixa').append(card)
            });
        })
    }
})


function sms(numero, id) {
    document.getElementsByClassName("sms").disabled = true;
    var codigo_lead = btoa(id)

    //Mensagem
    var mensagem = 'Acesse o link abaixo, complete seu cadastro. Viva uma grande experiencia com o Residence Club at the Hard Rock Hotel. http://lead.vcisa.com/lead/' + codigo_lead
    //FIM Mensagem

    //URL para envio de SMS
    var url_SMS = 'https://api-http.zenvia.com/GatewayIntegration/msgSms.do?dispatch=send&account=venture.smsonline&code=3Xyy5vhKh2&to=55' + numero + '&msg=' + mensagem
    //FIM URL para envio de SMS

    $.ajax({
        type: 'GET',
        url: url_SMS,
        beforeSend: function () {
            Swal.fire({
                title: 'Enviando...',
                text: 'Por favor aguarde',
                timerProgressBar: true,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            })
        },
    }).done(function (resposta) {
        if (resposta == '000 - Message Sent') {
            Swal.fire({
                icon: 'success',
                html: '<div class="col-sm-12 mb-3">Mensagem enviada com sucesso</div>',
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: 'Próximo',
            })
            document.getElementsByClassName("sms").disabled = true;
        } else {
            Swal.fire({
                icon: 'error',
                text: 'Número de celular incorreto ou incompleto',
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: 'Ok',
            })
        }
    })

}