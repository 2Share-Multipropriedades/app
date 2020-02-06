
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
        type: 'POST',
        url: '/netsuit/ativar',
        data: {
            voucher_id: id
        },
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',

    }).done(function (resposta) {
        console.log(resposta)
        alert(resposta.dados.message)
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