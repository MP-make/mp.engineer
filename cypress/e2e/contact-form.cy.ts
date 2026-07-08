describe("Contact Form", () => {
  beforeEach(() => {
    cy.visit("/contacto");
  });

  it("muestra el formulario de contacto", () => {
    cy.get("#name").should("exist");
    cy.get("#email").should("exist");
    cy.get("#message").should("exist");
    cy.get("button[type='submit']").should("exist");
  });

  it("envía formulario correctamente (mockeando API)", () => {
    cy.intercept("POST", "/api/contact", {
      statusCode: 200,
      body: { success: true },
    }).as("submitContact");

    cy.get("#name").type("Test User");
    cy.get("#email").type("test@example.com");
    cy.get("#message").type("Este es un mensaje de prueba desde Cypress.");

    cy.get("button[type='submit']").click();
    cy.wait("@submitContact");
    cy.get("p.text-green-400").should("exist");
  });

  it("muestra error si la API falla", () => {
    cy.intercept("POST", "/api/contact", {
      statusCode: 500,
      body: { error: "Server error" },
    }).as("submitContactFail");

    cy.get("#name").type("Test User");
    cy.get("#email").type("test@example.com");
    cy.get("#message").type("Mensaje de prueba.");

    cy.get("button[type='submit']").click();
    cy.wait("@submitContactFail");
    cy.get("p.text-red-400").should("exist");
  });

  it("redirige al hacer clic en enlaces de contacto", () => {
    cy.contains("MP-make").should("exist");
    cy.contains("marlonpecho264@gmail.com").should("exist");
  });
});
