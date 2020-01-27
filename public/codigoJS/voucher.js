
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