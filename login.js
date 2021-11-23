
// incluindo os pacotes no App Node.js, criando as seguintes variáveis ​​e exigindo os módulos.
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

//esse código conecta ao banco de dados.
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'formulariologin'
});

//usar Express para apps da web, inclui pacotes úteis no desenvolvimento da web, como sessões e manipulação de solicitações HTTP.
var app = express();

//informar ao Express a utilização de alguns de seus pacotes.
//o pacote bodyParser irá extrair os dados do formulário no Arquivo login.html. 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Agora exibir o arquivo login.html para o cliente.
//Quando o cliente se conectar ao servidor, a página de login será exibida, o servidor enviará o Arquivo login.html .
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/login.html'));
});

//POST, quando o cliente insere seus dados no formulário de login e clica no botão enviar, os dados do formulário serão enviados para o servidor e com esses dados o script de login fará o check-in nossa tabela de contas do MySQL para ver se os detalhes estão corretos.
//Se o resultado retornado da tabela existir, são criadas duas variáveis ​​de sessão, uma para determinar se o cliente está logado e a outra será seu nome de usuário.
app.post('/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            } else {
                response.send('Nome de usuário e / ou senha incorretos!');
            }
            response.end();
        });
    } else {
        response.send('Por favor, insira o nome de usuário e a senha!');
        response.end();
    }
});

//Se correr conforme o esperado e o cliente efetuar login, ele será redirecionado para a página inicial.
//página inicial com outra solicitação usando GET.
app.get('/home', function (request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.send('Por favor faça o login para ver esta página!');
    }
    response.end();
});

//executando o app Web em uma porta.
app.listen(3000);