$('document').ready(function () {

    $('#carregando').hide();
    $('.windows8').hide();
    $('.carregado').show();

    //Aplicação de Máscaras
    $('#celular').mask('(99) 99999-9999');
    //FIM Aplicação de Máscaras

    //Função que carrega os estados cadastrados no banco
    carregar_estados();
    //FIM Função que carrega os estados cadastrados no banco
})


$("#login").on("click", function (e) {
    e.preventDefault();

    var email = $('#email').val();
    var senha = $('#senha').val();
    var parceiro = $('#parceiro').val();
    var token;

    //REQUISIÇÃO
    $.ajax({
        type: 'POST',
        url: '/gerar_token',
        data: {
            'email': email,
        },
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',

    }).done(function (resposta) {
        //localStorage.clear()
        switch (resposta.status) {
            case 'Email_Incorreto':
                Swal.fire({
                    icon: 'warning',
                    text: 'Email incorreto, tente novamente...',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ok',
                })
                break

            case 'Erro_Token':
                Swal.fire({
                    icon: 'error',
                    title: 'Erro no acesso',
                    text: 'Algo deu errado no processo de autenticação, tente novamente...',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ok',
                    preConfirm: (confirmButtonText) => {
                        window.location.href = "/";
                    },
                })
                break;

            case 'Token_OK':
                //Requisição de login
                token = resposta.token
                $.ajax({
                    type: 'POST',
                    url: '/login',
                    data: {
                        'email': email,
                        'senha': senha,
                    },
                    dataType: 'json',
                    contentType: 'application/x-www-form-urlencoded',
                }).done(function (resposta) {
                    switch (resposta.status) {
                        case 'Erro_Senha':
                            Swal.fire({
                                icon: 'warning',
                                title: 'Erro no acesso',
                                text: 'Senha incorreta, tente novamente...',
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                confirmButtonText: 'Ok',
                                preConfirm: (confirmButtonText) => {
                                    window.location.href = "/";
                                },
                            })
                            break;
                        case 'Login_OK':
                            //Requisição parar fazer o registro
                            $.ajax({
                                type: 'POST',
                                url: '/registro',
                                data: {
                                    'id_promoter': resposta.id,
                                    'id_parceiro': parceiro,
                                    'token': token,
                                    'crm': resposta.crm,
                                    'nome_promoter': resposta.nome_promoter
                                },
                                dataType: 'json',
                                contentType: 'application/x-www-form-urlencoded',
                            }).done(function (resposta) {
                                switch (resposta.status) {
                                    case 'Erro_Registro':
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Erro no acesso',
                                            text: 'Algo deu errado no processo de registro, tente novamente...',
                                            allowOutsideClick: false,
                                            allowEscapeKey: false,
                                            confirmButtonText: 'Ok',
                                            preConfirm: (confirmButtonText) => {
                                                window.location.href = "/";
                                            },
                                        })
                                        break;

                                    case 'Registro_OK':
                                        localStorage.setItem('parceiro', resposta.id_parceiro);
                                        localStorage.setItem('promoter', resposta.id_promoter);
                                        localStorage.setItem('registro', resposta.registro);
                                        localStorage.setItem('crm', resposta.crm);
                                        localStorage.setItem('nome_promoter', resposta.nome_promoter);
                                        window.location.href = '/promoter-menu'
                                        break;
                                }
                            })
                            break;

                    }
                })
                break;
        }
    });
    //FIM REQUISIÇÃO
})


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


$("#enviar_SMS").on("click", function (e) {
    e.preventDefault();















    var nome = $('#nome').val();
    var telefone = $('#celular').val();

    if (nome == "" || telefone == "") {
        Swal.fire({
            icon: 'error',
            text: 'Nenhum campo pode ficar vazio',
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Ok',
        })
    } else {
        var numero = telefone.substr(1, 2) + telefone.substr(5, 5) + telefone.substr(11, 4);
        if (!validar_numero_celular(numero)) {
            Swal.fire({
                icon: 'warning',
                text: 'Preencha o número de celular adequadamente'
            })
        } else {
            document.getElementById("enviar_SMS").disabled = true;

            $.ajax({
                type: 'POST',
                url: '/salvar-lead',
                data: {
                    id_parceiro: localStorage.getItem('parceiro'),
                    id_promoter: localStorage.getItem('promoter'),
                    promoter_crm: localStorage.getItem('crm'),
                    nome: nome,
                    numero_celular: numero,
                    nome_promoter: localStorage.getItem('nome_promoter'),
                },
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded',

            }).done(function (resposta) {
                switch (resposta.status) {
                    case 'Erro_Lead':
                        Swal.fire({
                            icon: 'error',
                            text: 'Algo deu errado ao salvar o Lead, tente novamente mais tarde...',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            confirmButtonText: 'Ok',
                        })
                        break;

                    case 'Lead_OK':
                        var codigo_lead = btoa(resposta.id_lead)
                        localStorage.setItem('id_lead', codigo_lead)

                        if ($('#decisao').val() == 'preencher') {
                            window.location.href = '/lead/' + codigo_lead
                        } else {
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
                                        html: '<div class="col-sm-12 mb-3">Mensagem enviada com sucesso</div>' +
                                            '<div class="col-sm-12" id="qrcode"></div>',// +
                                        //'<a class="mt-3 btn btn-block btn-success2" href="https://api.whatsapp.com/send?phone=55' + numero + '&amp;text=Ol%C3%A1%20' + nome + ',,%20acesse%20o%20link%20abaixo,%20complete%20seu%20cadastro.%20Viva%20uma%20grande%20experiencia%20com%20o%20Residence%20Club%20at%20the%20Hard%20Rock%20Hotel.%0D%0D%20%20http://lead.vcisa.com/lead/' + localStorage.getItem('id_lead') + '"><img id="whats" src="../../imagens/icon_whatsapp.png" alt=""></a>',
                                        allowOutsideClick: false,
                                        allowEscapeKey: false,
                                        confirmButtonText: 'Próximo',
                                    })
                                    gerar_qrcode(localStorage.getItem('id_lead'))
                                    $('#nome').val('');
                                    $('#celular').val('');
                                    document.getElementById("enviar_SMS").disabled = false;
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
                        break;
                }
            })
        }
    }
})


function gerar_qrcode(id) {
    new QRCode(document.getElementById("qrcode"), {
        text: "http://lead.vcisa.com/lead/" + id,
        width: 150,
        height: 150,
    })
}


function carregar_estados() {
    //var id_estado = $('#estado').val();
    $.ajax({
        type: 'GET',
        url: '/carregar_estados',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',

    }).done(function (resposta) {
        $(resposta.estados).each(function (index, element) {
            $('<option>').val(element.id).text(element.estado).appendTo($('#estado'));
        });
    })
}


function carregar_cidades() {
    var id_estado = $('#estado').val();

    $('#cidade').val("").text("");
    $('<option>').val("").text("Selecione").appendTo('#cidade');

    $.ajax({
        type: 'GET',
        url: '/carregar_cidades',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',

    }).done(function (resposta) {
        $(resposta.cidades).each(function (index, element) {
            // de acordo com o id do estado do select 
            if (id_estado == element.id_estado) {
                $('<option>').val(element.id).text(element.cidade).appendTo($('#cidade'));
            }
        });
    })
}


function carregar_paceiros() {
    var id_estado = $('#estado').val();
    var id_cidade = $('#cidade').val();

    $('#parceiro').val("").text("");
    $('<option>').val("").text("Selecione").appendTo('#parceiro');

    $.ajax({
        type: 'GET',
        url: '/carregar_parceiros',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',

    }).done(function (resposta) {
        $(resposta.parceiros).each(function (index, element) {
            // de acordo com o id do estado e da cidade do select 
            if ((id_estado == element.id_estado) && (id_cidade == element.id_cidade)) {
                $('<option>').val(element.id).text(element.nome).appendTo($('#parceiro'));
            }
        });
    })
}


function validar_numero_celular(numero) {
    if (numero.length == 11) {
        return true
    } else {
        return false
    }
}
