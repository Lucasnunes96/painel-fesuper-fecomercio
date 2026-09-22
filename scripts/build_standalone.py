import json
import base64
import os

with open('src/data/dashboard_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def get_b64(path):
    if os.path.exists(path):
        with open(path, 'rb') as img_f:
            return base64.b64encode(img_f.read()).decode('utf-8')
    return ""

logo_fec_b64 = get_b64('public/assets/logo_fecomercio.png')
logo_fes_b64 = get_b64('public/assets/logo_fesuper.png')

html_template = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Painel Integrado FESUPER 2026 | Fecomércio Alagoas & ASA</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {{
      theme: {{
        extend: {{
          colors: {{
            fecomercio: {{
              navy: '#002B55',
              blue: '#004B8D',
              gold: '#C97A00',
              amber: '#D97706',
            }},
            fesuper: {{
              darkGreen: '#033B2E',
              green: '#065F46',
              emerald: '#059669',
              coral: '#EA580C',
            }}
          }},
          fontFamily: {{
            sans: ['Inter', 'system-ui', 'sans-serif']
          }}
        }}
      }}
    }}
  </script>
  <style>
    @media print {{
      .no-print {{ display: none !important; }}
      body {{ background: white !important; color: black !important; }}
    }}
  </style>
</head>
<body class="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col">

  <!-- Header -->
  <header class="bg-gradient-to-r from-[#002B55] via-[#023e73] to-[#033B2E] text-white shadow-md sticky top-0 z-40 border-b border-blue-950/40">
    <div class="max-w-7xl mx-auto px-4 py-3.5 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="bg-white p-2 rounded-xl flex items-center justify-center h-14 w-36 sm:w-44 shadow-sm">
          <img src="data:image/png;base64,{logo_fec_b64}" alt="Fecomércio AL" class="max-h-full max-w-full object-contain">
        </div>
        <div class="h-8 w-px bg-white/20 hidden sm:block"></div>
        <div class="bg-white/10 p-1 rounded-xl border border-white/15 flex items-center justify-center h-14 w-36 sm:w-44">
          <img src="data:image/png;base64,{logo_fes_b64}" alt="FESUPER 2026" class="max-h-full max-w-full object-contain drop-shadow">
        </div>
        <div>
          <span class="bg-[#059669] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">24ª Edição • Arapiraca/AL</span>
          <h1 class="text-base sm:text-lg font-bold text-white leading-tight">Painel Integrado de Satisfação e Resultados</h1>
          <p class="text-[11px] text-slate-200">Sistema Fecomércio Sesc Senac AL & Associação dos Supermercados de Alagoas</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="exportCSV()" class="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-white/20 shadow-sm transition-all flex items-center gap-1.5">
          <span>Exportar CSV</span>
        </button>
        <button onclick="window.print()" class="bg-[#C97A00] hover:bg-amber-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5">
          <span>Imprimir Relatório</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Barra de Filtros Globais Dinâmicos -->
  <div class="bg-white border-b border-slate-200 shadow-sm sticky top-[72px] sm:top-[76px] z-30 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
      
      <div class="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
        <span>Filtros Globais:</span>
        <span id="filterCountDisplay" class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Exibindo 185 de 185 respondentes
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
        <!-- Público -->
        <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
          <label class="text-slate-500 font-medium">Público:</label>
          <select id="selFilterPublico" onchange="applyGlobalFilters()" class="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer">
            <option value="todos">Todos os Públicos (185)</option>
            <option value="expositores">Apenas Expositores (62)</option>
            <option value="visitantes">Apenas Visitantes (123)</option>
          </select>
        </div>

        <!-- NPS -->
        <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
          <label class="text-slate-500 font-medium">Nota NPS:</label>
          <select id="selFilterNps" onchange="applyGlobalFilters()" class="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer">
            <option value="todos">Todas as Notas</option>
            <option value="Promotor">Promotores (Notas 9-10)</option>
            <option value="Neutro">Neutros (Notas 7-8)</option>
            <option value="Detrator">Detratores (Notas 0-6)</option>
          </select>
        </div>

        <!-- Origem -->
        <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
          <label class="text-slate-500 font-medium">Origem:</label>
          <select id="selFilterOrigem" onchange="applyGlobalFilters()" class="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer">
            <option value="todos">Todas as Regiões</option>
            <option value="Arapiraca">Arapiraca (Sede)</option>
            <option value="Maceió">Maceió (Capital)</option>
            <option value="Demais Municípios de AL">Demais Municípios de AL</option>
            <option value="Outro Estado (PE/SE/etc)">Outros Estados</option>
          </select>
        </div>

        <!-- Reset -->
        <button id="btnResetFilters" onclick="resetGlobalFilters()" class="hidden px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200">
          Limpar Filtros
        </button>
      </div>

    </div>
  </div>

  <!-- Navigation Tabs -->
  <nav class="bg-white border-b border-slate-200 shadow-sm no-print">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 flex space-x-2 overflow-x-auto py-2.5">
      <button onclick="switchTab('executiva')" id="tab-btn-executiva" class="tab-btn px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap bg-[#002B55] text-white shadow-sm">
        Visão Executiva & Síntese
      </button>
      <button onclick="switchTab('expositores')" id="tab-btn-expositores" class="tab-btn px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-slate-600 hover:bg-slate-100">
        Expositores (B2B) <span id="tabCountExp" class="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded-full ml-1">62</span>
      </button>
      <button onclick="switchTab('visitantes')" id="tab-btn-visitantes" class="tab-btn px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-slate-600 hover:bg-slate-100">
        Visitantes (Varejo) <span id="tabCountVis" class="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded-full ml-1">123</span>
      </button>
      <button onclick="switchTab('voz_cliente')" id="tab-btn-voz_cliente" class="tab-btn px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-slate-600 hover:bg-slate-100">
        Depoimentos & Críticas <span id="tabCountFb" class="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded-full ml-1">{len(data['feedbacks'])}</span>
      </button>
      <button onclick="switchTab('recomendacoes')" id="tab-btn-recomendacoes" class="tab-btn px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-slate-600 hover:bg-slate-100">
        Recomendações Estruturais
      </button>
      <button onclick="switchTab('dados')" id="tab-btn-dados" class="tab-btn px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-slate-600 hover:bg-slate-100">
        Tabela de Dados & Auditoria
      </button>
    </div>
  </nav>

  <!-- Main Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
    
    <!-- ABA 1: VISÃO EXECUTIVA -->
    <section id="tab-executiva" class="tab-pane space-y-6">
      
      <div class="bg-gradient-to-r from-[#002B55] via-[#023e73] to-[#033B2E] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span class="bg-[#059669] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">Relatório Oficial Homologado</span>
          <h2 class="text-xl font-bold mt-2">Diagnóstico Executivo de Satisfação & Resultados FESUPER 2026</h2>
          <p class="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
            A pesquisa primária reuniu 185 respostas (62 expositores e 123 visitantes). Os dados abaixo reagem automaticamente aos filtros selecionados.
          </p>
        </div>
        <div class="bg-white/10 p-3 rounded-xl border border-white/20 text-center shrink-0">
          <p class="text-xs text-slate-300">Respondentes Filtrados</p>
          <p id="topTotalCard" class="text-3xl font-extrabold text-white">185</p>
          <p class="text-[10px] text-amber-300 font-semibold">10 e 11 de Setembro</p>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-2xl border-l-4 border-l-[#059669] border border-slate-200 shadow-sm">
          <p class="text-xs font-semibold text-slate-500 uppercase">NPS Adaptado - Visitantes</p>
          <div class="flex items-baseline gap-2 mt-1">
            <span id="kpiVisNps" class="text-3xl font-extrabold text-slate-900">+92</span>
            <span id="kpiVisZona" class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Zona de Excelência</span>
          </div>
          <p id="kpiVisSub" class="text-xs text-slate-500 mt-1">93,4% Promotores • Média 9.75</p>
        </div>

        <div class="bg-white p-5 rounded-2xl border-l-4 border-l-[#004B8D] border border-slate-200 shadow-sm">
          <p class="text-xs font-semibold text-slate-500 uppercase">NPS Adaptado - Expositores</p>
          <div class="flex items-baseline gap-2 mt-1">
            <span id="kpiExpNps" class="text-3xl font-extrabold text-slate-900">+66</span>
            <span id="kpiExpZona" class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Zona de Qualidade</span>
          </div>
          <p id="kpiExpSub" class="text-xs text-slate-500 mt-1">75,8% Promotores • Média 9.00</p>
        </div>

        <div class="bg-white p-5 rounded-2xl border-l-4 border-l-[#C97A00] border border-slate-200 shadow-sm">
          <p class="text-xs font-semibold text-slate-500 uppercase">Experiência Geral Média</p>
          <div class="flex items-baseline gap-2 mt-1">
            <span id="kpiMeanExp" class="text-3xl font-extrabold text-slate-900">9.55</span>
            <span class="text-xs text-slate-500 font-bold">/ 10</span>
          </div>
          <p id="kpiMeanExpSub" class="text-xs text-slate-500 mt-1">Visitantes: 9.55 | Expositores: 9.05</p>
        </div>

        <div class="bg-white p-5 rounded-2xl border-l-4 border-l-[#059669] border border-slate-200 shadow-sm">
          <p class="text-xs font-semibold text-slate-500 uppercase">Efetividade Comercial B2B</p>
          <div class="flex items-baseline gap-2 mt-1">
            <span id="kpiCommercial" class="text-3xl font-extrabold text-slate-900">90.3%</span>
            <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Alto Retorno</span>
          </div>
          <p id="kpiCommercialSub" class="text-xs text-slate-500 mt-1">22,6% fechados + 67,7% potencial futuro</p>
        </div>
      </div>

      <!-- Comparativo e NPS -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide">Comparativo Expositores vs Visitantes</h3>
          <p class="text-xs text-slate-500">Passe o mouse nas barras para inspecionar os detalhes qualitativos</p>
          <div class="h-64">
            <canvas id="chartComparativo"></canvas>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide">Distribuição NPS: Promotores, Neutros e Detratores</h3>
          <p class="text-xs text-slate-500">Proporção relativa entre os participantes filtrados</p>
          <div class="h-64 flex items-center justify-center">
            <canvas id="chartNpsDonut"></canvas>
          </div>
        </div>
      </div>

    </section>

    <!-- ABA 2: EXPOSITORES -->
    <section id="tab-expositores" class="tab-pane hidden space-y-6">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Radar Dinâmico -->
        <div class="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide">Mapa de Satisfação Operacional (Radar Dinâmico)</h3>
              <p class="text-xs text-slate-500">Calculado a partir das respostas dos expositores filtrados</p>
            </div>
            <span class="text-[10px] font-bold bg-slate-100 border border-slate-200 px-2 py-1 rounded-md text-slate-600">Passe o mouse nos vértices</span>
          </div>
          <div class="h-80 w-full flex items-center justify-center">
            <canvas id="chartRadarExpositores"></canvas>
          </div>
        </div>

        <!-- Lista Interativa dos 9 Quesitos -->
        <div class="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide">Desempenho dos 9 Quesitos Operacionais</h3>
            <p class="text-xs text-slate-500 mt-0.5">Clique em qualquer item para ler a justificativa qualitativa</p>
            
            <div id="dimListContainer" class="space-y-2 mt-3 max-h-[340px] overflow-y-auto pr-1"></div>
          </div>

          <div id="dimQualitativeBox" class="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-800 space-y-1">
            <p class="font-bold text-blue-900" id="dimTitleDisplay">Estrutura e Montagem dos estandes</p>
            <p class="italic text-slate-700" id="dimQuoteDisplay">"Queda de energia nos freezers e atrasos de montadores no 1º dia; requer subestação própria."</p>
            <p class="text-[10px] text-slate-500 text-right" id="dimAuthorDisplay">— Indústria de Alimentos e Congelados</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide">Segmentos de Atuação</h3>
          <div class="h-64"><canvas id="chartSegmentos"></canvas></div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide">Contatos Comerciais Gerados</h3>
          <div class="h-64"><canvas id="chartContatos"></canvas></div>
        </div>
      </div>

    </section>

    <!-- ABA 3: VISITANTES -->
    <section id="tab-visitantes" class="tab-pane hidden space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide">Perfil Declarado dos Visitantes</h3>
          <div class="h-64"><canvas id="chartPerfilVisitantes"></canvas></div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide">Origem Territorial dos Visitantes</h3>
          <div class="h-64"><canvas id="chartOrigemVisitantes"></canvas></div>
        </div>
      </div>
    </section>

    <!-- ABA 4: VOZ DO CLIENTE -->
    <section id="tab-voz_cliente" class="tab-pane hidden space-y-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide">Banco de Depoimentos e Críticas Literais</h3>
            <p class="text-xs text-slate-500">Consulte os relatos filtrados</p>
          </div>
          <input 
            type="text" 
            id="searchFeedbackInput" 
            onkeyup="filterFeedbacks()" 
            placeholder="Pesquisar termo (ex: ar, energia, freezer)..."
            class="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl w-full md:w-72 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
        </div>

        <div id="tagPillsContainer" class="flex flex-wrap gap-2 pt-2 border-t border-slate-100"></div>
      </div>

      <div id="feedbackListContainer" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
    </section>

    <!-- ABA 5: RECOMENDAÇÕES 2027 -->
    <section id="tab-recomendacoes" class="tab-pane hidden space-y-6">
      <div class="bg-gradient-to-r from-[#002B55] via-[#023e73] to-[#033B2E] rounded-2xl p-6 text-white shadow-md">
        <span class="bg-[#C97A00] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">Planejamento Estrutural</span>
        <h2 class="text-xl font-bold mt-2">Os 5 Pilares de Recomendações: FESUPER 2027</h2>
        <p class="text-xs text-slate-200 mt-1 max-w-3xl">
          Diretrizes oficiais homologadas pelo comitê técnico da Fecomércio Alagoas e Associação dos Supermercados de Alagoas.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-5 rounded-2xl border border-red-200 border-l-4 border-l-red-600 shadow-sm space-y-2">
          <h4 class="font-bold text-sm text-slate-900">1. Infraestrutura e Operação Física</h4>
          <ul class="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
            <li>Dimensionamento prévio da rede com gerador dedicado para freezers e refrigeração pesada.</li>
            <li>Climatização contínua de alta capacidade em todo o pavilhão.</li>
            <li>Planta integrada em pavilhão único sem divisão isolada de blocos.</li>
            <li>Cronograma antecipado de montagem com entregas 24h antes.</li>
          </ul>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-blue-200 border-l-4 border-l-blue-600 shadow-sm space-y-2">
          <h4 class="font-bold text-sm text-slate-900">2. Atração de Público e Divulgação</h4>
          <ul class="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
            <li>Campanha direta dirigida a mercadinhos, padarias e mercearias do interior.</li>
            <li>Caravanas de compradores articuladas com associações do Agreste e Sertão.</li>
            <li>Crachás inteligentes com diferenciação visual de perfil para facilitar negócios.</li>
          </ul>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-emerald-200 border-l-4 border-l-emerald-600 shadow-sm space-y-2">
          <h4 class="font-bold text-sm text-slate-900">3. Efetividade Comercial e Leads</h4>
          <ul class="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
            <li>Captura voluntária de leads nos estandes via QR Code no crachá.</li>
            <li>Rodadas estruturadas de negócios entre indústrias e compradores.</li>
            <li>Pesquisa de follow-up pós-evento (60-90 dias) para quantificar vendas geradas.</li>
          </ul>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-amber-200 border-l-4 border-l-amber-600 shadow-sm space-y-2">
          <h4 class="font-bold text-sm text-slate-900">4. Metodologia de Satisfação</h4>
          <ul class="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
            <li>Padronização em escalas de 0 a 10 (eliminando faixas agrupadas).</li>
            <li>Inclusão do NPS formal de recomendação do evento a parceiros.</li>
            <li>Coleta distribuída nos três dias da programação.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ABA 6: TABELA DE DADOS -->
    <section id="tab-dados" class="tab-pane hidden space-y-4">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide">Base de Dados Completa & Auditoria</h3>
            <p class="text-xs text-slate-500">Exibindo registros correspondentes aos filtros selecionados</p>
          </div>
          <div class="flex gap-2">
            <button onclick="setTableDataset('expositores')" id="btnTableExp" class="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#002B55] text-white">Expositores</button>
            <button onclick="setTableDataset('visitantes')" id="btnTableVis" class="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-700">Visitantes</button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse" id="mainDataTable"></table>
        </div>
      </div>
    </section>

  </main>

  <footer class="bg-slate-900 text-slate-400 text-xs py-6 mt-12 border-t border-slate-800 text-center space-y-1">
    <p class="text-slate-300 font-bold">Sistema Fecomércio Sesc Senac AL & Associação dos Supermercados de Alagoas (ASA)</p>
    <p>FESUPER 2026 • Arapiraca - AL • 24ª Edição</p>
  </footer>

  <script>
    const RAW_DATA = {json.dumps(data, ensure_ascii=False)};
    let activeFilters = {{ publico: 'todos', npsCat: 'todos', origem: 'todos' }};
    let currentFilteredData = null;
    let chartInstances = {{}};

    const OP_MAP = {{
      'Credenciamento e recepção': 'credenciamento',
      'Apoio prestado pela organização': 'apoio_organizacao',
      'Programação da feira': 'programacao',
      'Experiência geral da empresa': 'experiencia_geral',
      'Limpeza, conforto e segurança': 'limpeza_seguranca',
      'Organização geral': 'organizacao',
      'Quantidade e perfil dos visitantes': 'perfil_visitantes',
      'Comunicação antes e durante o evento': 'comunicacao',
      'Estrutura e Montagem dos estades': 'estrutura_montagem'
    }};

    function switchTab(tabId) {{
      document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
      const activeEl = document.getElementById('tab-' + tabId);
      if (activeEl) activeEl.classList.remove('hidden');

      document.querySelectorAll('.tab-btn').forEach(btn => {{
        btn.classList.remove('bg-[#002B55]', 'text-white', 'shadow-sm');
        btn.classList.add('text-slate-600');
      }});
      const activeBtn = document.getElementById('tab-btn-' + tabId);
      if (activeBtn) {{
        activeBtn.classList.add('bg-[#002B55]', 'text-white', 'shadow-sm');
        activeBtn.classList.remove('text-slate-600');
      }}
    }}

    function resetGlobalFilters() {{
      document.getElementById('selFilterPublico').value = 'todos';
      document.getElementById('selFilterNps').value = 'todos';
      document.getElementById('selFilterOrigem').value = 'todos';
      applyGlobalFilters();
    }}

    function applyGlobalFilters() {{
      const p = document.getElementById('selFilterPublico').value;
      const n = document.getElementById('selFilterNps').value;
      const o = document.getElementById('selFilterOrigem').value;
      activeFilters = {{ publico: p, npsCat: n, origem: o }};

      const isFiltered = p !== 'todos' || n !== 'todos' || o !== 'todos';
      document.getElementById('btnResetFilters').style.display = isFiltered ? 'inline-block' : 'none';

      // Filtrar expositores
      const fExp = (p === 'visitantes') ? [] : RAW_DATA.registros_expositores.filter(r => {{
        if (n !== 'todos' && r.nps_categoria !== n) return false;
        if (o !== 'todos' && r.origem_macro !== o) return false;
        return true;
      }});

      // Filtrar visitantes
      const fVis = (p === 'expositores') ? [] : RAW_DATA.registros_visitantes.filter(r => {{
        if (n !== 'todos' && r.nps_categoria !== n) return false;
        if (o !== 'todos' && r.municipio_macro !== o) return false;
        return true;
      }});

      const expTotal = fExp.length;
      const visTotal = fVis.length;
      const totalFiltered = expTotal + visTotal;

      document.getElementById('filterCountDisplay').innerText = `Exibindo ${{totalFiltered}} de 185 respondentes`;
      document.getElementById('topTotalCard').innerText = totalFiltered;
      document.getElementById('tabCountExp').innerText = expTotal;
      document.getElementById('tabCountVis').innerText = visTotal;

      // Recalcular KPIs Expositores
      let expNps = 0, expProm = 0, expDet = 0, expScoreSum = 0, expScoreCount = 0, expRetSum = 0, expRetCount = 0, expDealsDone = 0, expDealsTotal = 0;
      fExp.forEach(r => {{
        if (r.nps_categoria === 'Promotor') expProm++;
        if (r.nps_categoria === 'Detrator') expDet++;
        if (r.experiencia_geral !== null) {{ expScoreSum += Number(r.experiencia_geral); expScoreCount++; }}
        if (r.intencao_retorno_score !== null) {{ expRetSum += Number(r.intencao_retorno_score); expRetCount++; }}
        const pot = (r.potencial_negocios||'').toLowerCase();
        if (pot.includes('já foram') || pot.includes('ja foram')) {{ expDealsDone++; expDealsTotal++; }}
        else if (pot.includes('oportunidades')) expDealsTotal++;
      }});
      if (expTotal > 0) expNps = Math.round(((expProm - expDet) / expTotal) * 100);
      const expMeanExp = expScoreCount > 0 ? (expScoreSum / expScoreCount).toFixed(2) : 'N/A';
      const expMeanRet = expRetCount > 0 ? (expRetSum / expRetCount).toFixed(2) : 'N/A';
      const expDealsPct = expTotal > 0 ? ((expDealsTotal / expTotal) * 100).toFixed(1) : 'N/A';

      document.getElementById('kpiExpNps').innerText = expTotal > 0 ? (expNps > 0 ? '+' + expNps : expNps) : 'N/A';
      document.getElementById('kpiExpSub').innerText = expTotal > 0 ? `${{((expProm/expTotal)*100).toFixed(1)}}% Promotores • Média ${{expMeanRet}}` : 'Sem expositores no filtro';
      document.getElementById('kpiCommercial').innerText = expTotal > 0 ? expDealsPct + '%' : 'N/A';

      // Recalcular KPIs Visitantes
      let visNps = 0, visProm = 0, visDet = 0, visScoreSum = 0, visScoreCount = 0, visRetSum = 0, visRetCount = 0, visDealsTotal = 0;
      fVis.forEach(r => {{
        if (r.nps_categoria === 'Promotor') visProm++;
        if (r.nps_categoria === 'Detrator') visDet++;
        if (r.experiencia_geral !== null) {{ visScoreSum += Number(r.experiencia_geral); visScoreCount++; }}
        if (r.intencao_retorno_score !== null) {{ visRetSum += Number(r.intencao_retorno_score); visRetCount++; }}
        const d = (r.realizou_negocio||'').toLowerCase();
        if (d.includes('já realizei') || d.includes('pretendo')) visDealsTotal++;
      }});
      if (visTotal > 0) visNps = Math.round(((visProm - visDet) / visTotal) * 100);
      const visMeanExp = visScoreCount > 0 ? (visScoreSum / visScoreCount).toFixed(2) : 'N/A';
      const visMeanRet = visRetCount > 0 ? (visRetSum / visRetCount).toFixed(2) : 'N/A';

      document.getElementById('kpiVisNps').innerText = visTotal > 0 ? (visNps > 0 ? '+' + visNps : visNps) : 'N/A';
      document.getElementById('kpiVisSub').innerText = visTotal > 0 ? `${{((visProm/visTotal)*100).toFixed(1)}}% Promotores • Média ${{visMeanRet}}` : 'Sem visitantes no filtro';
      document.getElementById('kpiMeanExp').innerText = (visTotal > 0 ? visMeanExp : expMeanExp) !== 'N/A' ? (visTotal > 0 ? visMeanExp : expMeanExp) : 'N/A';

      // Recalcular Dimensões Operacionais Expositores
      const updatedDims = RAW_DATA.dimensoes_operacionais.map(dim => {{
        const fld = OP_MAP[dim.dimensao];
        let sum = 0, cnt = 0;
        fExp.forEach(r => {{
          if (r[fld] !== null && !isNaN(r[fld])) {{ sum += Number(r[fld]); cnt++; }}
        }});
        return {{
          ...dim,
          nota: cnt > 0 ? Number((sum / cnt).toFixed(2)) : (expTotal === 0 ? 0 : dim.nota),
          respostas_validas: cnt
        }};
      }});

      // Atualizar Lista de Dimensões
      const dimContainer = document.getElementById('dimListContainer');
      dimContainer.innerHTML = updatedDims.map((d, idx) => `
        <div onclick="selectStandaloneDim(${{idx}})" class="dim-row p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-all" id="dim-row-${{idx}}">
          <div class="flex justify-between text-xs">
            <span class="font-bold text-slate-800">${{d.dimensao}}</span>
            <span class="font-extrabold text-slate-900">${{d.nota.toFixed(2)}} / 10</span>
          </div>
          <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div class="h-full ${{d.nota >= 9 ? 'bg-emerald-600' : d.nota >= 8.5 ? 'bg-blue-600' : 'bg-amber-500'}}" style="width: ${{d.nota * 10}}%"></div>
          </div>
        </div>
      `).join('');

      // Atualizar Gráficos
      if (chartInstances.comparativo) {{
        chartInstances.comparativo.data.datasets[0].data = [
          expMeanExp !== 'N/A' ? Number(expMeanExp) : 0,
          expMeanRet !== 'N/A' ? Number(expMeanRet) : 0,
          expTotal > 0 ? Number(((expDealsDone / expTotal) * 100).toFixed(1)) : 0,
          expTotal > 0 ? Number(expDealsPct) : 0
        ];
        chartInstances.comparativo.data.datasets[1].data = [
          visMeanExp !== 'N/A' ? Number(visMeanExp) : 0,
          visMeanRet !== 'N/A' ? Number(visMeanRet) : 0,
          visTotal > 0 ? Number(((visDealsTotal / visTotal) * 100).toFixed(1)) : 0,
          visTotal > 0 ? Number(((visDealsTotal / visTotal) * 100).toFixed(1)) : 0
        ];
        chartInstances.comparativo.update();
      }}

      if (chartInstances.radar) {{
        chartInstances.radar.data.datasets[0].data = updatedDims.map(d => d.nota);
        chartInstances.radar.update();
      }}

      if (chartInstances.npsDonut) {{
        const promTotal = expProm + visProm;
        const detTotal = expDet + visDet;
        const neuTotal = Math.max(totalFiltered - promTotal - detTotal, 0);
        chartInstances.npsDonut.data.datasets[0].data = [promTotal, neuTotal, detTotal];
        chartInstances.npsDonut.update();
      }}

      // Feedbacks filtrados
      const activeIds = new Set([...fExp.map(e => e.id), ...fVis.map(v => v.id)]);
      currentFilteredData = {{ fExp, fVis, activeIds, updatedDims }};
      filterFeedbacks();
      renderTable();
    }}

    function exportCSV() {{
      const expList = currentFilteredData ? currentFilteredData.fExp : RAW_DATA.registros_expositores;
      const visList = currentFilteredData ? currentFilteredData.fVis : RAW_DATA.registros_visitantes;

      let csv = "\\uFEFFID;Tipo;Empresa/Perfil;Segmento/Motivo;Origem;Experiência Geral;Retorno NPS;Categoria NPS;Crítica;Sugestão\\r\\n";
      expList.forEach(r => {{
        csv += `${{r.id}};Expositor;"${{r.empresa}}";"${{r.segmento}}";"${{r.origem_macro}}";${{r.experiencia_geral||''}};${{r.intencao_retorno_score||''}};${{r.nps_categoria}};"${{(r.abaixo_expectativas||'').replace(/"/g, '""')}}";"${{(r.sugestao_melhoria||'').replace(/"/g, '""')}}"\\r\\n`;
      }});
      visList.forEach(r => {{
        csv += `${{r.id}};Visitante;"${{r.perfil_participante}}";"${{r.motivo_principal}}";"${{r.municipio_macro}}";${{r.experiencia_geral||''}};${{r.intencao_retorno_score||''}};${{r.nps_categoria}};"${{(r.abaixo_expectativas||'').replace(/"/g, '""')}}";"${{(r.sugestao_melhoria||'').replace(/"/g, '""')}}"\\r\\n`;
      }});
      const blob = new Blob([csv], {{ type: 'text/csv;charset=utf-8;' }});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "pesquisa_satisfacao_fesuper_2026.csv";
      a.click();
    }}

    function selectStandaloneDim(idx) {{
      const d = currentFilteredData ? currentFilteredData.updatedDims[idx] : RAW_DATA.dimensoes_operacionais[idx];
      document.getElementById('dimTitleDisplay').innerText = d.dimensao + ' (Nota: ' + d.nota.toFixed(2) + ')';
      document.getElementById('dimQuoteDisplay').innerText = '"' + d.citacao_destaque + '"';
      document.getElementById('dimAuthorDisplay').innerText = '— ' + d.comentario_autor;
      document.querySelectorAll('.dim-row').forEach(r => r.classList.remove('bg-blue-100', 'border-blue-400'));
      const activeRow = document.getElementById('dim-row-' + idx);
      if (activeRow) activeRow.classList.add('bg-blue-100', 'border-blue-400');
    }}

    let currentTag = 'todas';
    function setFeedbackTag(tag) {{
      currentTag = tag;
      document.querySelectorAll('.fb-tag-btn').forEach(btn => {{
        if (btn.dataset.tag === tag) {{
          btn.className = "fb-tag-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#002B55] text-white";
        }} else {{
          btn.className = "fb-tag-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200";
        }}
      }});
      filterFeedbacks();
    }}

    function filterFeedbacks() {{
      const term = (document.getElementById('searchFeedbackInput').value || '').toLowerCase();
      const container = document.getElementById('feedbackListContainer');
      const activeIds = currentFilteredData ? currentFilteredData.activeIds : null;

      const filtered = RAW_DATA.feedbacks.filter(fb => {{
        if (activeIds && !activeIds.has(fb.id)) return false;
        if (currentTag !== 'todas' && !fb.tags.includes(currentTag)) return false;
        if (term && !fb.texto.toLowerCase().includes(term) && !fb.empresa_ou_perfil.toLowerCase().includes(term)) return false;
        return true;
      }});

      document.getElementById('tabCountFb').innerText = filtered.length;

      container.innerHTML = filtered.map(fb => {{
        const isNeg = fb.tipo_comentario.includes('Abaixo');
        return `
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div class="flex justify-between items-center text-xs mb-2">
                <span class="font-bold text-slate-800">${{fb.tipo}}: ${{fb.empresa_ou_perfil}}</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${{isNeg ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}}">
                  ${{isNeg ? 'Abaixo da Expectativa' : 'Sugestão'}}
                </span>
              </div>
              <p class="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                "${{fb.texto}}"
              </p>
            </div>
            <div class="flex justify-between items-center text-[10px] pt-2 border-t border-slate-100">
              <span class="font-semibold text-slate-500">${{fb.tags.join(', ')}}</span>
              <span class="font-bold text-slate-800">Nota Retorno: ${{fb.nota_retorno !== null ? fb.nota_retorno : '-'}}</span>
            </div>
          </div>
        `;
      }}).join('');
    }}

    let currentTableDs = 'expositores';
    function setTableDataset(ds) {{
      currentTableDs = ds;
      document.getElementById('btnTableExp').className = ds === 'expositores' ? "px-3 py-1.5 text-xs font-bold rounded-lg bg-[#002B55] text-white" : "px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-700";
      document.getElementById('btnTableVis').className = ds === 'visitantes' ? "px-3 py-1.5 text-xs font-bold rounded-lg bg-[#059669] text-white" : "px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-700";
      renderTable();
    }}

    function renderTable() {{
      const table = document.getElementById('mainDataTable');
      const expList = currentFilteredData ? currentFilteredData.fExp : RAW_DATA.registros_expositores;
      const visList = currentFilteredData ? currentFilteredData.fVis : RAW_DATA.registros_visitantes;

      if (currentTableDs === 'expositores') {{
        table.innerHTML = `
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
              <th class="py-2.5 px-3">ID</th>
              <th class="py-2.5 px-3">Empresa</th>
              <th class="py-2.5 px-3">Segmento</th>
              <th class="py-2.5 px-3">Origem</th>
              <th class="py-2.5 px-3 text-center">Exp</th>
              <th class="py-2.5 px-3 text-center">Retorno</th>
              <th class="py-2.5 px-3">NPS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${{expList.map(r => `
              <tr class="hover:bg-slate-50">
                <td class="py-2 px-3 font-mono text-[11px] text-slate-400">${{r.id}}</td>
                <td class="py-2 px-3 font-semibold text-slate-900">${{r.empresa}}</td>
                <td class="py-2 px-3 text-slate-600">${{r.segmento}}</td>
                <td class="py-2 px-3 text-slate-600">${{r.origem_macro}}</td>
                <td class="py-2 px-3 text-center font-bold">${{r.experiencia_geral||'-'}}</td>
                <td class="py-2 px-3 text-center font-bold">${{r.intencao_retorno_score||'-'}}</td>
                <td class="py-2 px-3 font-bold text-slate-700">${{r.nps_categoria}}</td>
              </tr>
            `).join('')}}
          </tbody>
        `;
      }} else {{
        table.innerHTML = `
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
              <th class="py-2.5 px-3">ID</th>
              <th class="py-2.5 px-3">Perfil</th>
              <th class="py-2.5 px-3">Município</th>
              <th class="py-2.5 px-3">1ª Vez?</th>
              <th class="py-2.5 px-3 text-center">Exp</th>
              <th class="py-2.5 px-3 text-center">Retorno</th>
              <th class="py-2.5 px-3">NPS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${{visList.map(r => `
              <tr class="hover:bg-slate-50">
                <td class="py-2 px-3 font-mono text-[11px] text-slate-400">${{r.id}}</td>
                <td class="py-2 px-3 font-semibold text-slate-900">${{r.perfil_participante}}</td>
                <td class="py-2 px-3 text-slate-600">${{r.municipio_macro}}</td>
                <td class="py-2 px-3 text-slate-600">${{r.primeira_vez}}</td>
                <td class="py-2 px-3 text-center font-bold">${{r.experiencia_geral||'-'}}</td>
                <td class="py-2 px-3 text-center font-bold">${{r.intencao_retorno_score||'-'}}</td>
                <td class="py-2 px-3 font-bold text-slate-700">${{r.nps_categoria}}</td>
              </tr>
            `).join('')}}
          </tbody>
        `;
      }}
    }}

    window.addEventListener('load', () => {{
      // Inicializar tags de feedback
      const tagPills = document.getElementById('tagPillsContainer');
      tagPills.innerHTML = `
        <button onclick="setFeedbackTag('todas')" class="fb-tag-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#002B55] text-white" data-tag="todas">
          Todas (${{RAW_DATA.feedbacks.length}})
        </button>
        ${{RAW_DATA.tags_qualitativas.map(tg => `
          <button onclick="setFeedbackTag('${{tg.tag}}')" class="fb-tag-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200" data-tag="${{tg.tag}}">
            ${{tg.tag}} (${{tg.count}})
          </button>
        `).join('')}}
      `;

      // Chart 1: Comparativo
      chartInstances.comparativo = new Chart(document.getElementById('chartComparativo'), {{
        type: 'bar',
        data: {{
          labels: ['Experiência Geral', 'Intenção de Retorno', 'Negócios Concluídos (%)', 'Negócios Potenciais (%)'],
          datasets: [
            {{ label: 'Expositores', data: [9.05, 9.00, 22.6, 90.3], backgroundColor: '#004B8D', borderRadius: 6 }},
            {{ label: 'Visitantes', data: [9.55, 9.75, 32.0, 59.0], backgroundColor: '#059669', borderRadius: 6 }}
          ]
        }},
        options: {{ 
          responsive: true, 
          maintainAspectRatio: false,
          plugins: {{
            tooltip: {{
              callbacks: {{
                afterBody: function(items) {{
                  const label = items[0].label;
                  if (label === 'Experiência Geral') return 'Expositores: foco em custos/montagem\\nVisitantes: 73% deram nota máxima (10)';
                  if (label === 'Intenção de Retorno') return 'Expositores: NPS +66 (Fidelização)\\nVisitantes: NPS +92 (Excelência)';
                  if (label === 'Negócios Concluídos (%)') return 'Expositores: 22,6% contratos no estande\\nVisitantes: 32% compras efetuadas';
                  return 'Expositores: 90,3% resultado efetivo/potencial\\nVisitantes: 59% compras/parcerias';
                }}
              }}
            }}
          }}
        }}
      }});

      // Chart 2: NPS Donut
      chartInstances.npsDonut = new Chart(document.getElementById('chartNpsDonut'), {{
        type: 'doughnut',
        data: {{
          labels: ['Promotores (9-10)', 'Neutros (7-8)', 'Detratores (0-6)'],
          datasets: [{{
            data: [161, 15, 8],
            backgroundColor: ['#059669', '#D97706', '#DC2626']
          }}]
        }},
        options: {{ responsive: true, maintainAspectRatio: false }}
      }});

      // Chart 3: Radar Dinâmico Expositores
      chartInstances.radar = new Chart(document.getElementById('chartRadarExpositores'), {{
        type: 'radar',
        data: {{
          labels: RAW_DATA.radar_data.map(r => r.subject),
          datasets: [{{
            label: 'Média das Empresas',
            data: RAW_DATA.radar_data.map(r => r.nota),
            backgroundColor: 'rgba(5, 150, 105, 0.25)',
            borderColor: '#059669',
            pointBackgroundColor: '#004B8D',
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#D97706',
            pointHoverBorderColor: '#ffffff',
            pointRadius: 4,
            pointHoverRadius: 7
          }}]
        }},
        options: {{
          responsive: true,
          maintainAspectRatio: false,
          scales: {{
            r: {{
              min: 0,
              max: 10,
              ticks: {{ stepSize: 2, font: {{ size: 9 }} }},
              pointLabels: {{ font: {{ size: 10, weight: 'bold' }} }}
            }}
          }},
          plugins: {{
            tooltip: {{
              callbacks: {{
                afterLabel: function(context) {{
                  const item = RAW_DATA.radar_data[context.dataIndex];
                  return [
                    'Respostas: ' + item.respostas + ' (' + item.pct_10 + '% nota 10)',
                    'Relato: "' + item.citacao + '"'
                  ];
                }}
              }}
            }}
          }}
        }}
      }});

      // Chart 4: Segmentos
      chartInstances.segmentos = new Chart(document.getElementById('chartSegmentos'), {{
        type: 'bar',
        data: {{
          labels: {json.dumps([s['name'] for s in data['segmentos_expositores']], ensure_ascii=False)},
          datasets: [{{
            label: 'Empresas',
            data: {json.dumps([s['count'] for s in data['segmentos_expositores']])},
            backgroundColor: '#004B8D',
            borderRadius: 6
          }}]
        }},
        options: {{ indexAxis: 'y', responsive: true, maintainAspectRatio: false }}
      }});

      // Chart 5: Contatos
      chartInstances.contatos = new Chart(document.getElementById('chartContatos'), {{
        type: 'bar',
        data: {{
          labels: {json.dumps([c['name'] for c in data['contatos_expositores']], ensure_ascii=False)},
          datasets: [{{
            label: 'Empresas',
            data: {json.dumps([c['count'] for c in data['contatos_expositores']])},
            backgroundColor: '#059669',
            borderRadius: 6
          }}]
        }},
        options: {{ responsive: true, maintainAspectRatio: false }}
      }});

      // Chart 6: Perfil Visitantes
      chartInstances.perfilVis = new Chart(document.getElementById('chartPerfilVisitantes'), {{
        type: 'bar',
        data: {{
          labels: {json.dumps([p['name'] for p in data['perfil_visitantes']], ensure_ascii=False)},
          datasets: [{{
            label: 'Visitantes',
            data: {json.dumps([p['count'] for p in data['perfil_visitantes']])},
            backgroundColor: ['#059669', '#004B8D', '#D97706', '#0284C7', '#64748B', '#475569'],
            borderRadius: 6
          }}]
        }},
        options: {{ indexAxis: 'y', responsive: true, maintainAspectRatio: false }}
      }});

      // Chart 7: Origem Visitantes
      chartInstances.origemVis = new Chart(document.getElementById('chartOrigemVisitantes'), {{
        type: 'bar',
        data: {{
          labels: {json.dumps([o['name'] for o in data['origem_visitantes']], ensure_ascii=False)},
          datasets: [{{
            label: 'Visitantes',
            data: {json.dumps([o['count'] for o in data['origem_visitantes']])},
            backgroundColor: '#004B8D',
            borderRadius: 6
          }}]
        }},
        options: {{ responsive: true, maintainAspectRatio: false }}
      }});

      applyGlobalFilters();
    }});
  </script>
</body>
</html>
'''

os.makedirs('dist', exist_ok=True)
with open('dist/painel_interativo_fesuper.html', 'w', encoding='utf-8') as f:
    f.write(html_template)

print("Standalone HTML atualizado com sistema reativo de filtros globais em dist/painel_interativo_fesuper.html")
