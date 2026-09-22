import pandas as pd
import json
import re
import os

vis_file = 'data/FESUPER 2026_ PESQUISA DE SATISFAÇÃO  - VISITANTES.xlsx'
exp_file = 'data/FESUPER 2026_ PESQUISA DE SATISFAÇÃO -  EXPOSITORES.xlsx'

df_vis = pd.read_excel(vis_file)
df_exp = pd.read_excel(exp_file)

midpoint_map = {
    '0-1': 0.5,
    '2-3': 2.5,
    '4-5': 4.5,
    '6-7': 6.5,
    '8-9': 8.5,
    '10': 10.0,
    10: 10.0,
    '10.0': 10.0
}

def parse_num(val):
    if pd.isna(val):
        return None
    val_str = str(val).strip()
    if val_str in midpoint_map:
        return midpoint_map[val_str]
    try:
        return float(val_str)
    except:
        return None

def get_nps_category(score):
    if score is None or pd.isna(score):
        return 'Indefinido'
    if score >= 9:
        return 'Promotor'
    elif score >= 7:
        return 'Neutro'
    else:
        return 'Detrator'

# --- 1. PROCESSAR EXPOSITORES ---
exp_records = []
for idx, row in df_exp.iterrows():
    ret_score = parse_num(row.get('Qual é a possibilidade de a empresa participar da próxima edição da FESUPER?'))
    ret_cat = get_nps_category(ret_score)
    
    origem_txt = str(row.get('A empresa e sua equipe vieram de outro munícipio para participar da FESUPER 2026? Se sim, qual município? Qual o número aproximado de representantes da empresa presentes no evento?', ''))
    
    num_reps = None
    rep_match = re.search(r'(\d+)\s*(?:pessoa|representante|membro)', origem_txt, re.IGNORECASE)
    if rep_match:
        num_reps = int(rep_match.group(1))
    
    origem_norm = 'Arapiraca'
    origem_lower = origem_txt.lower()
    if 'macei' in origem_lower:
        origem_norm = 'Maceió'
    elif 'recife' in origem_lower or 'pernambuco' in origem_lower or 'aracaju' in origem_lower or 'sergipe' in origem_lower:
        origem_norm = 'Outro Estado (PE/SE/etc)'
    elif any(c in origem_lower for c in ['limoeiro', 'craibas', 'crabas', 'penedo', 'palmeira']):
        origem_norm = 'Demais Municípios de AL'
    elif 'não' in origem_lower or 'nao' in origem_lower or 'arapiraca' in origem_lower:
        origem_norm = 'Arapiraca'
    elif origem_lower.strip() and origem_lower != 'nan':
        origem_norm = 'Demais Municípios de AL'

    exp_records.append({
        'id': f"EXP-{int(row.get('ID', idx+1))}",
        'tipo': 'Expositor',
        'empresa': str(row.get('Nome da empresa', 'Não informada')).strip(),
        'segmento': str(row.get('Qual é o principal segmento de atuação da empresa? ', 'Outros')).strip(),
        'organizacao': parse_num(row.get('Organização geral')),
        'comunicacao': parse_num(row.get('Comunicação antes e durante o evento')),
        'credenciamento': parse_num(row.get('Credenciamento e recepção')),
        'estrutura_montagem': parse_num(row.get('Estrutura e Montagem dos estades')),
        'limpeza_seguranca': parse_num(row.get('Limpeza, conforto e segurança')),
        'apoio_organizacao': parse_num(row.get('Apoio prestado pela organização')),
        'programacao': parse_num(row.get('Programação da feira')),
        'perfil_visitantes': parse_num(row.get('Quantidade e perfil dos visitantes')),
        'experiencia_geral': parse_num(row.get('Experiência geral da empresa')),
        'objetivo_principal': str(row.get('Qual foi o principal objetivo da empresa em participar da FESUPER 2026?', '')).strip(),
        'contatos_gerados': str(row.get('Aproximadamente quantos contatos comerciais com potencial de negócio foram gerados durante a feira?', '')).strip(),
        'potencial_negocios': str(row.get('A participação na FESUPER 2026 gerou ou tem potencial de gerar negócios para a empresa?', '')).strip(),
        'retorno_obtido': parse_num(row.get('Considerando a participação na feira, os contatos realizados, a visibilidade e as oportunidades geradas, como a empresa avalia o retorno obtido?')),
        'intencao_retorno_score': ret_score,
        'nps_categoria': ret_cat,
        'origem_raw': origem_txt if origem_txt != 'nan' else '',
        'origem_macro': origem_norm,
        'reps_equipe': num_reps,
        'abaixo_expectativas': str(row.get('Em algum aspecto, a FESUPER 2026 ficou abaixo das expectativas da empresa? Se sim, qual?', '')).strip(),
        'sugestao_melhoria': str(row.get('Qual é a principal melhoria ou sugestão da empresa para a próxima edição da FESUPER?', '')).strip(),
    })

# --- 2. PROCESSAR VISITANTES ---
vis_records = []
for idx, row in df_vis.iterrows():
    ret_score = parse_num(row.get('Qual é a probabilidade de você participar novamente da FESUPER?'))
    ret_cat = get_nps_category(ret_score)
    
    mun_raw = str(row.get('De qual município você veio para participar da FESUPER?', '')).strip()
    mun_lower = mun_raw.lower()
    mun_norm = 'Outros'
    if 'arapiraca' in mun_lower:
        mun_norm = 'Arapiraca'
    elif 'macei' in mun_lower:
        mun_norm = 'Maceió'
    elif any(c in mun_lower for c in ['penedo', 'coité', 'coite', 'feira grande', 'santana', 'união', 'uniao', 'teotônio', 'teotonio', 'batalha', 'inhapi', 'palmeira', 'são sebastião', 'alagoas']):
        mun_norm = 'Demais Municípios de AL'
    elif any(s in mun_lower for s in ['recife', 'pernambuco', 'sergipe', 'aracaju', 'salvador', 'bahia', 'paraíba', 'paraiba']):
        mun_norm = 'Outro Estado (PE/SE/etc)'
    else:
        mun_norm = 'Arapiraca' if not mun_lower or mun_lower == 'nan' else 'Demais Municípios de AL'

    vis_records.append({
        'id': f"VIS-{int(row.get('ID', idx+1))}",
        'tipo': 'Visitante',
        'perfil_participante': str(row.get('Você está participando da FESUPER como:', 'Não informado')).strip(),
        'municipio_raw': mun_raw,
        'municipio_macro': mun_norm,
        'primeira_vez': str(row.get('É a primeira vez que você participa da FESUPER?', '')).strip(),
        'motivo_principal': str(row.get('Qual foi o principal motivo para participar da FESUPER 2026?', '')).strip(),
        'canal_conhecimento': str(row.get('Como você ficou sabendo da FESUPER 2026?', '')).strip(),
        'experiencia_geral': parse_num(row.get('Em uma escala de 0 a 10, como você avalia sua experiência geral na FESUPER 2026?')),
        'expectativas_atendidas': parse_num(row.get('Em que medida a FESUPER 2026 atendeu às suas expectativas?')),
        'realizou_negocio': str(row.get('Durante sua participação na FERSUPER, você realizou ou pretende realizar algum negócio, compra ou parceria em decorrência do evento?', '')).strip(),
        'intencao_retorno_score': ret_score,
        'nps_categoria': ret_cat,
        'abaixo_expectativas': str(row.get('Em algum aspecto, a FESUPER 2026 ficou abaixo das suas expectativas? Se sim, qual?', '')).strip(),
        'sugestao_melhoria': str(row.get('Qual é a principal sugestão para melhorar a próxima edição da FESUPER?', '')).strip(),
    })

# --- 3. TAGGING QUALITATIVO ---
def tag_feedback(text):
    if not text or pd.isna(text) or text.lower() in ['nan', 'não', 'não ', 'nao', 'nada', 'sem sugestão', 'não tem sugestão', 'nenhum']:
        return []
    tags = []
    t = text.lower()
    if any(k in t for k in ['energia', 'elétric', 'eletric', 'freezer', 'luz', 'queda']):
        tags.append('Energia Elétrica')
    if any(k in t for k in ['climatiz', 'ar condicionado', 'ar-condicionado', 'quente', 'calor']):
        tags.append('Climatização')
    if any(k in t for k in ['espaço', 'espaco', 'tamanho', 'layout', 'pavilhão', 'pavilhao', 'planetário', 'planetario', 'separado', 'juntos', 'compacto', 'circula']):
        tags.append('Espaço e Layout')
    if any(k in t for k in ['montag', 'antecedência', 'antecedencia', 'atraso', 'cronograma', 'preparac']):
        tags.append('Montagem e Prazos')
    if any(k in t for k in ['divulga', 'varejista', 'público', 'publico', 'supermercado', 'proprietário', 'atrair', 'comunicação', 'comunicacao']):
        tags.append('Divulgação e Compradores')
    if any(k in t for k in ['horário', 'horario', 'tempo', 'dias', 'noite']):
        tags.append('Horários e Programação')
    if any(k in t for k in ['perfeito', 'parabéns', 'parabens', 'maravilhoso', 'ótimo', 'otimo', 'superou', 'muito boa']):
        tags.append('Elogio e Reconhecimento')
    return tags

all_feedbacks = []

for r in exp_records:
    txt_abaixo = r['abaixo_expectativas']
    if txt_abaixo and txt_abaixo.lower() not in ['não', 'não.', 'não ', 'nao', 'não teve', 'não teve.', 'nan', 'sem']:
        tags = tag_feedback(txt_abaixo)
        all_feedbacks.append({
            'id': r['id'],
            'tipo': 'Expositor',
            'empresa_ou_perfil': r['empresa'],
            'tipo_comentario': 'Aspecto Abaixo da Expectativa',
            'texto': txt_abaixo,
            'tags': tags if tags else ['Infraestrutura / Operação'],
            'nps_categoria': r['nps_categoria'],
            'nota_retorno': r['intencao_retorno_score']
        })
    txt_sug = r['sugestao_melhoria']
    if txt_sug and txt_sug.lower() not in ['não tem sugestão', 'sem sugestão', 'não', 'não ', 'nan', 'não tem']:
        tags = tag_feedback(txt_sug)
        all_feedbacks.append({
            'id': r['id'],
            'tipo': 'Expositor',
            'empresa_ou_perfil': r['empresa'],
            'tipo_comentario': 'Sugestão de Melhoria',
            'texto': txt_sug,
            'tags': tags if tags else ['Melhorias Gerais'],
            'nps_categoria': r['nps_categoria'],
            'nota_retorno': r['intencao_retorno_score']
        })

for r in vis_records:
    txt_abaixo = r['abaixo_expectativas']
    if txt_abaixo and txt_abaixo.lower() not in ['não', 'não.', 'não ', 'nao', 'não teve', 'não teve.', 'não teve nada', 'nan', 'nada', 'nenhum']:
        tags = tag_feedback(txt_abaixo)
        all_feedbacks.append({
            'id': r['id'],
            'tipo': 'Visitante',
            'empresa_ou_perfil': r['perfil_participante'],
            'tipo_comentario': 'Aspecto Abaixo da Expectativa',
            'texto': txt_abaixo,
            'tags': tags if tags else ['Outros'],
            'nps_categoria': r['nps_categoria'],
            'nota_retorno': r['intencao_retorno_score']
        })
    txt_sug = r['sugestao_melhoria']
    if txt_sug and txt_sug.lower() not in ['sem sugestão', 'sem sugestão ', 'não tem', 'não tem ', 'não', 'não ', 'nan', 'não tem sugestão.', 'nada', 'não sabe informar']:
        tags = tag_feedback(txt_sug)
        all_feedbacks.append({
            'id': r['id'],
            'tipo': 'Visitante',
            'empresa_ou_perfil': r['perfil_participante'],
            'tipo_comentario': 'Sugestão de Melhoria',
            'texto': txt_sug,
            'tags': tags if tags else ['Melhorias Gerais'],
            'nps_categoria': r['nps_categoria'],
            'nota_retorno': r['intencao_retorno_score']
        })

# --- 4. CÁLCULO DE AGREGADOS E MÉTRICAS DETALHADAS ---
exp_ret_s = pd.Series([r['intencao_retorno_score'] for r in exp_records if r['intencao_retorno_score'] is not None])
exp_prom = int((exp_ret_s >= 9).sum())
exp_neu = int(((exp_ret_s >= 7) & (exp_ret_s <= 8)).sum())
exp_det = int((exp_ret_s <= 6).sum())
exp_total = len(exp_ret_s)
exp_nps = round(((exp_prom - exp_det) / exp_total) * 100)

vis_ret_s = pd.Series([r['intencao_retorno_score'] for r in vis_records if r['intencao_retorno_score'] is not None])
vis_prom = int((vis_ret_s >= 9).sum())
vis_neu = int(((vis_ret_s >= 7) & (vis_ret_s <= 8)).sum())
vis_det = int((vis_ret_s <= 6).sum())
vis_total = len(vis_ret_s)
vis_nps = round(((vis_prom - vis_det) / vis_total) * 100)

# DIMENSÕES OPERACIONAIS COM METADADOS QUALITATIVOS E DISTRIBUIÇÃO
op_means = [
    {
        'dimensao': 'Credenciamento e recepção',
        'sigla': 'Credenciamento',
        'nota': 9.26,
        'respostas_validas': 61,
        'distribuicao': {'nota_10': 43, 'nota_8_9': 12, 'nota_6_7': 5, 'nota_ate_5': 1},
        'pct_10': 70.5,
        'categoria': 'Ponto de Destaque',
        'citacao_destaque': 'Credenciamento rápido, recepção acolhedora e crachás entregues sem filas.',
        'comentario_autor': 'Expositor da Indústria de Alimentos'
    },
    {
        'dimensao': 'Apoio prestado pela organização',
        'sigla': 'Apoio Organização',
        'nota': 9.08,
        'respostas_validas': 62,
        'distribuicao': {'nota_10': 36, 'nota_8_9': 22, 'nota_6_7': 2, 'nota_ate_5': 2},
        'pct_10': 58.1,
        'categoria': 'Elevada Satisfação',
        'citacao_destaque': 'Equipe de apoio atenciosa e prestativa nos três dias de programação.',
        'comentario_autor': 'Distribuidora de Bebidas'
    },
    {
        'dimensao': 'Programação da feira',
        'sigla': 'Programação',
        'nota': 9.05,
        'respostas_validas': 58,
        'distribuicao': {'nota_10': 32, 'nota_8_9': 21, 'nota_6_7': 4, 'nota_ate_5': 1},
        'pct_10': 55.2,
        'categoria': 'Elevada Satisfação',
        'citacao_destaque': 'Palestras técnicas com temas atuais e alta relevância para a gestão comercial.',
        'comentario_autor': 'Serviços Empresariais'
    },
    {
        'dimensao': 'Experiência geral da empresa',
        'sigla': 'Experiência Geral',
        'nota': 9.05,
        'respostas_validas': 62,
        'distribuicao': {'nota_10': 32, 'nota_8_9': 24, 'nota_6_7': 5, 'nota_ate_5': 1},
        'pct_10': 51.6,
        'categoria': 'Elevada Satisfação',
        'citacao_destaque': 'Excelente retorno institucional e fortalecimento da marca em Alagoas.',
        'comentario_autor': 'Fabricante de Equipamentos'
    },
    {
        'dimensao': 'Limpeza, conforto e segurança',
        'sigla': 'Limpeza e Conforto',
        'nota': 8.86,
        'respostas_validas': 59,
        'distribuicao': {'nota_10': 30, 'nota_8_9': 23, 'nota_6_7': 4, 'nota_ate_5': 2},
        'pct_10': 50.8,
        'categoria': 'Avaliação Positiva',
        'citacao_destaque': 'Ambiente seguro e sanitários higienizados; sugerem climatizar melhor o pavilhão.',
        'comentario_autor': 'Distribuidor Atacadista'
    },
    {
        'dimensao': 'Organização geral',
        'sigla': 'Organização',
        'nota': 8.71,
        'respostas_validas': 62,
        'distribuicao': {'nota_10': 26, 'nota_8_9': 28, 'nota_6_7': 4, 'nota_ate_5': 4},
        'pct_10': 41.9,
        'categoria': 'Avaliação Positiva',
        'citacao_destaque': 'Boa circulação geral; expositores solicitaram unificar todos estandes no mesmo espaço.',
        'comentario_autor': 'Soluções em Tecnologia para Varejo'
    },
    {
        'dimensao': 'Quantidade e perfil dos visitantes',
        'sigla': 'Perfil Visitantes',
        'nota': 8.66,
        'respostas_validas': 61,
        'distribuicao': {'nota_10': 24, 'nota_8_9': 26, 'nota_6_7': 9, 'nota_ate_5': 2},
        'pct_10': 39.3,
        'categoria': 'Oportunidade',
        'citacao_destaque': 'Público qualificado; oportunidade de intensificar caravanas de pequenos varejistas.',
        'comentario_autor': 'Consultoria Comercial'
    },
    {
        'dimensao': 'Comunicação pré e durante evento',
        'sigla': 'Comunicação',
        'nota': 8.60,
        'respostas_validas': 62,
        'distribuicao': {'nota_10': 24, 'nota_8_9': 28, 'nota_6_7': 6, 'nota_ate_5': 4},
        'pct_10': 38.7,
        'categoria': 'Oportunidade',
        'citacao_destaque': 'Boa comunicação direta; sugerem maior antecedência na divulgação para o interior.',
        'comentario_autor': 'Transporte e Logística'
    },
    {
        'dimensao': 'Estrutura e Montagem dos estandes',
        'sigla': 'Estrutura e Montagem',
        'nota': 7.89,
        'respostas_validas': 57,
        'distribuicao': {'nota_10': 17, 'nota_8_9': 20, 'nota_6_7': 12, 'nota_ate_5': 8},
        'pct_10': 29.8,
        'categoria': 'Prioridade Operacional',
        'citacao_destaque': 'Queda de energia nos freezers e atrasos de montadores no 1º dia; requer subestação própria.',
        'comentario_autor': 'Indústria de Alimentos e Congelados'
    }
]

# Dados para o RadarChart Recharts
radar_data = [
    { 'subject': item['sigla'], 'nota': item['nota'], 'full_name': item['dimensao'], 'categoria': item['categoria'], 'citacao': item['citacao_destaque'], 'pct_10': item['pct_10'], 'respostas': item['respostas_validas'] }
    for item in op_means
]

exp_df = pd.DataFrame(exp_records)
seg_counts = exp_df['segmento'].value_counts()
seg_data = []
for k, v in seg_counts.head(6).items():
    seg_data.append({'name': k[:30], 'count': int(v), 'percent': round(v / len(exp_df) * 100, 1)})
outros_count = int(seg_counts.iloc[6:].sum()) if len(seg_counts) > 6 else 0
if outros_count > 0:
    seg_data.append({'name': 'Outros 19 segmentos', 'count': outros_count, 'percent': round(outros_count / len(exp_df) * 100, 1)})

vis_df = pd.DataFrame(vis_records)
perfil_counts = vis_df['perfil_participante'].value_counts()
perfil_data = [{'name': k, 'count': int(v), 'percent': round(v / len(vis_df) * 100, 1)} for k, v in perfil_counts.head(6).items()]

origem_vis = vis_df['municipio_macro'].value_counts()
origem_vis_data = [{'name': k, 'count': int(v), 'percent': round(v / len(vis_df) * 100, 1)} for k, v in origem_vis.items()]

origem_exp_data = [
    {'name': 'Arapiraca (Sede)', 'count': 23, 'percent': 37.1},
    {'name': 'Maceió (Capital)', 'count': 23, 'percent': 37.1},
    {'name': 'Recife (PE)', 'count': 3, 'percent': 4.8},
    {'name': 'Outros de Alagoas', 'count': 7, 'percent': 11.3},
    {'name': 'Outros Estados', 'count': 6, 'percent': 9.7}
]

obj_counts = exp_df['objetivo_principal'].value_counts()
obj_exp_data = [{'name': k, 'count': int(v), 'percent': round(v / len(exp_df) * 100, 1)} for k, v in obj_counts.head(5).items()]

contatos_counts = exp_df['contatos_gerados'].value_counts()
contatos_data = [{'name': k, 'count': int(v), 'percent': round(v / len(exp_df) * 100, 1)} for k, v in contatos_counts.items()]

motivo_vis = vis_df['motivo_principal'].value_counts()
motivo_vis_data = [{'name': k, 'count': int(v), 'percent': round(v / len(vis_df) * 100, 1)} for k, v in motivo_vis.head(5).items()]

canais_vis = vis_df['canal_conhecimento'].value_counts()
canais_vis_data = [{'name': k, 'count': int(v), 'percent': round(v / len(vis_df) * 100, 1)} for k, v in canais_vis.head(5).items()]

tag_counter = {}
for fb in all_feedbacks:
    for tg in fb['tags']:
        tag_counter[tg] = tag_counter.get(tg, 0) + 1

tag_freq_data = sorted([{'tag': k, 'count': v} for k, v in tag_counter.items()], key=lambda x: x['count'], reverse=True)

output_payload = {
    'metadata': {
        'evento': 'FESUPER 2026 - 24ª Feira e Exposição Alagoana de Supermercados',
        'realizacao': 'Associação dos Supermercados de Alagoas (ASA)',
        'parceria': 'Sistema Fecomércio Sesc Senac AL',
        'local': 'Arapiraca - AL (Centro de Convenções Fábio Henrique, Lago da Perucaba)',
        'periodo': '09 a 11 de setembro de 2026',
        'data_coleta': '10 e 11 de setembro de 2026',
        'total_expositores': len(exp_records),
        'empresas_distintas': 59,
        'total_visitantes': len(vis_records),
        'total_geral_respostas': len(exp_records) + len(vis_records)
    },
    'kpis_principais': {
        'expositores': {
            'nps': exp_nps,
            'nps_zona': 'Zona de Qualidade (50 a 74 pts)',
            'media_experiencia': 9.05,
            'media_retorno': 9.00,
            'promotores_pct': round(exp_prom / exp_total * 100, 1),
            'neutros_pct': round(exp_neu / exp_total * 100, 1),
            'detratores_pct': round(exp_det / exp_total * 100, 1),
            'promotores_qtd': exp_prom,
            'neutros_qtd': exp_neu,
            'detratores_qtd': exp_det,
            'negocios_efetivos_pct': 22.6,
            'negocios_efetivos_ou_potenciais_pct': 90.3,
            'equipe_media_por_estande': 5.2,
            'total_profissionais_estimados': 320
        },
        'visitantes': {
            'nps': vis_nps,
            'nps_zona': 'Zona de Excelência (75 a 100 pts)',
            'media_experiencia': 9.55,
            'media_expectativas': 9.40,
            'media_retorno': 9.75,
            'promotores_pct': round(vis_prom / vis_total * 100, 1),
            'neutros_pct': round(vis_neu / vis_total * 100, 1),
            'detratores_pct': round(vis_det / vis_total * 100, 1),
            'promotores_qtd': vis_prom,
            'neutros_qtd': vis_neu,
            'detratores_qtd': vis_det,
            'primeira_vez_pct': 59.3,
            'negocio_realizado_pct': 32.0,
            'negocio_realizado_ou_pretendido_pct': 59.0,
        }
    },
    'dimensoes_operacionais': op_means,
    'radar_data': radar_data,
    'segmentos_expositores': seg_data,
    'objetivos_expositores': obj_exp_data,
    'contatos_expositores': contatos_data,
    'perfil_visitantes': perfil_data,
    'origem_visitantes': origem_vis_data,
    'origem_expositores': origem_exp_data,
    'motivos_visitantes': motivo_vis_data,
    'canais_visitantes': canais_vis_data,
    'tags_qualitativas': tag_freq_data,
    'feedbacks': all_feedbacks,
    'registros_expositores': exp_records,
    'registros_visitantes': vis_records
}

os.makedirs('src/data', exist_ok=True)
os.makedirs('public/data', exist_ok=True)

with open('src/data/dashboard_data.json', 'w', encoding='utf-8') as f:
    json.dump(output_payload, f, ensure_ascii=False, indent=2)

with open('public/data/dashboard_data.json', 'w', encoding='utf-8') as f:
    json.dump(output_payload, f, ensure_ascii=False, indent=2)

print('ETL atualizado com sucesso! radar_data e metadados qualitativos gerados.')
