🧪 Testes E2E com Cypress – Mini Ecommerce

Este projeto contém testes end-to-end (E2E) usando Cypress para validar funcionalidades de um mini ecommerce, incluindo:

Login UI e API

Logout

Adição de produtos ao carrinho

Aplicação de cupons (válidos, inválidos e expirados)

Checkout com validação de estoque e decremento

Cálculo de totais com cupons

📁 Estrutura do Projeto
cypress/
├─ e2e/
│  ├─ login.cy.js
│  ├─ addCart.cy.js
│  ├─ checkout.cy.js
│  └─ coupons.cy.js
├─ support/
│  ├─ commands.js      # comandos customizados (login, addProduct, applyCoupon)
│  └─ e2e.js
cypress.config.js
package.json
README.md

⚙️ Pré-requisitos

Antes de rodar os testes, certifique-se de ter instalado:

Node.js >= 18

npm ou yarn

O backend rodando localmente em http://localhost:3001

O frontend rodando em http://localhost:3000 (ou ajustado no baseUrl do Cypress)

🛠️ Instalação

Clone o projeto:

git clone: https://github.com/lucasbuff04/BIX-Tecnologia-TesteQA.git
cd BIX-Tecnologia-TesteQA


Instale as dependências:

npm install
# ou
yarn install

🔧 Configuração do Cypress

No arquivo cypress.config.js você deve definir o baseUrl da sua aplicação, por exemplo:
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners aqui, se necessário
    },
    specPattern: "cypress/e2e/**/*.cy.js"
  }
});

🚀 Rodando os testes
npx cypress open
1️⃣ Abrir Cypress UI
- Seleciona o spec que deseja rodar (login.cy.js, addCart.cy.js, checkout.cy.js, coupons.cy.js)
- Testes rodam em tempo real no navegador, você pode acompanhar os cliques, inputs e asserts.
2️⃣ Rodar todos os testes em headless (linha de comando)
npx cypress run
-Executa todos os testes no Chrome headless (ou outro navegador configurado)
- Gera relatório no terminal.
3️⃣ Rodar testes específicos
- npx cypress run --spec "cypress/e2e/login.cy.js"

📌 Dicas de uso

Sempre garantir que o backend esteja rodando antes de iniciar os testes.

Para evitar problemas de cache, usamos cy.intercept com cache-control: no-cache nos endpoints principais (/api/products, /api/validate-coupon).

Campos de input são sempre limpos antes de digitar (clear()) para evitar falhas de preenchimento.

Use os comandos customizados (cy.login, cy.loginRequest) para manter testes legíveis e DRY.

🧪 Cobertura de testes
Funcionalidade	Testes
Login UI	Login bem-sucedido, Logout
Login API	Sem email, sem senha, credenciais inválidas
Carrinho	Adicionar 1 ou múltiplos itens, validar estoque, validar total
Cupons	Válidos, expirados, inválidos, validar desconto e total
Checkout	Estoque decrementa corretamente, total correto com cupom aplicado
