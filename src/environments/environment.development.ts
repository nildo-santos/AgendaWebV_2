const baseUrlAgenda = 'http://localhost:8081';
const  baseUrlAutenticacao = 'http://localhost:8082';
export const environment = {
    apiCategorias: baseUrlAgenda + '/api/v1/categorias',
    apiTarefas : baseUrlAgenda + '/api/v1/tarefas',
    apiUsuarios : baseUrlAutenticacao + '/api/v1/usuarios'
};
