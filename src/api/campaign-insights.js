const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Verificar se a configuração do Supabase está correta
if (!supabaseUrl || !supabaseKey) {
  console.error('Configuração do Supabase não encontrada. Configure as variáveis SUPABASE_URL e SUPABASE_KEY.');
}

/**
 * @route   GET /api/campaign-insights
 * @desc    Buscar todos os insights de campanha
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('insights_campanha')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Erro ao buscar insights de campanha:', error);
      return res.status(500).json({ error: 'Erro ao buscar insights', details: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error('Erro inesperado ao buscar insights de campanha:', error);
    return res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
});

/**
 * @route   GET /api/campaign-insights/:id
 * @desc    Buscar um insight específico por ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('insights_campanha')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erro ao buscar insight de campanha ID ${id}:`, error);
      return res.status(500).json({ error: 'Erro ao buscar insight', details: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Insight não encontrado' });
    }

    return res.json(data);
  } catch (error) {
    console.error('Erro inesperado ao buscar insight específico:', error);
    return res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
});

/**
 * @route   POST /api/campaign-insights
 * @desc    Criar um novo insight de campanha
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { nome, periodo, insights, recomendacoes, conclusao } = req.body;
    
    // Validação básica
    if (!nome || !periodo || !insights || !recomendacoes || !conclusao) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Processar arrays (caso venham como string)
    const processedInsights = typeof insights === 'string' ? JSON.parse(insights) : insights;
    const processedRecomendacoes = typeof recomendacoes === 'string' ? JSON.parse(recomendacoes) : recomendacoes;
    
    const { data, error } = await supabase
      .from('insights_campanha')
      .insert({
        nome,
        periodo,
        insights: Array.isArray(processedInsights) ? JSON.stringify(processedInsights) : processedInsights,
        recomendacoes: Array.isArray(processedRecomendacoes) ? JSON.stringify(processedRecomendacoes) : processedRecomendacoes,
        conclusao
      })
      .select();

    if (error) {
      console.error('Erro ao criar insight de campanha:', error);
      return res.status(500).json({ error: 'Erro ao criar insight', details: error.message });
    }

    return res.status(201).json(data[0]);
  } catch (error) {
    console.error('Erro inesperado ao criar insight de campanha:', error);
    return res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
});

module.exports = router; 