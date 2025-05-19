# THC SOCIAL DASH

Um dashboard moderno e futurista para equipes de marketing e C-level, desenvolvido com React e TailwindCSS.

## Visão Geral

THC SOCIAL DASH é um dashboard de performance com estética futurista em dark-mode, semelhante a um sistema operacional técnico. O projeto foi desenvolvido seguindo as especificações detalhadas para criar uma interface moderna e funcional para visualização de métricas de marketing digital.

## Funcionalidades Implementadas

- **Sidebar lateral fixa** com ícones e rótulos para navegação entre seções
- **Menu superior contextual** que muda dinamicamente de acordo com a seção ativa
- **Cards de KPIs** para visualização de métricas importantes (CTR, CPC, ROAS, etc.)
- **Gráficos interativos** (linha, barra e pizza) para análise de dados
- **Layout responsivo** adaptado para diferentes tamanhos de tela
- **Tema dark-mode** com estética futurista

## Tecnologias Utilizadas

- React com TypeScript
- TailwindCSS para estilização
- Recharts para visualização de dados
- React Icons para ícones

## Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```
   pnpm install
   ```
3. Execute o servidor de desenvolvimento:
   ```
   pnpm run dev
   ```
4. Acesse a aplicação em `http://localhost:5173`

## Build para Produção

Para gerar os arquivos de produção:

```
pnpm run build
```

Os arquivos serão gerados na pasta `dist` e podem ser servidos por qualquer servidor web estático.

## Estrutura do Projeto

- `src/components/layout`: Componentes de layout (Sidebar, Header, TabMenu)
- `src/components/cards`: Componentes de cards para métricas
- `src/components/charts`: Componentes de gráficos
- `src/App.tsx`: Componente principal que integra todos os outros
- `src/index.css`: Estilos globais e configurações do TailwindCSS

## Instruções para o Cursor AI - Próximos Passos

Para continuar o desenvolvimento deste projeto, siga estas diretrizes:

### 1. Implementação de Funcionalidades Adicionais

- **Autenticação de Usuários**: Implementar sistema de login/logout usando Firebase Auth ou similar
- **Persistência de Dados**: Conectar o dashboard a uma API real ou Supabase conforme sugerido nas especificações
- **Configuração de Dashboard**: Implementar o componente DashboardConfigurator para permitir que usuários personalizem quais KPIs desejam visualizar
- **Modo Claro/Escuro**: Adicionar suporte para alternância entre temas light/dark

### 2. Melhorias de UX/UI

- **Animações**: Adicionar animações de transição entre seções e ao carregar dados
- **Tooltips Avançados**: Melhorar os tooltips dos gráficos com informações mais detalhadas
- **Filtros de Data**: Implementar seletores de período para filtrar dados por intervalo de tempo
- **Exportação de Dados**: Adicionar funcionalidade para exportar dados em CSV ou PDF

### 3. Otimizações Técnicas

- **Code Splitting**: Implementar lazy loading para componentes grandes
- **Testes Unitários**: Adicionar testes usando Jest e React Testing Library
- **Internacionalização**: Preparar o app para suportar múltiplos idiomas com i18n
- **PWA**: Configurar como Progressive Web App para instalação em dispositivos

### 4. Arquivos e Componentes a Modificar

- `src/App.tsx`: Adicionar contexto de tema e autenticação
- `src/components/layout/Header.tsx`: Adicionar toggle de tema e botões de usuário
- Criar novo componente: `src/components/settings/DashboardConfigurator.tsx`
- Criar pasta: `src/services/` para APIs e gerenciamento de estado

### 5. Dados e APIs

- Implementar hooks personalizados para buscar dados de APIs
- Seguir o modelo sugerido nas especificações:
  ```typescript
  // Exemplo de estrutura para API
  interface Metric {
    id: string;
    tipo: string;
    valor: number;
    variacao: number;
    data_execucao: string;
    contexto: string;
  }
  
  // Hook de exemplo
  const useMetrics = (section: string) => {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    
    useEffect(() => {
      // Buscar dados da API ou Supabase
      // setMetrics(resultado)
    }, [section]);
    
    return metrics;
  }
  ```

Estas instruções fornecem um roteiro claro para expandir o THC SOCIAL DASH, mantendo a coerência com o design e arquitetura já implementados.
