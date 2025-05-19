# Configuração N8N para Salvar Insights no Supabase

## Informações do Banco de Dados

Com base nas consultas realizadas, identificamos que o banco de dados Supabase possui uma tabela chamada `insights_campanha` com a seguinte estrutura:

| Coluna         | Descrição                                  |
|----------------|-------------------------------------------|
| id             | Identificador único (número inteiro)      |
| nome           | Título do insight                         |
| periodo        | Período de análise (ex: "Fevereiro a Abril de 2025") |
| insights       | Array de strings com os principais insights identificados |
| recomendacoes  | Array de strings com recomendações de ação |
| conclusao      | Texto com a conclusão da análise          |
| criado_em      | Data e hora de criação do registro        |

## Configuração do Node PostgreSQL no N8N

Para configurar o N8N para salvar novos insights:

1. **Credenciais do Supabase**:
   - **URL**: https://abuqzkawztlftojsqjsn.supabase.co
   - **Credencial disponível**: Sim (configurada no .env)

2. **Configure o node PostgreSQL**:
   - **Host**: db.abuqzkawztlftojsqjsn.supabase.co
   - **Database**: postgres
   - **Port**: 5432
   - **User**: postgres
   - **Password**: (Verifique com o administrador)
   - **SSL**: Ativado (true)

3. **Operação**:
   - Selecione: `Insert`
   - Tabela: `insights_campanha`

4. **Mapeamento dos Campos**:
   ```
   {
     "nome": "{{$node["LLM_Node"].json["titulo"]}}",
     "periodo": "{{$node["LLM_Node"].json["periodo"]}}",
     "insights": "{{JSON.stringify($node["LLM_Node"].json["insights"])}}",
     "recomendacoes": "{{JSON.stringify($node["LLM_Node"].json["recomendacoes"])}}",
     "conclusao": "{{$node["LLM_Node"].json["conclusao"]}}"
   }
   ```

## Exemplo de Payload do LLM

O LLM deve gerar uma resposta com a seguinte estrutura:

```json
{
  "titulo": "Análise de Desempenho de Campanha",
  "periodo": "Janeiro a Março de 2025",
  "insights": [
    "CTR aumentou 25% ao longo do período",
    "Formatos de vídeo tiveram desempenho 40% superior aos estáticos",
    "Frequência ideal identificada em 1.8 para maximizar resultados"
  ],
  "recomendacoes": [
    "Priorizar formatos de vídeo nos próximos meses",
    "Manter frequência controlada entre 1.7-1.9",
    "Revisar landing pages para melhorar conversão pós-clique"
  ],
  "conclusao": "A campanha mostrou evolução constante, com oportunidades claras de otimização nos formatos e controle de frequência."
}
```

## Prompt para o LLM

Para garantir que o LLM gere insights no formato correto, utilize um prompt similar a este:

```
Analise os dados de performance da campanha para o período de [PERÍODO] e forneça:

1. Um título descritivo para a análise
2. De 3 a 7 insights principais identificados nos dados
3. De 3 a 5 recomendações práticas baseadas nos insights
4. Uma conclusão sucinta que resuma os achados e próximos passos

Formate sua resposta como um objeto JSON com as seguintes chaves:
- titulo: string
- periodo: string (ex: "Janeiro a Março de 2025")
- insights: array de strings
- recomendacoes: array de strings
- conclusao: string
```

## Workflow no N8N

1. **Trigger**: Escolha entre agendamento periódico ou webhook
2. **HTTP Request**: Para buscar dados do Meta Ads
3. **Function**: Para transformar e preparar dados para análise
4. **LLM Node** (OpenAI/Claude): Para gerar insights
5. **PostgreSQL**: Para salvar no Supabase
6. **Slack/Email** (opcional): Para notificar sobre novos insights

## Teste e Validação

Após configurar:
1. Execute o workflow com dados de teste
2. Verifique se os dados são inseridos corretamente no Supabase
3. Ajuste o formato do prompt ou mapeamento conforme necessário

Para mais detalhes sobre a configuração do node PostgreSQL no N8N, consulte a [documentação oficial](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.postgres/). 