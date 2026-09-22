# Painel Integrado de Satisfação e Resultados — FESUPER 2026

Painel analítico e executivo interativo desenvolvido para visualização dos resultados da Pesquisa de Satisfação da **FESUPER 2026** (24ª Feira e Exposição Alagoana de Supermercados), evento promovido pela **Associação dos Supermercados de Alagoas (ASA)** em parceria com o **Sistema Fecomércio Sesc Senac AL**.

---

## 📊 Principais Indicadores Consolidados

- **Amostra Certificada**: 185 participantes entrevistados presencialmente (62 expositores representando 59 empresas e 123 visitantes).
- **NPS Adaptado de Fidelização**:
  - **Visitantes**: **+92 pontos** (Zona de Excelência), com média de retorno de 9,75 / 10.
  - **Expositores**: **+66 pontos** (Zona de Qualidade), com média de retorno de 9,00 / 10.
- **Efetividade Comercial**:
  - **90,3% dos expositores** fecharam negócios no evento (22,6%) ou geraram propostas potenciais (67,7%).
  - **59,0% dos visitantes** efetuaram compras ou pretendem fechar parcerias comerciais.
- **Quesitos Operacionais dos Estandes**:
  - *Destaques*: Credenciamento e Recepção (9,26 - 43 notas 10), Apoio da Organização (9,08) e Programação Técnica (9,05).
  - *Prioridade de Intervenção para 2027*: Estrutura e Montagem dos Estandes (7,89), com foco em rede elétrica dimensionada para freezers e climatização integral contínua.
- **Renovação da Base**: **59,3% dos visitantes** compareceram à feira pela primeira vez.

---

## 🛠️ Tecnologias e Arquitetura

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide Icons
- **ETL & Processamento de Dados**: Python (Pandas, OpenPyXL, regular expressions)
- **Identidade Visual**: Padrão institucional Fecomércio Alagoas (Azul Marinho `#002B55`, Azul Cobalto `#004B8D`, Dourado `#C97A00`) e FESUPER (Verde Varejo `#059669`, `#033B2E`)
- **Versão Standalone Offline**: Arquivo único `dist/painel_interativo_fesuper.html` com Chart.js, Tailwind e dados embutidos, executável com duplo clique em qualquer navegador sem necessidade de servidor ou terminal.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- Python 3.10+ (opcional, apenas para reprocessar bases brutas)

### Execução em Desenvolvimento
```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Iniciar o servidor de desenvolvimento Vite
npm run dev
```
O painel estará acessível no endereço: `http://localhost:5173/`

### Build para Produção
```bash
npm run build
```

### Reprocessamento da Base de Dados (ETL)
Caso novas planilhas sejam adicionadas em `data/`:
```bash
python scripts/process_data.py
python scripts/build_standalone.py
```

---

## 📁 Estrutura de Arquivos

```
painel-fesuper-fecomercio/
├── data/                                 # Bases brutas oficiais (.xlsx e .docx)
├── scripts/
│   ├── process_data.py                   # Script ETL de limpeza, cálculo e estruturação JSON
│   └── build_standalone.py               # Compilador do painel standalone offline
├── public/
│   └── assets/                           # Logotipos oficiais Fecomércio AL e FESUPER
├── src/
│   ├── components/
│   │   ├── Header.jsx                    # Cabeçalho institucional co-branded
│   │   ├── FilterBar.jsx                 # Barra de filtros globais reativos
│   │   ├── MetricCard.jsx                # Cartões de KPI com badges
│   │   ├── ExecutiveView.jsx             # Visão geral comparativa e síntese C-Level
│   │   ├── ExhibitorsView.jsx            # Deep-dive dos expositores com Radar dinâmico
│   │   ├── VisitorsView.jsx              # Deep-dive dos visitantes e compradores
│   │   ├── FeedbackExplorer.jsx          # Banco qualitativo com busca textual e tags
│   │   ├── StrategicPlanView.jsx         # 5 Pilares e Matriz de Priorização para 2027
│   │   └── DataGridExport.jsx            # Tabela de dados paginada com exportação CSV
│   ├── data/
│   │   └── dashboard_data.json           # Base consolidada
│   ├── utils/
│   │   └── filterData.js                 # Motor de recálculo reativo dos filtros
│   ├── App.jsx                           # Componente raiz e navegação
│   ├── main.jsx
│   └── index.css                         # Diretivas Tailwind e estilos de impressão
├── dist/
│   └── painel_interativo_fesuper.html    # Versão independente para apresentações
├── package.json
└── vite.config.js
```

---

## 📄 Licença e Instituições

Desenvolvido para apresentação executiva conjunta entre o **Sistema Fecomércio Sesc Senac Alagoas** e a **Associação dos Supermercados de Alagoas (ASA)** referente à 24ª edição da FESUPER em Arapiraca – AL.
