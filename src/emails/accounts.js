const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'kewal2123@gmail.com',
		subject: 'Thanks for joining',
		text: `welcome to the app, ${name}. Let me know how you get along with the app`
	});
};

const sendCancellationEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'kewal2123@gmail.com',
		subject: 'Sorry to let you go',
		text: `sorry, ${name}. Let me know how could we improve`
	});
};

module.exports = {
	sendWelcomeEmail,
	sendCancellationEmail
};
