var Service = require('node-windows').Service;
 
// Create a new service object
var svc = new Service({
  name:'Cadastro_Novos_Leads',
  description: 'Esse sistema abrange desde o contato da promotora com o lead ate o cadastro completo do mesmo no sistema.',
  script: 'C:\\dominios\\www\\app'
});
 
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
 
svc.install();