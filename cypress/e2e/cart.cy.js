const USERS = {
  admin: { email: "admin@test.com", password: "admin123" }
};

describe("AddCart", () => {

  beforeEach(() => {
    cy.visit("/");
    cy.login(USERS.admin.email, USERS.admin.password);
    cy.contains("Admin User").should("be.visible");
  });

  it("validate if my products exist", () => {
    ['Keyboard', 'Mouse', 'Headset'].forEach(item => {
      cy.contains(item).should('be.visible');
    });
  });

  it("Add an item to cart", () => {
    cy.addToCart(1);
    cy.contains('Carrinho: 1 itens – Total: R$ 199,90').should('be.visible');
  });

  it("Add more than one item to cart", () => {
    cy.addToCart(2, 2);
    cy.contains('Carrinho: 2 itens – Total: R$ 199,00').should('be.visible');
  });

  it("Adding three different items to the cart and checking the total", () => {
    cy.addToCart(1);
    cy.addToCart(2);
    cy.addToCart(3);

    cy.contains('Carrinho: 3 itens – Total: R$ 598,40').should('be.visible');
  });

  it("validate stock quantity", () => {
    cy.get('#qty-2').clear().invoke('val', 25).trigger('input');
    cy.get("[data-id='2']").click();

    cy.on('window:alert', (msg) => {
      expect(msg).to.match(/^Quantidade indisponível\. Estoque: \d+$/);
    });
  });
});