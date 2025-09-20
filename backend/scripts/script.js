import bcrypt from "bcryptjs";

const password = "Admin123"; // your admin password
const hashed = await bcrypt.hash(password, 10);
console.log(hashed);