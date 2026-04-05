INSERT INTO "user" (username, email, password, firstName, lastName, role) 
VALUES 
  ('admin', 'admin@example.com', '$2b$10$PKgpp6/PYkxSUwX5crYbZuqnuOhw4ImFQDfqqkE0o6ZSrKg7JDbxu', 'Admin', 'User', 'admin'),
  ('testuser', 'test@example.com', '$2b$10$PKgpp6/PYkxSUwX5crYbZuqnuOhw4ImFQDfqqkE0o6ZSrKg7JDbxu', 'Test', 'User', 'user'),
  ('customer', 'customer@example.com', '$2b$10$PKgpp6/PYkxSUwX5crYbZuqnuOhw4ImFQDfqqkE0o6ZSrKg7JDbxu', 'Customer', 'Test', 'user')
ON CONFLICT (email) DO NOTHING;

SELECT id, username, email, role FROM "user";
