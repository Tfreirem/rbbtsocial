const express = require('express');
const cors = require('cors');
const webhookRouter = require('./webhook');
const insightsRouter = require('./insights');
const campaignInsightsRouter = require('./campaign-insights');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rotas
app.use('/api/webhook', webhookRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/campaign-insights', campaignInsightsRouter);

// Rota básica para verificar se a API está rodando
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API em funcionamento' });
});

// Tratamento de erro para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar o servidor
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app; 