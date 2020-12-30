/**
 * Diego recomendou que não fizessemos comentários desse mondo em nosso código
 * mas para fins didáticos entendo melhor se eu for comentando cada parte de 
 * codigo, ajuda a gravar para que serve cada funcionalidade que estou aprendendo
 */


//uses externos (importa bibliotecas)
const express = require("express");
const cors = require("cors");

/**
 * Fiz uma pequena alteração no uuid porque as funções "uuid" e "isuuid" estavam
 * descontinuadas dando messagem de warning ao executar a aplicacao
 */
const { v4, validate } = require('uuid');

const app = express();

/**
 * express.json
 * instancia recurso de leitura json, utlizado para ler os bodys que 
 * chegam em formato json, faz com que o express reconheça json 
 */ 
app.use(express.json());
app.use(cors());

/**
 * variavel array de aonde iremos armazenar os objetos de forma temporária
 * pois ao fechar a aplicacao e descarregada da memória. Recurso utilizado
 * enquando nao acessamos banco de dados
 */
const repositories = [];

/**
 * Metodo HTTP:
 * 
 * GET: Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT/PATh: Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 */

 /**
 * Tipos de parâmetros
 * 
 * Query Params: Filtros e paginação
 * Rout Params: Identificar recursos (atualizar/deletar)
 * Request Body: Coneudo na hora de criar ou editar um recurso (JSON)
 */

 /**
  * Middleware:
  * 
  * Interceptado de requisições que pode interromper totalmente a requisição
  * ou alterar dadso da requisição
  */

app.get("/repositories", (request, response) => {
   return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  
  // consts
  /**
   * este é o formato que chamamos de desconstruturação e assim ele ja instacia
   * as variaves e como as variaveis tem os mesmos nomes dos parametros
   * ele ja preenche os dados capturando do body
   */ 
  const { title, url, techs } = request.body;
  
  //variavel de objeto
  /**
   * declara a variável de objeto com os parametro que seram recebido no json
   * adicionar tambem um parametro adicionar que é o id que ja é preenchido com
   * a função "uuid" que criar um id unico na hora
   */
  const repository = { 
      id: v4(), 
      title, 
      url,
      techs,
      likes: 0, 
    };

  /**
   * adiciona objet em um array comando "push"
   */
  repositories.push(repository);

  /**
   * responde a requisicao com o objeto recem criado e adicionado no array
   * de repositorios
   */
  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  
  /**
   * obtem os dados enviados na requisicao, o "id" para "URL Param" e os dados
   * "tittle, ur e thecs" por "Body Params" ja realizando a descontrução dos 
   * valores suas variaves
   */
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  /**
   * procura o objeto identificado pelo parametro Id dentro do array de 
   * respositorios
   */
  const itemIndex = repositories.findIndex(repository => repository.id === id);

  /**
   * caso não encontre o respositorio solicitado resulta na resposta de erro 
   * informado que o respositorio não existe e http error 400
   */
  if (!(itemIndex >= 0)) {
    return response.status(400).json({ error: 'Repository does not exists.' });
  }

  /**
   * instacia uma variacel e preence os valores para alteracao do respositorio
   * indicado, como o criterio e manter os like e nao poder reslizar alterações 
   * manuais tem que manter os likes do respositorio selecionado.
   */
  const respository = {
    id,
    title,
    url,
    techs,
    likes: repositories[itemIndex].likes
  };
   
  /**
   * preenche na lista de respositorios os dados do respositorio selecionado em 
   * "itemIndex" com os dados do novo objeto que esta em  "respository"
   */
  repositories[itemIndex] = respository;
 
  /**
   * responde com o objeto alterado com o item do array selecinado para ter 
   * certeza que este item foi alterado
   */
  return response.json(respository);
});

app.delete("/repositories/:id", (request, response) => {
  
  //busca o parametro em Rout Param
  const { id } = request.params;

  /**
   * procura indice em um array com "findIndex" que retorna a posicao de um
   * objeto na busca, tambem pode ser utilizado "find" que retorno o objeto 
   * procurado 
   */
  const itemIndex = repositories.findIndex(repository => repository.id === id);

  //verifica se o indice foi encontrato caso contrário  
  if (itemIndex < 0) {
    /** retorna erro para o client. A função "statu" permite alterara o codigo
     * http definido com result um erro da aplicação
    */ 
    return response.status(400).json({ error: 'Repository does not exists.' })
  }

  //remove um objeto de um array com o comando "Splice"
  repositories.splice(itemIndex, 1);
  
  /**
   * quando respondemos sem codigo o recomendado e preenchermos um código
   * http 204 que quer diser que a rota da api executou perfeitamente.
   */
  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  
  /**
   * Busca Id no Url Params
   */
  const { id } = request.params; 

  /**
   * procura indice em um array com "findIndex" que retorna a posicao de um
   * objeto na busca, tambem pode ser utilizado "find" que retorno o objeto 
   * procurado 
   */
  const itemIndex = repositories.findIndex(repository => repository.id === id);

  /**
   * Verifica se o se o indice do respositoria foi encontrado no array de 
   * respositorios, caso não tenha encontrado responde com a mensagem que 
   * não foi encontrado
   */
  if (!(itemIndex >= 0)) {
    return response.status(400).json({ error: 'Repository does not exists.' })
  }

  /**
   * Incrementa o like ao do repositorio encontrado
   */
  repositories[itemIndex].likes += 1;

  /**
   * responde com o repositorio encontrado e atualizado com o incremento 
   * do like
   */
  return response.json(repositories[itemIndex]);
});

module.exports = app;