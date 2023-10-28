const express = require('express')
const { cadastrarUsuario, login, detalharTransacaoUsuario, detalharUsuario, atualizarUsuario,listarCategorias, listarTransacao,cadastrarTransacao, atualizarTransacao, excluirTransacao, obterExtratoTransacao,transacaoExtrato } = require('./controladores/usuarios')
const {validarToken} = require('./intermediarios/validacaoToken')
const rotas = express()

rotas.post('/usuario', cadastrarUsuario)
rotas.post('/login', login)


rotas.use(validarToken);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);
rotas.get('/categoria', listarCategorias);
rotas.get('/transacao', listarTransacao);
rotas.get('/transacao/extrato', obterExtratoTransacao);
rotas.get('/transacao/:id',detalharTransacaoUsuario)
rotas.post('/transacao', cadastrarTransacao)
rotas.get('/transacao/extrato',transacaoExtrato)
rotas.put('/transacao/:id', atualizarTransacao);
rotas.delete('/transacao/:id', excluirTransacao);


module.exports = rotas