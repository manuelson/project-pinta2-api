require('dotenv/config');

const {
	PORT,
	CORS_URL
} = process.env;

console.log(process.env)

const requiredCredentials = [
	'PORT',
	'CORS_URL'
];

for (const credential of requiredCredentials) {
	if (process.env[credential] === undefined) {
		process.exit(1);
	}
}

module.exports = {
	PORT,
	CORS_URL
};
