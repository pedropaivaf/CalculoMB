# UI, UX e Fluxo de Telas (Workflows)

Lovable, a usabilidade desta calculadora é o seu grande diferencial. Existem mecânicas muito inteligentes que não podem ser perdidas, especialmente no módulo de Importação em Lote e Ações em Massa.

## 1. Importação em Lote via Excel (SheetJS)
*   **O que acontece:** O usuário arrasta ou seleciona um `.xlsx`.
*   **Mapeamento:** O script lê a primeira aba da planilha e varre o JSON resultante tentando dar *Match* nas colunas ignorando Case, acentos e espaços soltos (Ex: "Faturamento", "Faturamento Anual", "Razão Social", "Nome", etc).
*   **Atenção de Mapeamento Específico (Obrigatório replicar):**
    *   `Faturamento` da planilha mapeia para `Faturamento Anual`
    *   `Folha de Pagamento` da planilha mapeia para `Número de Funcionários`
    *   `honorário atual` da planilha mapeia para `Piso do Escritório`
*   **Tela Renderizada (Lista de Lote):** Exibe as empresas extraídas como "Cards" expansíveis.

## 2. Ações em Lote e Presets Globais (Bulk Actions)
*   No topo da lista de empresas gerada pela extração do Excel, há uma **Barra Fixa (Sticky)**.
*   **Presets Globais:** Botões de Toggle (Liga/Desliga) azuis (ex: `+ Onboarding`, `+ Planejamento`, `+ BPO`). Quando acionados (ficam azuis na UI), eles afetam IMEDIATAMENTE as empresas que estão "selecionadas" na lista.
*   **Herança Dinâmica:** O comportamento principal de usabilidade: Se o Botão "+ Onboarding" estiver aceso (Ativo) no topo da tela, e o usuário "Marcar" (Check) uma nova empresa na lista, a empresa **HERDA** essa opção na mesma hora.
*   **Visuais:** A linha selecionada muda de cor de fundo (Azul Claro) e ganha borda. Empresas cujo detalhamento já foi aberto ou calculado, ficam com a borda lateral Verde (indicando status lido).

## 3. Fluxo de Visualização e Resumo de Selecionados
*   **Resultados de Lote (Visualizar Selecionados):** Ao invés de salvar direto, o usuário clica em "Visualizar Selecionados". O sistema roda o algoritmo de cálculo em background (em memória) para as empresas com Checkbox ligado.
*   Gera-se uma tela Intermediária de **Resumo Rápido**, listando cada empresa com apenas duas informações cruciais: *Qual plano o Algoritmo recomendou* e o *Valor dessa recomendação*.
*   Se o usuário clicar em "Detalhes" dentro do resumo, ele vai para a **Tela Principal de Resultados Individuais**, que mostra os gráficos, a divisão (Contábil x Folha), e um *Relatório Passo a Passo (Accordion)* de como a máquina chegou naquele valor.
*   **Navegação Sem Perda de Estado:** Na tela Principal de Resultado Individual, se o usuário chegou nela via Batch/Lote, o botão "Voltar" superior o devolve EXATAMENTE para o estado anterior da lista, sem recarregar a página e sem perder checkboxes marcados.

## 4. Histórico (Banco de Dados)
A qualquer momento o usuário clica em "Histórico", listando cards com todos os cálculos já concluídos com sucesso. Há opção de excluir cards indesejados. O design de todas essas listas baseia-se em *Flexbox*, cards sombreados e tipografia limpa (semelhante ao Tailwind, mas feito em CSS puro ou estilização direta amigável).
