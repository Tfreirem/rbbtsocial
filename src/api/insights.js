const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Verificar se a configuração do Supabase está correta
if (!supabaseUrl || !supabaseKey) {
  console.error('Configuração do Supabase não encontrada. Configure as variáveis SUPABASE_URL e SUPABASE_ANON_KEY.');
}

/**
 * @route   GET /api/insights
 * @desc    Buscar insights com filtros opcionais
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      is_read,
      priority,
      insight_type,
      account_id,
    } = req.query;

    let query = supabase
      .from('agent_insights')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(parseInt(limit))
      .range((parseInt(page) - 1) * parseInt(limit), parseInt(page) * parseInt(limit) - 1);

    // Aplicar filtros se fornecidos
    if (is_read !== undefined) query = query.eq('is_read', is_read === 'true');
    if (priority) query = query.eq('priority', priority);
    if (insight_type) query = query.eq('insight_type', insight_type);
    if (account_id) query = query.eq('account_id', account_id);

    const { data, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar insights:', error);
      return res.status(500).json({ error: 'Erro ao buscar insights', details: error.message });
    }

    // Buscar a contagem total para paginação
    const { count: totalCount, error: countError } = await supabase
      .from('agent_insights')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Erro ao buscar contagem de insights:', countError);
    }

    return res.json({
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount || 0,
        pages: Math.ceil((totalCount || 0) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao processar requisição de insights:', error);
    return res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
});

/**
 * @route   GET /api/insights/unread-count
 * @desc    Obter contagem de insights não lidos
 * @access  Public
 */
router.get('/unread-count', async (req, res) => {
  try {
    const { account_id } = req.query;

    let query = supabase
      .from('agent_insights')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false);

    if (account_id) query = query.eq('account_id', account_id);

    const { count, error } = await query;

    if (error) {
      console.error('Erro ao contar insights não lidos:', error);
      return res.status(500).json({ error: 'Erro ao contar insights', details: error.message });
    }

    return res.json({ count: count || 0 });
  } catch (error) {
    console.error('Erro ao processar contagem de insights:', error);
    return res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
});

/**
 * @route   PATCH /api/insights/:id/read
 * @desc    Marcar insight como lido
 * @access  Public
 */
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_read = true } = req.body;

    const { error } = await supabase
      .from('agent_insights')
      .update({ is_read })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar status do insight:', error);
      return res.status(500).json({ error: 'Erro ao atualizar insight', details: error.message });
    }

    return res.json({ success: true, message: 'Status do insight atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao processar atualização de insight:', error);
    return res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
});

/**
 * @route   PATCH /api/insights/:id/implement
 * @desc    Marcar insight como implementado
 * @access  Public
 */
router.patch('/:id/implement', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_implemented = true } = req.body;

    const { error } = await supabase
      .from('agent_insights')
      .update({ is_implemented })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar status de implementação:', error);
      return res.status(500).json({ error: 'Erro ao atualizar insight', details: error.message });
    }

    return res.json({ success: true, message: 'Status de implementação atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao processar atualização de implementação:', error);
    return res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
});

module.exports = router; 