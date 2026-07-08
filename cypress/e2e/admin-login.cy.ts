describe("Admin Login", () => {
  beforeEach(() => {
    cy.visit("/admin/login");
  });

  it("muestra el formulario de login", () => {
    cy.get("#email").should("exist");
    cy.get("#password").should("exist");
    cy.contains("Iniciar Sesión").should("exist");
  });

  it("falla con credenciales incorrectas y se queda en login", () => {
    cy.get("#email").type("wrong@email.com");
    cy.get("#password").type("wrongpassword");
    cy.contains("Iniciar Sesión").click();

    cy.url({ timeout: 10000 }).should("include", "/admin/login");
    cy.contains(/Credenciales incorrectas|Iniciar Sesión/).should("exist");
  });

  it("tiene enlace para volver al sitio", () => {
    cy.contains(/Volver al sitio web/).should("exist");
  });
});
