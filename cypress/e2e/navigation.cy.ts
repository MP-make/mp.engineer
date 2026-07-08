describe("Navigation", () => {
  it("el home no tiene navbar, navega desde otras páginas", () => {
    cy.visit("/proyectos");
    cy.get("nav a[href='/']", { timeout: 10000 }).should("exist");

    cy.get("nav a[href='/sobre-mi']").click();
    cy.url().should("include", "/sobre-mi");

    cy.get("nav a[href='/proyectos']").click();
    cy.url().should("include", "/proyectos");

    cy.get("nav a[href='/contacto']").click();
    cy.url().should("include", "/contacto");
  });

  it("mobile viewport se renderiza sin errores", () => {
    cy.viewport(375, 667);
    cy.visit("/contacto");

    cy.get("nav").should("exist");
    cy.get("#name").should("exist");
    cy.get("#email").should("exist");
  });

  it("home page muestra elementos clave", () => {
    cy.visit("/");

    cy.contains(/Conectemos|Let's Connect/, { timeout: 10000 }).should("exist");
    cy.contains(/Descargar CV|Download CV/).should("exist");
  });
});
