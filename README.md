# rocketseat-fastify

## Documentação da API

A documentação OpenAPI é gerada automaticamente a partir dos schemas Zod definidos nas rotas e schemas da aplicação.

Com a API em execução (`npm run dev`), acesse:

- **Scalar API Reference:** [http://localhost:3333/api/docs](http://localhost:3333/api/docs)
- **Especificação OpenAPI (JSON):** [http://localhost:3333/api/docs/openapi.json](http://localhost:3333/api/docs/openapi.json)

Ao adicionar ou alterar endpoints, defina os schemas de `body`, `querystring`, `params` e `response` com Zod para que a documentação seja atualizada automaticamente.
