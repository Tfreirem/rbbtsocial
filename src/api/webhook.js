const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// Configuração da conexão com o banco
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Endpoint para receber dados do n8n via webhook
 * POST /api/webhook/meta-ads
 */
router.post('/meta-ads', async (req, res) => {
  try {
    const { entity_type, data } = req.body;
    
    // Validar os dados recebidos
    if (!entity_type || !data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Formato de dados inválido' });
    }
    
    const client = await pool.connect();
    
    try {
      // Iniciar transação
      await client.query('BEGIN');
      
      // Inserir dados com base no tipo de entidade
      switch (entity_type) {
        case 'accounts':
          for (const account of data) {
            await client.query(
              `INSERT INTO accounts (account_id, account_name, status, currency, timezone, updated_at) 
               VALUES ($1, $2, $3, $4, $5, NOW()) 
               ON CONFLICT (account_id) 
               DO UPDATE SET 
                 account_name = EXCLUDED.account_name, 
                 status = EXCLUDED.status, 
                 currency = EXCLUDED.currency, 
                 timezone = EXCLUDED.timezone, 
                 updated_at = NOW()`,
              [account.account_id, account.account_name, account.status, account.currency, account.timezone]
            );
          }
          break;
          
        case 'campaigns':
          for (const campaign of data) {
            await client.query(
              `INSERT INTO campaigns (
                campaign_id, account_id, campaign_name, status, objective, 
                buying_type, start_time, stop_time, budget_remaining, 
                daily_budget, lifetime_budget, updated_at
              ) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) 
              ON CONFLICT (campaign_id) 
              DO UPDATE SET 
                account_id = EXCLUDED.account_id,
                campaign_name = EXCLUDED.campaign_name, 
                status = EXCLUDED.status, 
                objective = EXCLUDED.objective,
                buying_type = EXCLUDED.buying_type,
                start_time = EXCLUDED.start_time,
                stop_time = EXCLUDED.stop_time,
                budget_remaining = EXCLUDED.budget_remaining,
                daily_budget = EXCLUDED.daily_budget,
                lifetime_budget = EXCLUDED.lifetime_budget,
                updated_at = NOW()`,
              [
                campaign.campaign_id, campaign.account_id, campaign.campaign_name, 
                campaign.status, campaign.objective, campaign.buying_type, 
                campaign.start_time, campaign.stop_time, campaign.budget_remaining,
                campaign.daily_budget, campaign.lifetime_budget
              ]
            );
          }
          break;
          
        case 'ad_sets':
          for (const adSet of data) {
            await client.query(
              `INSERT INTO ad_sets (
                ad_set_id, campaign_id, ad_set_name, status, bid_strategy, 
                daily_budget, lifetime_budget, targeting, optimization_goal, updated_at
              ) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) 
              ON CONFLICT (ad_set_id) 
              DO UPDATE SET 
                campaign_id = EXCLUDED.campaign_id,
                ad_set_name = EXCLUDED.ad_set_name, 
                status = EXCLUDED.status, 
                bid_strategy = EXCLUDED.bid_strategy,
                daily_budget = EXCLUDED.daily_budget,
                lifetime_budget = EXCLUDED.lifetime_budget,
                targeting = EXCLUDED.targeting,
                optimization_goal = EXCLUDED.optimization_goal,
                updated_at = NOW()`,
              [
                adSet.ad_set_id, adSet.campaign_id, adSet.ad_set_name, 
                adSet.status, adSet.bid_strategy, adSet.daily_budget, 
                adSet.lifetime_budget, JSON.stringify(adSet.targeting || {}), adSet.optimization_goal
              ]
            );
          }
          break;
          
        case 'ads':
          for (const ad of data) {
            await client.query(
              `INSERT INTO ads (
                ad_id, ad_set_id, ad_name, status, creative_id, preview_url, updated_at
              ) 
              VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
              ON CONFLICT (ad_id) 
              DO UPDATE SET 
                ad_set_id = EXCLUDED.ad_set_id,
                ad_name = EXCLUDED.ad_name, 
                status = EXCLUDED.status, 
                creative_id = EXCLUDED.creative_id,
                preview_url = EXCLUDED.preview_url,
                updated_at = NOW()`,
              [
                ad.ad_id, ad.ad_set_id, ad.ad_name, 
                ad.status, ad.creative_id, ad.preview_url
              ]
            );
          }
          break;
          
        case 'performance':
          for (const perf of data) {
            // Construir dinamicamente a query para todos os campos
            const fields = Object.keys(perf).filter(k => k !== 'id');
            const values = fields.map(f => perf[f]);
            const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
            const updateSets = fields
              .filter(f => f !== 'date_start' && f !== 'account_id' && f !== 'campaign_id' && 
                      f !== 'ad_set_id' && f !== 'ad_id')
              .map((f, i) => `${f} = EXCLUDED.${f}`)
              .join(', ');
            
            await client.query(
              `INSERT INTO ads_performance_daily (${fields.join(', ')}, last_fetched_time) 
               VALUES (${placeholders}, NOW()) 
               ON CONFLICT (date_start, account_id, campaign_id, ad_set_id, ad_id, 
                 COALESCE(age_range, ''), COALESCE(gender, ''), COALESCE(platform, ''),
                 COALESCE(placement, ''), COALESCE(device_platform, ''), COALESCE(country_code, ''),
                 COALESCE(region, ''))
               DO UPDATE SET 
                 ${updateSets}, 
                 last_fetched_time = NOW()`,
              values
            );
          }
          break;
          
        default:
          return res.status(400).json({ error: `Tipo de entidade desconhecido: ${entity_type}` });
      }
      
      // Registrar o sync no log
      await client.query(
        `INSERT INTO data_sync_logs 
         (sync_type, records_processed, status, sync_start_time, sync_end_time) 
         VALUES ($1, $2, $3, NOW(), NOW())`,
        [entity_type, data.length, 'success']
      );
      
      // Commit da transação
      await client.query('COMMIT');
      
      res.status(200).json({ 
        success: true, 
        message: `${data.length} registros de ${entity_type} processados com sucesso` 
      });
      
    } catch (error) {
      // Rollback em caso de erro
      await client.query('ROLLBACK');
      
      // Registrar falha no log
      await client.query(
        `INSERT INTO data_sync_logs 
         (sync_type, status, error_message, sync_start_time, sync_end_time) 
         VALUES ($1, $2, $3, NOW(), NOW())`,
        [entity_type, 'failure', error.message]
      );
      
      console.error('Erro ao processar webhook:', error);
      res.status(500).json({ error: 'Erro ao processar dados', details: error.message });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

module.exports = router; 