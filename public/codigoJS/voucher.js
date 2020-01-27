
$('document').ready(function () {
    $('#carregando').hide();
    $('.windows8').hide();
    $('.carregado').show();

    //var campo = document.getElementsByTagName('input')
    $(".campo_voucher").mask('0')
    $('#primeiro').focus()
})

var cont = 0
$(".campo_voucher").on('input', function () {
    if (this.value.length == this.maxLength) {
        cont += 1
        $(this).next('.campo_voucher').focus();
    }

    if (cont == 3) {
        $(this).next('.campo_voucher').val('-');
        $(this).next('.campo_voucher').next('.campo_voucher').focus();
    }
    if (cont == 6) {
        $('#confirmar').focus()
    }
});