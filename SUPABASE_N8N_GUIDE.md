# Guia de Integração N8N com Supabase

Este guia explica como configurar o N8N para salvar insights gerados pelo agente LLM diretamente na tabela `agent_insights` do Supabase.

## Pré-requisitos

1. Acesso ao Supabase com banco de dados criado
2. Acesso ao N8N (self-hosted ou cloud)
3. O schema da tabela `agent_insights` já implementado no Supabase

## Obter Credenciais de Conexão do Supabase

1. Acesse o [Dashboard do Supabase](https://app.supabase.io)
2. Selecione seu projeto
3. Vá para **Settings > Database**
4. Na seção **Connection Info**, encontre os seguintes dados:
   - **Host**: Geralmente no formato `db.xyzabcdef.supabase.co`
   - **Port**: Normalmente `5432` (PostgreSQL padrão)
   - **Database name**: Geralmente `postgres`
   - **User**: Geralmente `postgres`
   - **Password**: A senha definida para o usuário postgres

Anote essas informações, pois serão necessárias para configurar o N8N.

## Configurar o Node PostgreSQL no N8N

1. No seu workflow N8N, adicione um novo nó **PostgreSQL**
2. Configure os parâmetros de conexão:
   - **Host**: Insira o host do Supabase (ex: `db.xyzabcdef.supabase.co`)
   - **Database**: Insira o nome do database (`postgres`)
   - **User**: Insira o usuário (`postgres`)
   - **Password**: Insira a senha configurada no Supabase
   - **Port**: `5432`
   - **SSL**: Marque como `true`
3. No campo **Operation**, selecione `Insert`
4. No campo **Table**, digite `agent_insights`
5. Em **Columns / Values**, mapeie os valores gerados pelo seu agente LLM para os campos da tabela:

```
{
  "insight_type": "performance", // ou outro tipo relevante
  "insight_title": "{{$node["LLM_Node"].json["insight_title"]}}",
  "insight_content": "{{$node["LLM_Node"].json["insight_content"]}}",
  "recommendation": "{{$node["LLM_Node"].json["recommendation"]}}",
  "priority": "{{$node["LLM_Node"].json["priority"] || 'medium'}}",
  "account_id": "{{$node["Input_Node"].json["account_id"]}}", // se disponível
  "campaign_id": "{{$node["Input_Node"].json["campaign_id"]}}", // se disponível
  "potential_impact": "{{$node["LLM_Node"].json["potential_impact"]}}"
}
```

> **Observação**: Ajuste os nomes dos nós e campos de acordo com a estrutura do seu workflow.

## Exemplo de Estrutura de Dados

O LLM deve gerar uma estrutura de dados semelhante a esta para ser inserida corretamente:

```json
{
  "insight_title": "Queda na taxa de conversão",
  "insight_content": "Detectamos uma queda de 15% na taxa de conversão nos últimos 3 dias para a campanha X.",
  "recommendation": "Considere ajustar o público-alvo ou revisar os criativos da campanha.",
  "insight_type": "performance",
  "priority": "high",
  "potential_impact": "medium"
}
```

## Testes e Verificação

Após configurar o nó PostgreSQL:

1. Execute seu workflow com dados de teste
2. Verifique no Supabase se os dados foram inseridos corretamente
3. Para testar manualmente, use a interface do Supabase para consultar a tabela `agent_insights`

## Solução de Problemas

- **Erro de conexão**: Verifique se as credenciais estão corretas e se a conexão SSL está habilitada
- **Erro de permissão**: Verifique se o usuário do banco de dados tem permissões para inserir dados na tabela
- **Erro de formato de dados**: Certifique-se de que os dados gerados pelo LLM estão no formato correto e que todos os campos obrigatórios estão preenchidos

Para mais informações, consulte a [documentação oficial do N8N sobre o nó PostgreSQL](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.postgres/). 