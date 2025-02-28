const bcrypt = require('bcrypt');

async function hashPassword(password) {
    try {
        // Define the number of salt rounds (10 is a common default)
        const saltRounds = 10;

        // Generate a salt and hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        console.log('Original Password:', password);
        console.log('Hashed Password:', hashedPassword);

        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

// Example usage
const password = 'nivedha@001';
hashPassword(password).then((hashedPassword) => {
    // Save the hashedPassword to your database
    console.log('Password hashing complete.');
});
