<div align="center">
  <img src="https://img.icons8.com/color/96/000000/calculator--v1.png" alt="Logo Calculadora"/>
  <h1>Calculadora de Honorários Contábeis</h1>
  <p><b>Precificação Inteligente Baseada em Dados Reais</b></p>
  <p>
    <img alt="Versão" src="https://img.shields.io/badge/Versão-1.0.0-blue.svg">
    <img alt="Electron" src="https://img.shields.io/badge/Electron-Desktop_App-47848F.svg">
    <img alt="SQLite" src="https://img.shields.io/badge/Banco-SQLite-003B57.svg">
  </p>
</div>

---

## 🎯 Sobre o Projeto

A **Calculadora de Honorários Contábeis** é um sistema completo de nível desktop projetado para automatizar, profissionalizar e agilizar o processo de precificação de serviços contábeis para clientes e leads. Em vez de depender de chutes ou planilhas desorganizadas, o sistema calcula o valor ideal do honorário através de algoritmos baseados na complexidade fiscal, folha de pagamento, regime tributário, automação e faturamento de cada empresa.

## ✨ Funcionalidades Principais

* 🧮 **Motor de Cálculo Inteligente:** Avalia o risco fiscal, o porte (filiais e funcionários) e os módulos adicionais (Onboarding, BPO CFO, Planejamento Tributário) e gera 3 opções de planos de assinatura estruturados (Mínimo, Médio e Alto).
* 📂 **Importador Inteligente em Lote:** Faça upload de uma planilha Excel (`.xlsx`) com dezenas de clientes de uma só vez. O sistema lê as linhas e extrai CNPJ, Razão Social, Regime, Setor e Faturamento de forma 100% autônoma.
* ⚡ **Bulk Actions (Ações em Massa):** Dentro da importação em lote, ative funcionalidades (como Onboarding e BPO) para várias empresas simultaneamente com uma barra de Presets Globais.
* 💾 **Banco de Dados Local Integrado:** O software utiliza um banco de dados **SQLite** offline para guardar todo o histórico das simulações, garantindo segurança total dos dados das empresas processadas.
* 🎨 **Design Moderno:** Interface de alta conversão usando flexbox, transições fluidas e indicadores visuais dinâmicos (mudança de cores e layouts amigáveis ao usuário).

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando um Stack robusto voltado para velocidade e encapsulamento em desktop:

* **Electron:** Para empacotar toda a aplicação da web em um executável nativo Windows.
* **Node.js & Express:** Responsáveis por orquestrar rotas de API em um mini-servidor local e gerenciar o Banco de Dados.
* **SQLite (sqlite3):** Para armazenar de forma perene o histórico completo dos orçamentos sem depender de nuvem.
* **SheetJS (xlsx.full.min.js):** Módulo de processamento de dados embarcado na página para interpretar planilhas em frações de segundo.
* **Vanilla HTML / CSS / JS:** Desenvolvido sem frameworks complexos de Front-End, prezando por máxima otimização e controle granular do design.

## 🚀 Como Rodar Localmente

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/pedropaivaf/CalculoMB.git
   cd CalculoMB
   ```

2. **Instale as dependências do Node:**
   ```bash
   npm install
   ```

3. **Inicie o aplicativo:**
   ```bash
   npm start
   ```
   *O ambiente do Electron será aberto automaticamente como uma janela de Desktop.*

## 📦 Como Gerar o Instalador (.exe)

Para compilar o código fonte e gerar um instalador Windows distribuível que qualquer pessoa pode rodar (sem precisar do Node), execute o comando de empacotamento:

```bash
npm run build
```

O arquivo executável final e os binários serão salvos na pasta `/dist`.

## 🤝 Autores

Pedro Paiva e Iuri Ghelfo

Desenvolvido para automatizar as operações e multiplicar as vendas de escritórios contábeis.

---
<div align="center">
  Feito com dedicação para a Contabilidade do Futuro 🚀
</div>
