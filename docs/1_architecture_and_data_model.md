# Arquitetura e Modelo de Banco de Dados

Este documento serve como contexto para o framework web Lovable replicar a arquitetura deste sistema. O objetivo original foi construir um aplicativo desktop (Electron) embarcado com SQLite. Na migração para Web, esses mesmos conceitos devem ser traduzidos para um backend moderno (Ex: Node/PostgreSQL ou Supabase).

## Arquitetura Original
- **Backend:** Node.js com Express.js (`server.js`).
- **Banco de Dados:** SQLite (usando `sql.js` compilado via WebAssembly para rodar offline e empacotado pelo Electron/pkg).
- **Frontend:** Vanilla HTML, CSS (com flexbox nativo, sem frameworks) e JS Vanilla (tudo num único arquivo `calculadora.html`).

## Modelo de Dados (Tabela de Simulações)
Toda simulação concluída (seja avulsa ou em lote) salva no banco as entradas do usuário e os resultados numéricos para manter o histórico inalterável.

**Tabela:** `simulacoes`

| Coluna | Tipo (SQLite) | Descrição / Mapeamento |
|---|---|---|
| `id` | INTEGER PK | ID único autoincremento |
| `criado_em` | DATETIME | Timestamp padrão `CURRENT_TIMESTAMP` |
| `nome` | TEXT | Razão Social ou Nome do Lead |
| `regime` | TEXT | Simples Nacional / Lucro Presumido / Lucro Real |
| `faturamento_anual` | REAL | Faturamento bruto anual (em reais) |
| `funcionarios` | INTEGER | Quantidade de funcionários no quadro atual |
| `setor` | TEXT | Setor de atuação (Comércio, Indústria, Serviços, etc) |
| `unidades` | INTEGER | Número de filiais/unidades físicas |
| `automacao` | TEXT | Nível tecnológico (Sem sistema, Planilhas, ERP, etc) |
| `risco` | TEXT | Nível de risco fiscal (Baixo, Médio, Alto, Muito Alto) |
| `cpe` | TEXT | Posicionamento estratégico (Baixo, Médio, Alto) |
| `piso_escritorio` | REAL | O piso de honorário cadastrado como "Mínimo absoluto" |
| `onboarding` | INTEGER | 1 = Sim, 0 = Não |
| `planejamento` | INTEGER | 1 = Sim, 0 = Não |
| `bpo_cfo` | INTEGER | 1 = Sim, 0 = Não |
| `bpo_pct` | REAL | Percentual sobre o faturamento cobrado em BPO (ex: 0.1, 0.3) |
| `plano_recomendado`| TEXT | 'Mínimo', 'Médio' ou 'Alto' |
| `valor_minimo` | REAL | Valor mensal final calculado no plano Mínimo |
| `valor_medio` | REAL | Valor mensal final calculado no plano Médio |
| `valor_alto` | REAL | Valor mensal final calculado no plano Alto |
| `total_recomendado`| REAL | O valor final correspondente ao `plano_recomendado` |
| `score_confianca` | INTEGER | Percentual de 0 a 100 de complexidade geral |

## Rotas da API (API REST)
- `GET /api/simulacoes` : Retorna a lista em JSON ordenada do mais recente para o mais antigo.
- `POST /api/simulacoes` : Recebe um body contendo todos os dados e insere no banco (gera ID).
- `DELETE /api/simulacoes/:id` : Deleta um registro específico pelo ID.

## Adaptação para o Novo Sistema (Lovable)
- Na versão Web (Lovable/Supabase etc), você deve recriar essa mesma tabela tipificada no banco relacional.
- Criar a mesma API RESTful ou conectar diretamente usando as bibliotecas do Supabase.
- A exclusão e visualização de históricos são fundamentais para o modelo de negócios do escritório contábil.
