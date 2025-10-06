"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
async function generateHash() {
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log('Hash:', hashedPassword);
}
generateHash();
//# sourceMappingURL=generate-hash.js.map