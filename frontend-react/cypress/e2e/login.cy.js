describe('Login Flow', () => {
  it('should successfully login as admin', () => {
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('admin@smartclinic.com');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // Should redirect to dashboard
    cy.url().should('include', '/admin/dashboard');
    cy.contains('Admin Dashboard').should('be.visible');
  });

  it('should show error on invalid credentials', () => {
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('wrong@email.com');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    
    // Should show error message (assuming Sonner toast or similar)
    cy.contains('Invalid credentials').should('exist');
  });
});
