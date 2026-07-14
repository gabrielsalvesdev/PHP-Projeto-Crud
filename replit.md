# REFATORADO: Refatorar c������������������������������������������������������digo para: Analisar o projeto PHP CRUD e aplicar melhorias de código, incluindo boas práticas, segurança e performance
# REFATORADO: Refatorar c������������������������������������������������������digo para: Analisar o projeto PHP CRUD e aplicar melhorias de código, incluindo boas práticas, segurança e performance
# REFATORADO: Refatorar c������������������������������������������������������digo para: Analisar o projeto PHP CRUD e aplicar melhorias de código, incluindo boas práticas, segurança e performance
# REFATORADO: Refatorar c������������������������������������������������������digo para: Analisar o projeto PHP CRUD e aplicar melhorias de código, incluindo boas práticas, segurança e performance
# CRUD PHP - Agenda de Contatos

Aplicação CRUD de agenda de contatos com frontend moderno em JS puro e backend PHP + PostgreSQL.

## Arquitetura

- **Frontend**: HTML + CSS + JavaScript puro (tema dark, sem frameworks) em `/app/`
- **API REST**: PHP em `/api/contatos.php` — endpoints GET, POST, PUT, DELETE
- **Backend legado**: PHP server-side render em `index.php`, `create.php`, etc.
- **Database**: Replit PostgreSQL via PDO pgsql
- **Server**: PHP built-in server com `router.php` roteando `/app/` e `/api/`

## Estrutura de Arquivos

```
/
├── app/
│   ├── index.html       ← Frontend principal (SPA)
│   ├── style.css        ← Estilos (dark theme, responsivo)
│   └── app.js           ← Lógica JS (consumo da API REST)
├── api/
│   └── contatos.php     ← API REST (GET/POST/PUT/DELETE)
├── erros_examples/
│   └── erros_php.php    ← 15 exemplos de erros PHP intencionais para análise estática
├── banco.php            ← Singleton de conexão PDO (PostgreSQL)
├── router.php           ← Roteador do PHP built-in server
├── index.php            ← Listagem legada (Bootstrap)
├── create.php           ← Criação legada
├── read.php             ← Leitura legada
├── update.php           ← Atualização legada
└── delete.php           ← Exclusão legada
```

## Funcionalidades do Frontend

- Dashboard com cards de estatísticas (total, masculino, feminino)
- Grid de cards de contatos com avatar, badge de sexo, detalhes
- Busca em tempo real por nome, email ou telefone
- Modal de criação/edição com validação client-side
- Confirmação de exclusão
- Toast de feedback (sucesso/erro)
- Totalmente responsivo

## API REST

| Método | Endpoint                  | Ação                    |
|--------|---------------------------|-------------------------|
| GET    | /api/contatos.php         | Listar todos contatos   |
| GET    | /api/contatos.php?id=N    | Buscar contato por ID   |
| POST   | /api/contatos.php         | Criar contato           |
| PUT    | /api/contatos.php?id=N    | Atualizar contato       |
| DELETE | /api/contatos.php?id=N    | Excluir contato         |

## Repositório de Erros (Análise Estática)

`erros_examples/erros_php.php` contém 15 tipos de erros PHP intencionais:
1. Variáveis indefinidas
2. Type mismatch
3. Null dereference
4. Loose comparison (== vs ===)
5. SQL Injection
6. Divisão por zero
7. Retorno implícito null
8. Loop infinito potencial
9. Variável usada antes de atribuição
10. Supressão de erro com @
11. Constante indefinida
12. Parâmetros não utilizados (dead code)
13. Método inexistente em objeto
14. Array key sem verificação
15. Recursão sem condição de parada

Ferramentas recomendadas: PHPStan, Psalm, PHP_CodeSniffer, Rector

## Database

PostgreSQL via env vars: `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

Tabela: `pessoa` (id SERIAL, nome, endereco, telefone, email, sexo)

## Executando

```
php -S 0.0.0.0:5000 router.php
```

Acesse `/app/index.html` para o frontend moderno, ou `/index.php` para o legado.
