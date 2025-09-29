Cypress.Commands.add("login", (email, password) => {
    cy.intercept("POST", "**/api/login").as("loginRequest");

    cy.visit("/");

    cy.get("#email").clear().type(email);
    cy.get("#password").clear().type(password);
    cy.get("#login-btn").click();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
});

Cypress.Commands.add("checkoutProduct", (productId) => {
    cy.intercept('/api/products', (req) => {
        req.headers['cache-control'] = 'no-cache';
    }).as('getProducts');

    cy.reload(true);
    cy.wait('@getProducts').then(({ response }) => {
        expect(response.statusCode).to.eq(200);

        const product = response.body.items.find(item => item.id === productId);
        expect(product.stock).to.be.greaterThan(0);
        const initialStock = product.stock;

        cy.get(`[data-id='${productId}']`).click();
        cy.get('#checkout-btn').click();

        cy.reload(true);
        cy.wait('@getProducts').then(({ response: updatedResponse }) => {
            const updatedProduct = updatedResponse.body.items.find(item => item.id === productId);
            expect(updatedProduct.stock).to.eq(initialStock - 1);
        });
    });
});

Cypress.Commands.add("checkoutWithCoupon", (productId, couponCode, discountPercent) => {
    cy.intercept('/api/products', (req) => {
        req.headers['cache-control'] = 'no-cache';
    }).as('getProducts');

    cy.intercept('POST', '/api/checkout').as('checkout');

    cy.reload(true);
    cy.wait('@getProducts').then(({ response }) => {
        expect(response.statusCode).to.eq(200);

        const product = response.body.items.find(item => item.id === productId);
        expect(product.stock).to.be.greaterThan(0);
        const initialStock = product.stock;

        cy.get(`[data-id='${productId}']`).click();
        cy.get('#coupon-code').type(couponCode);
        cy.get('#apply-coupon-btn').click();
        cy.contains(`Cupom aplicado: ${couponCode}`).should('be.visible');

        cy.get('#checkout-btn').click();

        cy.wait('@checkout').then(({ response: checkoutResponse }) => {
            expect(checkoutResponse.statusCode).to.eq(200);
            const body = checkoutResponse.body;

            expect(body.appliedCoupon).to.deep.equal({
                code: couponCode,
                discount: discountPercent,
                type: "percentage"
            });

            const expectedDiscount = +(body.subtotal * discountPercent / 100).toFixed(2);
            const expectedTotal = +(body.subtotal - expectedDiscount).toFixed(2);

            expect(+body.discount.toFixed(2)).to.eq(expectedDiscount);
            expect(+body.total.toFixed(2)).to.eq(expectedTotal);
        });

        cy.reload(true);
        cy.wait('@getProducts').then(({ response: updatedResponse }) => {
            const updatedProduct = updatedResponse.body.items.find(item => item.id === productId);
            expect(updatedProduct.stock).to.eq(initialStock - 1);
        });
    });
});

Cypress.Commands.add("applyCoupon", (productId, couponCode) => {
    cy.intercept('POST', '/api/validate-coupon').as('validateCoupon');

    cy.get(`[data-id='${productId}']`).click();

    cy.get('#coupon-code').clear().type(couponCode);
    cy.get('#apply-coupon-btn').click();

    return cy.wait('@validateCoupon').then(({ response }) => {
        expect(response.statusCode).to.eq(200);

        const couponData = response.body.coupon || {};
        const isValid = response.body.valid;

        return { isValid, couponData };
    });
});

Cypress.Commands.add("calculateTotal", (productPrice, coupon) => {
    let discount = 0;
    if (coupon.type === "percentage") {
        discount = +(productPrice * coupon.discount / 100).toFixed(2);
    } else if (coupon.type === "fixed") {
        discount = +coupon.discount.toFixed(2);
    }
    const total = +(productPrice - discount).toFixed(2);
    return cy.wrap({ discount, total });
});

Cypress.Commands.add("addToCart", (productId, quantity = 1) => {
    if (quantity > 1) {
        cy.get(`#qty-${productId}`).clear().invoke('val', quantity).trigger('input');
    }
    cy.get(`[data-id='${productId}']`).click();
});