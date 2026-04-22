const bcrypt = require('bcrypt');

async function verifyHash() {
  const password = 'Password123';
  const hashFromDb = '$2b$10$5b7W3VF0K2o6/PI.l83lc.CWVR0QiEjJ3QNJpSPUe5hdGLfNohGZ.';
  
  const isMatch = await bcrypt.compare(password, hashFromDb);
  console.log('Password match:', isMatch ? 'Yes' : 'No');
  
  // Also try admin@123
  const isMatchAdmin = await bcrypt.compare('admin@123', hashFromDb);
  console.log('admin@123 password match:', isMatchAdmin ? 'Yes' : 'No');
}

verifyHash();
