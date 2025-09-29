const USERS = {
  admin: { email: "admin@test.com", password: "admin123" }
};

describe("Checkout", () => {

  beforeEach(() => {
    cy.visit("/");
    cy.login(USERS.admin.email, USERS.admin.password);
    cy.contains("Admin User").should("be.visible");
  });

  it("checkout Keyboard", () => {
    cy.checkoutProduct(1);
  });

  it("checkout Mouse", () => {
    cy.checkoutProduct(2);
  });

  it("checkout Headset", () => {
    cy.checkoutProduct(3);
  });

  it("Checkout Mouse with coupon WELCOME10", () => {
    cy.checkoutWithCoupon(2, "WELCOME10", 10);
  });
});
