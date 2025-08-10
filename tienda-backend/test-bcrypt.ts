import * as bcrypt from 'bcrypt';

async function test() {
  const hashedPassword = '$2b$10$llB7Ppw4uS6qfR5Q1//HeOqcs89QeLOz87fOWj/BGmrWJMuRtxgeC';
  const plainPassword = 'password123';

  const match = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Password match?', match);
}

test();
