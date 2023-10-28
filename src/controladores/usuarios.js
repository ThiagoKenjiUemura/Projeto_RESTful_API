const bcrypt = require('bcrypt')
const pool = require('../../conexao')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt')
const { query } = require('express')

const cadastrarUsuario = async (req, res) =>{
    const {nome, email, senha} = req.body

    try {
        const emailExiste = await pool.query('select * from usuarios where email = $1',[email])
        if(emailExiste.rowCount > 0){
            return res.status(400).json({mensagem: 'Já existe usuário cadastrado com o e-mail informado'})
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10)
        const query = `insert into usuarios(nome, email, senha)
         values ($1, $2, $3) returning *`
        const { rows } = await pool.query(query, [nome,email,senhaCriptografada])
        const {senha: _, ...usuario} = rows[0]
        
        return res.status(201).json(usuario)
        
    } catch (error) {
        
        return res.status(500).json({mensagem: 'Erro interno no servidor'})
        
    }
}

const login = async (req,res) =>{
    const {email,senha} = req.body
  
    try {
        const {rows, rowCount} = await pool.query('select * from usuarios where email = $1',[email])
        if(rowCount === 0){
            return res.status(400).json({mensagem: 'Usuário e/ou senha inválido(s).'})
        }
        const {senha: senhaUsuario, ...usuario} = rows[0]
        const senhaCorreta = await bcrypt.compare(senha, senhaUsuario)
    
        if(!senhaCorreta){
            return res.status(400).json({mensagem: 'Usuário e/ou senha inválido(s).'})
        }
        const token = jwt.sign({id: usuario.id},senhaJwt, {expiresIn: '8h'})
        return res.json({
            usuario,
            token
        })

    } catch (error) {
        
        return res.status(500).json({mensagem: 'Erro interno no servidor'})
    }
}

const detalharUsuario = async(req, res) => {
    return res.json(req.usuario);
}


    const atualizarUsuario = async (req, res) => {
        const {id} = req.usuario;
        const { nome, email, senha } = req.body;
      
        if (!nome || !email || !senha) {
          return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
        };
      
        try {         
          const verificarEmailQuery = 'SELECT * FROM usuarios WHERE email = $1 AND id <> $2';
          const verificarEmailValores = [email, id];
          const { rowCount } = await pool.query(verificarEmailQuery, verificarEmailValores);
      
          if (rowCount > 0) {
            return res.status(400).json({ mensagem: 'O novo e-mail já está sendo usado por outro usuário.' });
          };
      
          // Atualizar informações do usuário no banco de dados
          const senhaCriptografada = await bcrypt.hash(senha, 10);
          const atualizaUsuarioQuery = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4';
          const atualizaUsuarioValues = [nome, email, senhaCriptografada, id];
      
          await pool.query(atualizaUsuarioQuery, atualizaUsuarioValues);
          
          return res.status(204).end();
        } catch (error) {
          console.error(error);
          return res.status(500).json({ mensagem: 'Erro interno do servidor' });
        };
      };
    

const listarCategorias = async(req, res) => {
    try {
		const { rows } = await pool.query('select * from categorias');

		return res.json(rows);
	} catch (error) {
		return res.status(500).json('Erro interno do servidor');
	};
};

const listarTransacao = async(req, res) => {
    try {
		const { rows } = await pool.query(
			'select * from transacoes where usuario_id = $1',
			[req.usuario.id]
		)


		return res.json(rows)
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro interno do servidor' })
	}
}



const detalharTransacaoUsuario = async (req, res) =>{
    const { authorization} = req.headers
    if(!authorization){
        return res.status(400).json({mensagem: 'É necessário estar autenticado para executar esta ação.'})
    }
    const token = authorization.split(' ')[1]
    try {
        const verifyToken = await jwt.verify(token,  senhaJwt)
        const query = `
        select transacoes.id, transacoes.tipo,transacoes.descricao, transacoes.valor,
         transacoes.data, transacoes.usuario_id, transacoes.categoria_id,categorias.descricao as categorias_nome
         from transacoes inner join categorias on transacoes.categoria_id = categorias.id where transacoes.usuario_id = $1`

         const transacoes = await pool.query(query, [verifyToken.id])
         if(!transacoes.rows.length){
            return res.status(404).json({mensagem: 'Transação não encontrada.'})

         }
         return res.status(200).json(transacoes.rows[0])
    } catch (error) {
        return res.status(500).json({mensagem: 'Erro interno no servidor'})
    }

}

const cadastrarTransacao = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body;
    const {id} = req.usuario
  
    if (!tipo || !descricao || !valor || !data || !categoria_id) {
      return res.status(400).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' });
    }
  
    if (tipo !== 'entrada' && tipo !== 'saida') {
      return res.status(400).json({ mensagem: 'O campo "tipo" deve ser "entrada" ou "saida".' });
    }
  
   
    const query = `INSERT INTO transacoes (tipo, descricao, valor, data, categoria_id, usuario_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
    try {
        
      const result = await pool.query(query, [tipo, descricao, valor, data, categoria_id,id]);
      const transacao = {
        id: result.rows[0].id,
        tipo,
        descricao,
        valor,
        data,
        categoria_id,
      };
      res.status(201).json(transacao);
    } catch (error) {
        console.log(error)
        
      return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
  }

  const transacaoExtrato = async (req, res) => {
    const { id } = req.usuario
  
    const queryEntrada = `SELECT COALESCE(SUM(valor), 0) AS total_entrada FROM transacoes
     WHERE usuario_id = $1 AND tipo = 'entrada'`

    const querySaida = `SELECT COALESCE(SUM(valor), 0) AS total_saida FROM transacoes 
    WHERE usuario_id = $1 AND tipo = 'saida'`
  
    try {
      const resultEntrada = await pool.query(queryEntrada, [id])
      const resultSaida = await pool.query(querySaida, [id])
  
      const extrato = {
        entrada: resultEntrada.rows[0].total_entrada,
        saida: resultSaida.rows[0].total_saida,
      }
  
      res.json(extrato)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ mensagem: 'Erro interno no servidor' })
    }
  }
const atualizarTransacao = async(req,res) =>{
  const {id} = req.params;
  const {usuario} = req;
  const { descricao, valor, data, categoria_id, tipo } = req.body;

  if (!descricao || !data || !valor || !categoria_id || !tipo) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  };

  if (tipo !== 'entrada' && tipo !== 'saida') {
    return res.status(400).json({ mensagem: 'O campo "tipo" deve ser "entrada" ou "saida".' });
  };


  
  try {  
    const transacao = await pool.query('select * from transacoes where usuario_id = $1 AND id = $2',[usuario.id,id]);
    console.log(transacao.rows[0])
    
     if(transacao.rowCount <= 0){
      return res.status(400).json({mensagem:'Transação não existe.'});
     }

     const categoria = await pool.query('select * from categorias where id = $1',[categoria_id]);

     if(categoria.rowCount <= 0){
      return res.status(400).json({mensagem:'Categoria não existe.'});
     };

      const queryAtualizcaoTransacao = 'UPDATE transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6';
      const parametrosAtualizacao = [descricao, valor, data, categoria_id, tipo, id];
      const transacaoAtualizada = await pool.query(queryAtualizcaoTransacao, parametrosAtualizacao);

      if(transacaoAtualizada.rowCount <= 0){
        return res.status(500).json({mensagem:`Erro interno: ${error.message}`});
      };
  
 return res.status(204).send();

  } catch(error) {
    return res.status(500).json({mensagem:`Erro interno: ${error.message}`});
  };
};



  const excluirTransacao = async(req,res) =>{
    const {id} = req.params;
    const{id : usuarioID} = req.usuario;

	try {
		const { rows, rowCount } = await pool.query(
			'select * from transacoes where id = $1 and usuario_id = $2 ',[id, usuarioID]);

		if (rowCount < 1) {
			return res.status(404).json({ mensagem: 'Transação não encontrada' });
		};

		await pool.query('delete from transacoes where id = $1 and usuario_id = $2', [id, usuarioID]);

		return res.status(204).send();
	} catch (error) {
		return res.status(500).json(error.message);
	};
  };

  const obterExtratoTransacao = async(req,res) => {
    const {id} = req.usuario;

    try {
  
      const resultadoEntrada = await pool.query('SELECT COALESCE(SUM(valor), 0) as entrada FROM transacoes WHERE usuario_id = $1 AND tipo = $2', [id, 'entrada']);
      const entrada = resultadoEntrada.rows[0].entrada;
  
      const resultadoSaida = await pool.query('SELECT COALESCE(SUM(valor), 0) as saida FROM transacoes WHERE usuario_id = $1 AND tipo = $2', [id, 'saida']);
      const saida = resultadoSaida.rows[0].saida;
  
      res.json({ entrada, saida });
    } catch (error) {
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
    };
  };
  
  

module.exports = {
    cadastrarUsuario,
    login,
    detalharTransacaoUsuario,
    cadastrarTransacao,
    detalharUsuario,
    atualizarUsuario,
    listarCategorias,
    transacaoExtrato,
    listarTransacao,
    detalharTransacaoUsuario,
    atualizarTransacao,
    excluirTransacao,
    obterExtratoTransacao
}
