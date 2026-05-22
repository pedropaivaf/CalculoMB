# Engine de Cálculo e Regras de Negócio

O coração da calculadora é a sua árvore de regras. Este documento exprime EXATAMENTE como os valores são alcançados. Lovable, NÃO modifique essas matemáticas na conversão, apenas as traduza para TypeScript ou o framework backend/frontend da sua escolha.

## Constantes e Dicionários Padrão (`P`)

```javascript
const P = {
  regimePct: { 'Simples Nacional': 0.005, 'Lucro Presumido': 0.007, 'Lucro Real': 0.01 },
  valuePerEmployee: { 'Simples Nacional': 45, 'Lucro Presumido': 55, 'Lucro Real': 65 },
  ccBySetor: {
    'Comércio': 1.0, 'Serviços': 1.1, 'Indústria': 1.4, 'Internacional': 1.5,
    'Terceiro Setor': 1.1, 'Comércio + Serviço': 1.2, 'Serviço Regulamentado': 1.35,
  },
  coef: {
    CR: { 'Baixo': 1.0, 'Médio': 1.1, 'Alto': 1.25, 'Muito Alto': 1.4 },
    CA: { 'Sem sistema': 1.15, 'Planilhas': 1.05, 'Sistema básico': 1.0, 'ERP integrado': 0.9, 'ERP + BI avançado': 0.85 },
    CPE: { 'Baixo': 1.0, 'Médio': 1.15, 'Alto': 1.3 },
  },
  planMultipliers: { 'Mínimo': 1.0, 'Médio': 1.18, 'Alto': 1.35 },
  roundingMultiple: 10,
  points: {
    regime: { 'Simples Nacional': 5, 'Lucro Presumido': 10, 'Lucro Real': 25 },
    risco:  { 'Baixo': 0, 'Médio': 10, 'Alto': 20, 'Muito Alto': 25 },
    setor:  { 'Comércio': 5, 'Serviços': 8, 'Indústria': 10, 'Internacional': 15, 'Terceiro Setor': 8, 'Comércio + Serviço': 10, 'Serviço Regulamentado': 12 },
    automacao: { 'Sem sistema': 10, 'Planilhas': 5, 'Sistema básico': 0, 'ERP integrado': -3, 'ERP + BI avançado': -5 },
    funcionarios: [{min:0,max:30,pts:5},{min:31,max:100,pts:10},{min:101,max:300,pts:15},{min:301,max:999999,pts:20}],
    unidades:     [{min:1,max:1,pts:5},{min:2,max:5,pts:10},{min:6,max:9,pts:15},{min:10,max:999999,pts:20}],
  },
  modules: { onboardingMultiplier: 2, planningMultiplier: 3 },
  rec: {
    weights: { risk: 0.3, regime: 0.25, faturamento: 0.3, complexidade: 0.15 },
    constantK: 500000,
    thresholds: { low: 0.35, high: 0.65 },
    adj: { erp: -0.05, manual: 0.05, unidades: 0.05, internacional: 0.1 },
  },
};
```

## Etapas do Algoritmo

### 1. Sistema de Pontuação (Complexidade Oculta)
O sistema dá uma "nota" à empresa somando os pontos (baseado em `P.points`):
`Total = pts(Regime) + pts(Funcionários) + pts(Setor) + pts(Unidades) + pts(Automação) + pts(Risco)`
*Nota: Para Arrays de intervalo (funcionarios, unidades), varre-se o `min` e `max` para achar os pontos.*

### 2. Multiplicadores de Complexidade
Achamos o Produto Global que impacta o valor base contábil:
`Produto (Prod) = CC(Setor) × CR(Risco) × CA(Automação) × CPE(Estratégico)`

### 3. Valores Base Monetários
* **Piso Base:** `(Faturamento Anual / 12) × Percentual(Regime)`
* **Custo Folha:** `Número Funcionários × Valor Func(Regime)`
* **Honorário Mensal Calculado (HRM):** `(Piso Base × Prod) + Custo Folha`
* **Honorário Base Real (HRMBase):** `MAX(HRM, Piso de Escritório digitado pelo User)`

### 4. Geração dos 3 Planos
Para os 3 planos (Mínimo, Médio, Alto), multiplicamos as bases pelos `planMultipliers`:
* `HRM Plano = CEIL(HRMBase × Multiplicador, 10)` -> *CEIL = Arredondamento para o teto da dezena mais próxima (ex: 231 vira 240).*
* `Folha Plano = CEIL(Custo Folha × Multiplicador, 10)`
* `Total Mensalidade do Plano = HRM Plano + Folha Plano`

**Preços Modulares Adicionais (Mostrados em Itens Separados na UI)**
* Se Onboarding = true: `Onboarding = HRM Plano × 2`
* Se Planejamento = true: `Planejamento = HRM Plano × 3`
* Se BPO = true: `BPO = (Faturamento Anual / 12) × Porcentagem do BPO (ex: 0.1%)`

### 5. Recomendação Inteligente (Plano Sugerido)
O sistema calcula um **Score Normalizado de 0 a 1** para indicar ao cliente o plano ideal.
* `sRisk`: Baseado em dicionário (Baixo: 0, Médio: 0.15, Alto: 0.225, M.Alto: 0.3)
* `sReg`: Baseado em dicionário (Simples: 0.05, Presumido: 0.175, Real: 0.25)
* `sFat`: Curva assintótica: `(FatAnual / (FatAnual + constantK)) × weights.faturamento`
* `sCompl`: `(Total Pontos / 100) × weights.complexidade`
* `Ajustes Extras (adj)`: Bônus negativos para ERP, positivos para manuais/muitas unidades.

`Score Final = sRisk + sReg + sFat + sCompl + adj`
* Se `Score Final < 0.35` -> Recomendado = **Mínimo**
* Se `Score Final < 0.65` -> Recomendado = **Médio**
* Se `Score Final >= 0.65` -> Recomendado = **Alto**

*Confiança % = `MIN(Round(Score Final × 100), 100)`*
