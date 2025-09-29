const USERS = {
  admin: { email: "admin@test.com", password: "admin123" }
};

describe("Coupons", () => {

  beforeEach(() => {
    cy.visit("/");
    cy.login(USERS.admin.email, USERS.admin.password);
    cy.contains("Admin User").should("be.visible");
  });

  it("valid coupon - WELCOME10", () => {
    const productPrice = 299;

    cy.applyCoupon(3, "WELCOME10").then(({ isValid, couponData }) => {
      expect(isValid).to.be.true;
      expect(couponData).to.deep.equal({
        code: "WELCOME10",
        discount: 10,
        type: "percentage"
      });

      cy.calculateTotal(productPrice, couponData).then(({ discount, total }) => {
        cy.contains(`Cupom aplicado: ${couponData.code}`).should('be.visible');
        cy.contains(`Desconto: R$ ${discount.toFixed(2).replace('.', ',')}`).should('be.visible');

        cy.get('#final-total')
          .invoke('text')
          .then(text => {
            const displayedTotal = parseFloat(text.replace(',', '.'));
            expect(displayedTotal).to.eq(total);
          });
      });
    });
  });

  it("valid coupon - SAVE20", () => {
    const productPrice = 99.5;

    cy.applyCoupon(2, "SAVE20").then(({ isValid, couponData }) => {
      expect(isValid).to.be.true;
      expect(couponData).to.deep.equal({
        code: "SAVE20",
        discount: 20,
        type: "percentage"
      });

      cy.calculateTotal(productPrice, couponData).then(({ discount, total }) => {
        cy.contains(`Cupom aplicado: ${couponData.code}`).should('be.visible');
        cy.contains(`Desconto: R$ ${discount.toFixed(2).replace('.', ',')}`).should('be.visible');

        cy.get('#final-total')
          .invoke('text')
          .then(text => {
            const displayedTotal = parseFloat(text.replace(',', '.'));
            expect(displayedTotal).to.eq(total);
          });
      });
    });
  });

  it("valid coupon - FIXED50", () => {
    const productPrice = 199.9;

    cy.applyCoupon(1, "FIXED50").then(({ isValid, couponData }) => {
      expect(isValid).to.be.true;
      expect(couponData).to.deep.equal({
        code: "FIXED50",
        discount: 50,
        type: "fixed"
      });

      cy.calculateTotal(productPrice, couponData).then(({ discount, total }) => {
        cy.contains(`Cupom aplicado: ${couponData.code}`).should('be.visible');
        cy.contains(`Desconto: R$ ${discount.toFixed(2).replace('.', ',')}`).should('be.visible');

        cy.get('#final-total')
          .invoke('text')
          .then(text => {
            const displayedTotal = parseFloat(text.replace(',', '.'));
            expect(displayedTotal).to.eq(total);
          });
      });
    });
  });

  it("expired coupon - EXPIRED", () => {
    cy.applyCoupon(2, "EXPIRED").then(({ isValid }) => {
      expect(isValid).to.be.false;
      cy.contains('Coupon is expired').should('be.visible');
    });
  });

  it("invalid coupon - TEST", () => {
    cy.applyCoupon(2, "TEST").then(({ isValid }) => {
      expect(isValid).to.be.false;
      cy.contains('Invalid coupon code').should('be.visible');
    });
  });
});