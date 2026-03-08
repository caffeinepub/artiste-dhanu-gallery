# Artiste Dhanu Gallery

## Current State
No existing app. This is a fresh build.

## Requested Changes (Diff)

### Add
- Handmade products store for an artisan seller
- Public-facing product listing page with product name, description, photo, and price
- Product detail page with "Buy Now" / order form
- Order form that collects: customer name, phone number, full postal address (door no, street, city, state, PIN code) for India Post delivery
- Order confirmation message after submission
- Admin panel (password-protected) to:
  - Add, edit, delete products (name, description, price, image upload)
  - View all customer orders with postal address details
- Sample/demo products to showcase the store on first load

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Products data store (CRUD), Orders data store (create + read), Admin authentication
2. Backend: Place order API accepting postal address fields
3. Frontend: Public product gallery page
4. Frontend: Product detail / order form page (collects name, phone, full Indian postal address)
5. Frontend: Order confirmation page
6. Frontend: Admin login page
7. Frontend: Admin product management (add/edit/delete with image upload)
8. Frontend: Admin order viewer showing customer postal details
