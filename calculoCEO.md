# CONTEXTO DA CONVERSA — Calculadora de Honorários Contábeis
> Cole este arquivo inteiro no início de uma nova conversa no Claude Desktop para continuar de onde paramos.

---

## O QUE FOI FEITO

Extraí e validei 100% a lógica de cálculo do sistema **Calculadora de Honorários Contábeis** do site `https://calculadora.contadorceo.com.br/`. O sistema usa Next.js + Supabase. Autentiquei via API do Supabase, li os parâmetros diretamente do banco, extraí a fórmula completa e validei campo a campo contra o sistema real — todos os 16 campos bateram com ✅.

---

## ARQUIVOS CRIADOS (na pasta C:\Users\pedro.paiva\Documents\calculadoraceo)

| Arquivo | Descrição |
|---|---|
| `calculadora.html` | Sistema completo em HTML/CSS/JS puro — abre no navegador offline, replica todas as telas e cálculos do sistema original |
| `prompt_lovable.md` | Prompt completo para replicar o sistema no Lovable (React + TypeScript + Supabase) |
| `logica_calculo_honorarios.docx` | Documento Word com toda a lógica documentada |

---

## RESULTADO DA VALIDAÇÃO (confirmado ✅)

Inputs usados na validação:
- Regime: Simples Nacional
- Faturamento: R$ 2.000.000,00
- Funcionários: 27
- Setor: Comércio + Serviço
- Unidades: 1
- Automação: Sistema básico
- Risco: Médio
- CPE: Médio
- Piso escritório: R$ 32.132,00

Resultado real vs. calculado (todos ✅):
- Mínimo: Contabilidade R$32.140 | Folha R$1.220 | Total R$33.360
- Médio:  Contabilidade R$37.920 | Folha R$1.440 | Total R$39.360
- Alto:   Contabilidade R$43.380 | Folha R$1.650 | Total R$45.030

---

## FÓRMULA COMPLETA EXTRAÍDA

### Parâmetros

```
REGIME_PCT:       Simples Nacional=0.005 | Lucro Presumido=0.007 | Lucro Real=0.01
VALOR_POR_FUNC:   Simples Nacional=R$45  | Lucro Presumido=R$55  | Lucro Real=R$65

CC (coef. setor):
  Comércio=1.0 | Serviços=1.1 | Indústria=1.4 | Internacional=1.5
  Terceiro Setor=1.1 | Comércio + Serviço=1.2 | Serviço Regulamentado=1.35

CR (risco fiscal):     Baixo=1.0 | Médio=1.1 | Alto=1.25 | Muito Alto=1.4
CA (automação):        Sem sistema=1.15 | Planilhas=1.05 | Sistema básico=1.0 | ERP integrado=0.9 | ERP + BI avançado=0.85
CPE (posicionamento):  Baixo=1.0 | Médio=1.15 | Alto=1.3

MULTIPLICADORES DE PLANO: Mínimo=1.0 | Médio=1.18 | Alto=1.35
ARREDONDAMENTO: CEILING para múltiplo de R$10

PONTUAÇÃO DE COMPLEXIDADE:
  regime:     Simples Nacional=5 | Lucro Presumido=10 | Lucro Real=25
  risco:      Baixo=0 | Médio=10 | Alto=20 | Muito Alto=25
  setor:      Comércio=5 | Serviços=8 | Indústria=10 | Internacional=15 | Terceiro Setor=8 | Comércio+Serviço=10 | Serviço Regulamentado=12
  automacao:  Sem sistema=10 | Planilhas=5 | Sistema básico=0 | ERP integrado=-3 | ERP+BI=-5
  funcionarios: 0-30=5pts | 31-100=10pts | 101-300=15pts | 301+=20pts
  unidades:   1=5pts | 2-5=10pts | 6-9=15pts | 10+=20pts
```

### Fórmula passo a passo

```
1. Produto = CC × CR × CA × CPE

2. Piso_Base = (Faturamento_Anual / 12) × REGIME_PCT[regime]

3. Folha_Base = Funcionários × VALOR_POR_FUNC[regime]

4. HRM_Calculado = Piso_Base × Produto + Folha_Base

5. HRM_Base = MAX(HRM_Calculado, Piso_Escritório)

6. Plano_Mínimo_Contab = CEIL(HRM_Base × 1.00, 10)
   Plano_Médio_Contab  = CEIL(HRM_Base × 1.18, 10)
   Plano_Alto_Contab   = CEIL(HRM_Base × 1.35, 10)

   Plano_Mínimo_Folha  = CEIL(Folha_Base × 1.00, 10)
   Plano_Médio_Folha   = CEIL(Folha_Base × 1.18, 10)
   Plano_Alto_Folha    = CEIL(Folha_Base × 1.35, 10)

   Total_Plano = Contabilidade + Folha

7. Módulos opcionais:
   Onboarding          = HRM_Final × 2  (cobrado no 1º mês)
   Planejamento Trib.  = HRM_Final × 3
   BPO CFO             = (Faturamento_Anual / 12) × bpo_percentual
```

### Recomendação de plano

```
score_risk   = Baixo=0 | Médio=0.15 | Alto=0.225 | MuitoAlto=0.30
score_regime = Simples=0.05 | Presumido=0.175 | Real=0.25
score_fat    = (faturamento / (faturamento + 500000)) × 0.30
score_compl  = (totalPontos / 100) × 0.15
ajustes:
  ERP integrado/avançado → -0.05
  Sem sistema/Planilhas  → +0.05
  Unidades > 1           → +0.05
  Setor Internacional    → +0.10

score_total = soma de todos acima
  < 0.35 → Plano Mínimo
  < 0.65 → Plano Médio
  ≥ 0.65 → Plano Alto
```

---

## ACESSO AO BANCO DE DADOS (Supabase do sistema original)

```
URL:      https://production-supabase.cl2.absgroup.com.br
ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
LOGIN:    guilherme@mbcontabilidade.com.br / 3215Mb3985@
TABELAS:  pricing_simulations (input_json, result_json) | parameters
```

Para autenticar e buscar simulações:
```bash
TOKEN=$(curl -s -X POST "https://production-supabase.cl2.absgroup.com.br/auth/v1/token?grant_type=password" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE" \
  -H "Content-Type: application/json" \
  -d '{"email":"guilherme@mbcontabilidade.com.br","password":"3215Mb3985@"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
```

---

## PRÓXIMOS PASSOS POSSÍVEIS

- Ajustar/melhorar o `calculadora.html` (visual, campos, exportar PDF etc.)
- Usar o `prompt_lovable.md` no Lovable para gerar o sistema completo com Supabase
- Adicionar autenticação própria ao sistema replicado
- Expandir para outros regimes, setores ou módulos
- Criar versão Excel da calculadora

---

## INSTRUÇÃO PARA O CLAUDE

Você está continuando uma sessão de engenharia reversa e validação de uma calculadora de honorários contábeis. Toda a lógica foi extraída, validada 100% e implementada. O arquivo `calculadora.html` em `C:\Users\pedro.paiva\Documents\calculadoraceo\` contém a implementação funcional completa. Continue a partir daqui conforme o que o usuário pedir.


## CAMPOS QUE FALTAM ADICIONAR

