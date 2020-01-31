
$('document').ready(function () {
    $('#carregando').hide();
    $('.windows8').hide();
    $('.carregado').show();

    //var campo = document.getElementsByTagName('input')
    $(".campo_voucher").mask('0000 - 0000')
    $('#primeiro').focus()
})

$(".campo_voucher").on('input', function () {
    if (this.value.length == this.maxLength) {
        $('#confirmar').focus()
    }
})

$("#confirmar").on('click', function () {
    var codigo = $('.campo_voucher').val()
    var id = codigo.split('-')
    id = id[0].trim() + id[1].trim()


    $.ajax({
        type: 'GET',
        url: 'https://5625558.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=536&deploy=1&compid=5625558&h=423a4e1299e6856a2267',
        data: {
            'voucher_id': id,
        },
    }).done(function (resposta) {
        alert(resposta)
    })

})
/*
var cont = 0
$(".campo_voucher").on('input', function () {
    if (this.value.length == this.maxLength) {
        cont += 1
        $(this).next('.campo_voucher').focus();
    }

    if (cont == 4) {
        $(this).next('.campo_voucher').val('-');
        $(this).next('.campo_voucher').next('.campo_voucher').focus();
    }
    if (cont == 8) {
        $('#confirmar').focus()
    }
});
*/