const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const httpmsg = require('http-msgs');
const jwt = require('jsonwebtoken');
const apiRoutes = express.Router();
const db = require('./models/config_banco')



//Importando os Modles
const promoter = require('./models/Promoter');
const parceiro = require('./models/Parceiro');
const estado = require('./models/Estado');
const cidade = require('./models/Cidade');
const registro = require('./models/Registro');
const lead = require('./models/Lead');
//FIM Importando os Modles



//Configuração de segurança 
var helmet = require('helmet');
app.use(helmet());
//FIM Configuração de segurança 



//Configuração do Token
app.set('superSecret', 'vci investimentos hard rock ');
apiRoutes.use(function (req, res, next) {

    var token = app.get('token');
    if (token) {
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                res.redirect('/')
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.redirect('/')
    }
});
//FIM Configuração do Token



// Paginas que serão protegidas
app.use('/promoter-cadastro', apiRoutes); //<----------------------- DESCOMENTAR
app.use('/promoter-menu', apiRoutes); //<----------------------- DESCOMENTAR



//Configuração do Handlebars
app.engine('handlebars', handlebars({
    defaultLayout: 'main',
}))
app.set('view engine', 'handlebars')
//FIM Configuração do Handlebars



//Configuração do Body-Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//FIM Configuração do Body-Parser



//Configuração para colocar as imagens e folha de estilo
app.use(express.static('./public'));
//FIM Configuração para colocar as imagens e folha de estilo



//Configuração das rotas
app.get('/', function (req, res) {
    res.render('promoter_login', {
        title: 'PROMOTER | LOGIN',
        script: '<script src="../../codigoJS/promoter.js"></script>'
    })
})

app.get('/promoter-cadastro', function (req, res) {
    res.render('promoter_cadastro', {
        title: 'PROMOTER | CADASTRO',
        script: '<script src="../../codigoJS/promoter.js"></script>',
        navbar: '<nav class="navbar">' +
            '<a id="voltar" class="text-gold float-left">Voltar</a>' +
            '<a id="sair" class="text-gold float-right">Sair</a>' +
            '</nav>'
    })
})

app.get('/meus-leads', function (req, res) {
    res.render('meus-leads', {
        title: 'PROMOTER | LEADS',
        script: '<script src="../../codigoJS/meus-leads.js"></script>',
        navbar: '<nav class="navbar">' +
            '<a id="voltar" class="text-gold float-left">Voltar</a>' +
            '<a id="sair" class="text-gold float-right">Sair</a>' +
            '</nav>'
    })
})

app.get('/promoter-menu', function (req, res) {
    res.render('menu', {
        title: 'PROMOTER | MENU',
        script: '<script src="../../codigoJS/promoter.js"></script>',
        navbar: '<nav class="navbar"><a id="sair" class="text-gold ml-auto">Sair</a></nav>'
    })
})

app.get('/lead/*', function (req, res) {
    res.render('lead_cadastro', {
        title: 'FAÇA JA SEU CADASTRO',
        script: '<script src="../../codigoJS/lead.js"></script>',
        splash: '<div class="modal fade" id="splash" tabindex="-1" role="dialog" aria-hidden="true" onclick="aparecer_form()">' +
            '<div class="modal-dialog modal-full" role="document">' +
            '<div class="modal-content p-0 m-0">' +
            '<div class="modal-body  p-0 m-0 d-flex align-items-center justify-content-center" id="result">' +
            '<a href="" data-dismiss="modal" aria-label="Close"> <img src="../../imagens/inicio.jpeg" class="img-fluid" alt="Imagem responsiva"></a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
    })
})

app.get('/agradecimento/positivo', function (req, res) {
    res.render('positivo', {
        title: 'OBRIGADA',
        script: '<script src="../../codigoJS/agradecimento.js"></script>'
    })
})

app.get('/agradecimento/negativo', function (req, res) {
    res.render('negativo', {
        title: 'OBRIGADA',
        script: '<script src="../../codigoJS/agradecimento.js"></script>'
    })
})
//FIM Configuração das rotas



//Rotas de REQUISIÇÃO
app.post('/carregar-meus-leads', function (req, res) {
    lead.findAll({
        where: {
            id_promoter: req.body.id,
            status: 'Não Cadastrado'
        }
    }).then(function (lead) {
        var leads = []
        lead.forEach(element => {
            leads.push(element.id)
            leads.push(element.nome)
            leads.push(element.celular)
            leads.push(element.status)
        })
        httpmsg.sendJSON(req, res, {
            status: 'success',
            dados: leads
        })
    })
})

app.post('/gerar_token', function (req, res) {

    var email = req.body.email; //recebe o email

    //Validar se esse email existe no banco
    promoter.findAll({
        where: {
            email: email
        }
    }).then(function (promoter) {
        try {
            email = promoter[0].email
            try {
                var token = jwt.sign(email, app.get('superSecret'));
                httpmsg.sendJSON(req, res, {
                    status: 'Token_OK',
                    token: token
                })
            } catch (error) {
                httpmsg.sendJSON(req, res, {
                    status: 'Erro_Token',
                })
            }
        } catch (error) {
            status = 'Email_Incorreto';
            httpmsg.sendJSON(req, res, {
                status: status,
            })
        }

    })
    //FIM Validar se esse email existe no banco
})

app.post('/login', function (req, res) {

    var email = req.body.email; //recebe o email
    var senha = req.body.senha; //recebe o senha

    //Validar se esse email existe no banco
    promoter.findAll({
        where: {
            email: email,
            senha: senha,
        }
    }).then(function (promoter) {
        try {
            var dado = (promoter[0].email); //sem isso, consegue acessar mesmo q a senha esteja errada
            httpmsg.sendJSON(req, res, {
                status: 'Login_OK',
                id: promoter[0].id,
                crm: promoter[0].id_crm,
                nome_promoter: promoter[0].nome
            })
        } catch (error) {
            httpmsg.sendJSON(req, res, {
                status: 'Erro_Senha',
            })
        }
    })
    //FIM Validar se esse email existe no banco
})

app.post('/logout', function (req, res) {

    registro.update({
        status: 'OFFLINE'
    }, {
        where: {
            id: req.body.registro
        }
    }).then(() => {
        app.set('token', false);
        httpmsg.sendJSON(req, res, {
            status: 'Logout_OK',
        })
    }).catch(function (error) {
        httpmsg.sendJSON(req, res, {
            status: 'Logout_erro',
        })
    });

})

app.post('/registro', function (req, res) {

    var id_parceiro = req.body.id_parceiro; //recebe o id do parceiro
    var id_promoter = req.body.id_promoter; //recebe o id do promoter
    var token = req.body.token; //recebe o token

    //Criar resgistro
    registro.create({
        id_parceiro: id_parceiro,
        id_promoter: id_promoter,
        status: 'ONLINE',
        promoter_nome: req.body.nome_promoter
    }).then(registro => {
        app.set('token', token)
        httpmsg.sendJSON(req, res, {
            status: 'Registro_OK',
            id_parceiro: id_parceiro,
            id_promoter: id_promoter,
            crm: req.body.crm,
            registro: registro.id,
            nome_promoter: registro.promoter_nome
        })
    }).catch(function (erro) {
        httpmsg.sendJSON(req, res, {
            status: 'Erro_Registro'
        })
    });
})

app.post('/carregar_lead', function (req, res) {

    var id_lead = req.body.codigo; //recebe o id do lead

    lead.findAll({
        where: {
            id: id_lead
        }
    }).then(function (lead) {
        try {
            var status = (lead[0].status); //sem isso, consegue acessar mesmo q a senha esteja errada
            if (status === 'Não Cadastrado') {
                httpmsg.sendJSON(req, res, {
                    status: 'Lead_OK',
                    nome: lead[0].nome,
                    celular: lead[0].celular,
                    id_promoter: lead[0].id_promoter,
                    id_parceiro: lead[0].id_parceiro,
                    promoter_crm: lead[0].promoter_crm,
                    promoter_nome: lead[0].promoter_nome,
                })
            } else {
                httpmsg.sendJSON(req, res, {
                    status: 'Lead_ERROR',
                })
            }

        } catch (error) {
            httpmsg.sendJSON(req, res, {
                status: 'Erro_Lead',
            })
        }
    })
})

app.post('/carregar_lead/parceiro', function (req, res) {
    parceiro.findAll({
        where: {
            id: req.body.id_parceiro
        }
    }).then(function (parceiro) {
        httpmsg.sendJSON(req, res, {
            nome: parceiro[0].nome,
            estado: parceiro[0].id_estado,
        })
    })
})

app.post('/salvar-lead', function (req, res) {

    var id_parceiro = req.body.id_parceiro; //recebe o id do parceiro
    var id_promoter = req.body.id_promoter; //recebe o id do promoter
    var nome = req.body.nome; //recebe o nome do lead
    var celular = req.body.numero_celular; //recebe o numero d etelefone do lead

    //Criar resgistro
    lead.create({
        id_parceiro: id_parceiro,
        id_promoter: id_promoter,
        nome: nome,
        celular: celular,
        promoter_crm: req.body.promoter_crm,
        promoter_nome: req.body.nome_promoter,
        status: 'Não Cadastrado'
    }).then(lead => {
        httpmsg.sendJSON(req, res, {
            status: 'Lead_OK',
            id_lead: lead.id
        })
    }).catch(function (erro) {
        httpmsg.sendJSON(req, res, {
            status: 'Erro_Lead'
        })
    });
})

app.post('/lead/confirmar-cadastro', function (req, res) {
    lead.update({
        status: 'Cadastrado'
    }, {
        where: {
            id: req.body.id
        }
    }).then(() => {
        httpmsg.sendJSON(req, res, {
            status: 'ok',
        })
    }).catch(function (error) {
        httpmsg.sendJSON(req, res, {
            status: 'erro',
        })
    });
})

app.get('/carregar_estados', function (req, res) {
    estado.findAll().then(function (estado) {
        httpmsg.sendJSON(req, res, {
            estados: estado
        })
    })
})

app.get('/carregar_cidades', function (req, res) {
    cidade.findAll().then(function (cidade) {
        httpmsg.sendJSON(req, res, {
            cidades: cidade
        })
    })
})

app.get('/carregar_parceiros', function (req, res) {
    parceiro.findAll().then(function (parceiro) {
        httpmsg.sendJSON(req, res, {
            parceiros: parceiro
        })
    })
})
//FIM Rotas de REQUISIÇÃO

app.listen(8091)
//app.listen(81, '192.168.174.12')