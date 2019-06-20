const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//User CRUD

//User Create
app.post('/users', async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		res.status(201).send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

//User Read all
app.get('/users', async (req, res) => {
	try {
		const users = await User.find({});
		res.status(201).send(users);
	} catch (e) {
		res.status(500).send();
	}
});

//User Read one
app.get('/users/:id', async (req, res) => {
	const _id = req.params.id;
	try {
		const user = await User.findById(_id);
		if (!user) {
			return res.status(404).send();
		}
		res.status(200).send(user);
	} catch (err) {
		res.status(500).send();
	}
});

//User Update
app.patch('/users/:id', async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'email', 'password', 'age'];
	const isValidOperation = updates.every(update =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' });
	}
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		});

		if (!user) {
			return res.status(404).send();
		}
		res.send(user);
	} catch (error) {
		res.status(400).send(error);
	}
});

// Task CRUD

//Task Create
app.post('/tasks', async (req, res) => {
	const task = new Task(req.body);
	try {
		await task.save();
		res.status(201).send(task);
	} catch (error) {
		res.status(400).send(err);
	}
});

//Task Read all
app.get('/tasks', async (req, res) => {
	try {
		const task = await Task.find({});
		res.status(200).send(task);
	} catch (error) {
		res.status(500).send();
	}
});

//Task Read one
app.get('/tasks/:id', async (req, res) => {
	const _id = req.params.id;
	try {
		const task = await Task.findById(_id);
		if (!task) {
			return res.status(404).send();
		}
		res.status(200).send(task);
	} catch (error) {
		res.status(500).send();
	}
});

//Task Update
app.patch('/tasks/:id', async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['description', 'completed'];
	const isValidOperation = updates.every(update =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation) {
		return res.status(404).send({ error: 'invalid update!' });
	}

	try {
		const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		});

		if (!task) {
			res.status(404).send({ error: 'no such task found' });
		}

		res.send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

app.listen(port, () => {
	console.log('server is up on port' + port);
});
