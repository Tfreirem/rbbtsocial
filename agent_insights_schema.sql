-- Script para criar a tabela de insights do agente no Supabase

CREATE TABLE agent_insights (
  id BIGSERIAL PRIMARY KEY,
  account_id VARCHAR(50) REFERENCES accounts(account_id),
  campaign_id VARCHAR(50) REFERENCES campaigns(campaign_id),
  ad_set_id VARCHAR(50) REFERENCES ad_sets(ad_set_id),
  ad_id VARCHAR(50) REFERENCES ads(ad_id),
  insight_type VARCHAR(100) NOT NULL,
  insight_title VARCHAR(255) NOT NULL,
  insight_content TEXT NOT NULL,
  recommendation TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  metadata JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  is_implemented BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'medium',
  potential_impact VARCHAR(20),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'critical'))
);

-- Criar índices para melhorar performance
CREATE INDEX idx_insights_account ON agent_insights(account_id);
CREATE INDEX idx_insights_timestamp ON agent_insights(timestamp);
CREATE INDEX idx_insights_priority ON agent_insights(priority);
CREATE INDEX idx_insights_type ON agent_insights(insight_type);
CREATE INDEX idx_insights_read ON agent_insights(is_read);

-- Permissões (útil para o Supabase)
ALTER TABLE agent_insights ENABLE ROW LEVEL SECURITY;

-- Comentários para documentação
COMMENT ON TABLE agent_insights IS 'Tabela que armazena insights gerados automaticamente pelo agente N8N';
COMMENT ON COLUMN agent_insights.insight_type IS 'Tipo do insight: performance, budget, audience, creative, etc';
COMMENT ON COLUMN agent_insights.priority IS 'Prioridade do insight: low, medium, high, critical';
COMMENT ON COLUMN agent_insights.potential_impact IS 'Impacto potencial em termos de melhoria de performance ou economia'; 