const BASE_URL_API = "/api/login";
const USERS = {
  admin: { email: "admin@test.com", password: "admin123" }
};

describe("Login - UI", () => {

  beforeEach(() => {
    cy.visit("/");
  });

  it("Should log in successfully", () => {
    cy.login(USERS.admin.email, USERS.admin.password);
    cy.contains("Admin User").should("be.visible");
  });

  it("Must log out", () => {
    cy.login(USERS.admin.email, USERS.admin.password);
    cy.contains("Admin User").should("be.visible");

    cy.get("#logout-btn").click({ force: true });

    cy.get("#email").should("be.visible");
    cy.get("#password").should("be.visible");
  });
});

describe("Login - API (error validation)", () => {

  it("You must not log in without a password.", () => {
    cy.request({
      method: "POST",
      url: BASE_URL_API,
      body: { email: USERS.admin.email },
      failOnStatusCode: false
    }).then((resp) => {
      expect(resp.status).to.eq(400);
      expect(resp.body).to.have.property("error", "Email and password are required");
    });
  });

  it("You should not log in without email", () => {
    cy.request({
      method: "POST",
      url: BASE_URL_API,
      body: { password: USERS.admin.password },
      failOnStatusCode: false
    }).then((resp) => {
      expect(resp.status).to.eq(400);
      expect(resp.body).to.have.property("error", "Email and password are required");
    });
  });

  it("You must not log in with invalid credentials.", () => {
    cy.request({
      method: "POST",
      url: BASE_URL_API,
      body: { email: USERS.admin.email, password: "incorrectPassword" },
      failOnStatusCode: false
    }).then((resp) => {
      expect(resp.status).to.eq(401);
      expect(resp.body).to.have.property("error", "Invalid credentials");
    });
  });
});