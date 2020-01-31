//import { image } from "qr-image";

var dados = ''
ler()

function ler() {
    let scanner = new Instascan.Scanner({
        continuous: true,
        video: document.getElementById('preview'),
        mirror: true,
        captureImage: true,
        backgroundScan: false,
    });
    scanner.addListener('scan', function (content, image) {
        dados = content
        if (content != '') {
            //alert(content)

            $.ajax({
                type: 'GET',
                url: 'https://5625558.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=532&deploy=1&compid=5625558&h=85568c9284b18026aa84',
                data: {
                    'voucher_id': content,
                },
            }).done(function (resposta) {
                alert(resposta)
            })
        }
    });

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            if (cameras.length == 1) {
                scanner.start(cameras[0]);
            } else {
                scanner.start(cameras[1]);
            }
        } else {
            console.error('No cameras found.');
        }
    }).catch(function (e) {
        console.error(e);
    });
}

function teste() {

}

function confere() {
    alert('Voucher usado')
}

function nao_confere() {
    alert('Os dados não conferem')
}

/*
var lista =
'<ul class="list-group">' +
'<li class="list-group-item d-flex justify-content-between" aria-disabled="true">' +
'<label for="">Nome</label>' +
'<label for="">Eduarda Cardoso</label>' +
'</li>' +
'<li class="list-group-item d-flex justify-content-between" aria-disabled="true">' +
'<label for="">CPF</label>' +
'<label for="">135.489.477-43</label>' +
'</li>' +
'</ul>';
$('.modal-body').append(lista)

$('#dados_cliente').modal('show')
*/