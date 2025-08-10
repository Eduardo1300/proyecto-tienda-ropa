import * as bcrypt from 'bcrypt';

async function generateHash() {
  const plainPassword = 'password123';  // La contraseña que quieres usar
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log('Hash:', hashedPassword);
}

generateHash();
