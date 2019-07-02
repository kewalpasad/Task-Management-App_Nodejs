const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
	_id: userOneId,
	name: 'Kewal Pasad',
	email: 'kewalpasad@google.com',
	password: 'IGotASoftwareJobInGoogleUSAPaying$16000Yearly',
	tokens: [
		{
			token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
		}
	]
};

beforeEach(async () => {
	await User.deleteMany();
	await new User(userOne).save();
});

test('should signup a new user', async () => {
	const response = await request(app)
		.post('/users')
		.send({
			name: 'Kewal Pasad',
			email: 'kewal2123@gmail.com',
			password: 'Read123!'
		})
		.expect(201);

	//Assert that the database was changed correctly
	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull;

	//Assert about the response
	expect(response.body).toMatchObject({
		user: {
			name: 'Kewal Pasad'
		},
		token: user.tokens[0].token
	});
	expect(user.password).not.toBe('Read123!');
});

test('Should login existing user', async () => {
	const response = await request(app)
		.post('/users/login')
		.send({
			email: userOne.email,
			password: userOne.password
		})
		.expect(200);

	const user = await User.findById(userOneId);
	expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login the user', async () => {
	await request(app)
		.post('/users/login')
		.send({
			email: userOne.email,
			password:
				'IGotASoftwareJobInGooglePaying$160000PerYearTill31stDecember2020'
		})
		.expect(400);
});

test('should get profile for user', async () => {
	await request(app)
		.get('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
});

test('should not get profile for user', async () => {
	await request(app)
		.get('/users/me')
		.send()
		.expect(401);
});

test('should delete the auth user', async () => {
	const response = await request(app)
		.delete('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user).toBeNull;
});

test('should not delete the unauth user', async () => {
	await request(app)
		.delete('/users/me')
		.send()
		.expect(401);
});

test('should upload avatar image', async () => {
	await request(app)
		.post('/users/me/avatar')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.attach('avatar', 'tests/fixtures/profile-pic.jpg')
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user.avatar).toEqual(expect.any(Buffer));
});

test('should update valid user fields', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			name: 'khushi'
		})
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user.name).toEqual('khushi');
});

test('should not update invalid user fields', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			location: 'Google'
		})
		.expect(400);
});
