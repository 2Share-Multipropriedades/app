$('document').ready(function () {

    $('#carregando').hide();
    $('.windows8').hide();
    //$('.carregado').show();

    //Macara CPF
    $('#field-cpf').mask('000.000.000-00');
    //FIM Macara CPF

    //Procura o Lead
    trazer_lead();
    //FIM Procura o Lead

    setTimeout(function () {
        $('#splash').modal('hide');
        $('.carregado').show();
    }, 3000); // 3000 = 3 segundos

})

function trazer_lead() {
    var url01 = window.location.href;
    var url02 = url01.split('/');
    var url03 = url02[4];
    console.log(url03)
    if (url03 == '') {
        Swal.fire({
            icon: 'error',
            text: 'Seu link esta sem o código',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false
        })
    } else {
        try {
            var codigo = atob(url03)
            console.log(url03)
            console.log(codigo)
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Desculpe, algo deu errado e não consegui te indentificar, verifique a URL fornecida novamente.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false
            })
        }

        $.ajax({
            type: 'POST',
            url: '/carregar_lead',
            data: {
                codigo: codigo
            },
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded',

        }).done(function (resposta) {

            switch (resposta.status) {
                case 'Erro_Lead':
                    Swal.fire({
                        icon: 'error',
                        text: 'Desculpe, algo deu errado e não consegui te indentificar, verifique a URL fornecida novamente.',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showConfirmButton: false
                    })
                    break;

                case 'Lead_ERROR':
                    Swal.fire({
                        icon: 'error',
                        text: 'Esse código ja foi usado',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showConfirmButton: false
                    })
                    break;

                case 'Lead_OK':
                    $('#splash').modal('show')
                    $('#field-nome').val(resposta.nome);
                    $('#telefone').val(resposta.celular);
                    $('#ID-CRM-PROMOTORA').val(resposta.promoter_crm);
                    $('#NOME_PROMOTORA').val(resposta.promoter_nome);


                    $.ajax({
                        type: 'POST',
                        url: '/carregar_lead/parceiro',
                        data: {
                            id_parceiro: resposta.id_parceiro
                        },
                        dataType: 'json',
                        contentType: 'application/x-www-form-urlencoded',

                    }).done(function (resposta) {
                        $('#NOME-DO-PARCEIRO').val(resposta.nome);

                        switch (resposta.estado) {
                            case 2:
                                $('#ID-TIME-VENDAS').val('5786');
                                break;
                            case 3:
                                $('#ID-TIME-VENDAS').val('10070');
                                break;
                            case 4:
                                $('#ID-TIME-VENDAS').val('10064');
                                break;

                        }
                        $('.windows8').hide();
                        $('#carregando').hide();
                        //$('.carregado').show();
                    })

                    break;

            }
        })
    }

}



$("#cadastrar_lead").on("click", function (e) {
    e.preventDefault();

    if (!validar_campos()) {
        Swal.fire({
            icon: 'warning',
            text: 'Nenhum campo pode ficar vazio'
        })
    } else {
        if ($("#confirmo").is(':checked')) {

            $.ajax({
                type: 'POST',
                url: 'https://2share.bitrix24.com.br/rest/58/4icdwfadz1vow6hv/crm.contact.add',
                data: {
                    'fields[TYPE_ID]': 'CLIENT',
                    'fields[SOURCE_ID]': '5',
                    'fields[NAME]': $('#field-nome').val(),
                    'fields[LAST_NAME]': '',
                    'fields[PHONE][0][VALUE]': $('#telefone').val(),
                    'fields[PHONE][0][VALUE_TYPE]': 'OTHER',
                    'fields[PHONE][0][TYPE_ID]': 'PHONE',
                    'fields[EMAIL][0][VALUE]': $('#field-email').val(),
                    'fields[EMAIL][0][VALUE_TYPE]': 'OTHER',
                    'fields[EMAIL][0][TYPE_ID]': 'EMAIL',
                    'fields[UF_CRM_1561136312]': $('#field-cpf').val()
                },
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded',

            }).done(function (resposta) {

                $.ajax({
                    url: 'https://2share.bitrix24.com.br/rest/58/4icdwfadz1vow6hv/crm.deal.add',
                    type: 'POST',
                    beforeSend: function () {
                        Swal.fire({
                            title: 'Cadastrando...',
                            text: 'Por favor aguarde',
                            timerProgressBar: true,
                            onBeforeOpen: () => {
                                Swal.showLoading()
                            }
                        })
                    },
                    data: {
                        'fields[CONTACT_ID]': resposta.result,
                        'fields[TITLE]': $('#field-nome').val(),
                        'fields[UF_CRM_1559237906]': $('#ID-TIME-VENDAS').val(),
                        'fields[UF_CRM_1559221906859]': $('#NOME-DO-PARCEIRO').val(),
                        'fields[UF_CRM_1575626649]': $('#ID-CRM-PROMOTORA').val(),
                        'fields[UF_CRM_1559238324]': $('#field-nome').val(),

                        'fields[UF_CRM_1559222048236]': $('#NOME_PROMOTORA').val(), //nome da promotora

                        'fields[LAST_NAME]': 'xxx',
                        'fields[UF_CRM_5D0D23AC4DE21]': $('#field-cpf').val(),
                        'fields[UF_CRM_1559238354]': $('#field-idade').val(),
                        'fields[UF_CRM_1559572368]': $('#field-profissao').val(),
                        'fields[UF_CRM_5CEFC4776D26B]': $('#field-estado-civil').val(),
                        'fields[UF_CRM_5CEFC4777B306]': $('#field-renda').val(),
                        'fields[UF_CRM_1559221860983]': $('#field-ultima-viagem').val(),
                        'fields[UF_CRM_1577122100]': $('#field-ano_ultima_viagem').val(),
                        'fields[UF_CRM_1577121920]': $('#field-viagem-dos-sonhos').val(),
                        'fields[SOURCE_ID]': '6',
                        'fields[CATEGORY_ID]': '12',
                        'fields[OPPORTUNITY]': 65000,
                    }
                }).done(function (resposta) {
                    var url01 = window.location.href;
                    var url02 = url01.split('/');
                    var url03 = url02[4];
                    var codigo = atob(url03)

                    $.ajax({
                        url: '/lead/confirmar-cadastro',
                        type: 'POST',
                        data: {
                            id: codigo
                        },
                        dataType: 'json',
                        contentType: 'application/x-www-form-urlencoded',

                    }).done(function (resposta) {
                        if (resposta.status == 'ok') {
                            window.location.href = '\\agradecimento\\positivo'
                        }
                    })

                })
            })
        } else {
            Swal.fire({
                icon: 'warning',
                text: 'Para concluir o seu cadastro, você precisa concordar com os termos da promoção.',
            })
        }
    }
})



$("#termo_compromisso").on("click", function (e) {
    e.preventDefault();

    //$(".swal-8-backdrop-show").addClass(".scroll");
    //document.getElementsByClassName("swal-18-backdrop-show").style.overflow = 'scroll';
    Swal.fire({
        title: 'Termos da promoção',
        showConfirmButton: false,
        showCloseButton: true,
        html:
            '<div class="text-left">' +
            '<strong>1.</strong> Para participar, preencha todos os campos.O preenchimento é voluntário.<br><br>' +

            '<strong>2.</strong> Venha ao nosso evento com a disponibilidade mínima de 60 minutos e ganhe 2 prêmios ao final da participação.<br><br>' +

            '&nbsp;&nbsp;&nbsp;<strong>Prêmio 1 –</strong> Voucher de consumação mínimo de R$ 50, 00, válido por 7 dias, para ser consumido em um dos estabelecimentos indicados.<br><br>' +

            '&nbsp;&nbsp;&nbsp;<strong>Prêmio 2 –</strong> Certificado Promocional de Hospedagem, cujos demais custos(como aéreo, alimentação, taxas adicionais e etc.) não estão inclusos. Verifique as opções disponíveis na data da participação.<br><br>' +

            '<strong>3.</strong> Os prêmios são entregues independentemente de associação ou aquisição dos nossos produtos.<br><br>' +

            '<strong>4.</strong> Os prêmios não poderão ser usados em conjunto com qualquer outra promoção e são nominais, intransferíveis, válidos por uma única vez e não podem ser trocados por dinheiro.<br><br>' +

            '<strong>5.</strong> O estabelecimento parceiro onde é preenchido o cupom não possui nenhum veículo ou responsabilidade com a promoção.<br><br>' +

            '<strong>6.</strong> Para mais informações, entre em contato pelo telefone <strong>4020 - 0085</strong> ou pelo e - mail <strong>atendimento@vcisa.com</strong>' +

            '</div>'
    })
})


function validar_email() {
    var email = $('#field-email').val();

    usuario = email.substring(0, email.indexOf("@"));
    dominio = email.substring(email.indexOf("@") + 1, email.length);
    if ((usuario.length >= 1) &&
        (dominio.length >= 3) &&
        (usuario.search("@") == -1) &&
        (dominio.search("@") == -1) &&
        (usuario.search(" ") == -1) &&
        (dominio.search(" ") == -1) &&
        (dominio.search(".") != -1) &&
        (dominio.search(".com") != -1) &&
        (dominio.indexOf(".") >= 1) &&
        (dominio.lastIndexOf(".") < dominio.length - 1)) {

    }
    else {
        Swal.fire({
            icon: 'error',
            text: 'E-mail inválido',
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Ok',
        })
    }
}



function validar_cpf() {

    if ($('#field-cpf').val() == '') {
        Swal.fire({
            icon: 'warning',
            text: 'Preencha O CPF'
        })
    } else {
        var split1 = $('#field-cpf').val().split('.');
        var split2 = split1[2].split('-');

        var CPF = split1[0] + split1[1] + split2[0] + split2[1];

        if (!VerifyCPF(CPF)) {
            Swal.fire({
                icon: 'error',
                text: 'CPF inválido'
            })
        }
    }

}



function validar_campos() {
    //pegar dados dos inputs
    var nome = $('#field-nome').val();
    //var cpf = $('#field-cpf').val();
    var email = $('#field-email').val();
    var idade = $('#field-idade').val();
    var profissao = $('#field-profissao').val();
    var estado_civil = $('#field-estado_civil').val();
    //var renda = $('#field-renda').val();
    var ultima_viagem = $('#field-ultima_viagem').val();
    var ano_ultima_viagem = $('#field-ano_ultima_viagem').val();
    var viagem_dos_sonhos = $('#field-viagem_dos_sonhos').val();
    //field-nome
    //field-cpf
    //field-email
    //field-idade
    //field-profissao
    //field-estado-civil
    //field-renda
    //field-ultima-viagem
    //field-ano_ultima_viagem
    //field-viagem-dos-sonhos
    if (
        (nome == '') ||
        //(cpf == '') ||
        (email == '') ||
        (idade == '') ||
        (profissao == '') ||
        (estado_civil == '') ||
        //(renda == '') ||
        (ultima_viagem == '') ||
        (ano_ultima_viagem == '') ||
        (viagem_dos_sonhos == '')
    ) {
        return false
    } else {
        return true
    }
}



function VerifyCPF(CPF) {

    var DV1 = CalculateDigit1(CPF), DV2 = CalculateDigit2(CPF);

    if (DV1 == CPF[9] && DV2 == CPF[10]) {
        return true;
    } else {
        return false;
    }

}



function CalculateDigit1(CPF) {
    var Weight = [10, 9, 8, 7, 6, 5, 4, 3, 2];

    var Sum = 0;

    for (let index = 0; index < 9; index++) {

        Sum += (Weight[index] * Number(CPF[index]));

    }

    var Rest = Sum % 11;

    if (Rest < 2) {

        return 0;

    } else {

        return 11 - Rest;

    }

}



function CalculateDigit2(CPF) {
    var Weight = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

    var Sum = 0;

    for (let index = 0; index < 10; index++) {

        Sum += (Weight[index] * Number(CPF[index]));

    }

    var Rest = Sum % 11;

    if (Rest < 2) {

        return 0;

    } else {

        return 11 - Rest;

    }

}



function aparecer_form() {
    $('.carregado').show();
}