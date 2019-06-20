require('../src/db/mongoose');
const User = require('./../src/models/user');
const Task = require('./../src/models/task');

const deleteTaskAndCount = async () => {
	const deleteT = await Task.findByIdAndDelete('5d0a7d39fca60d208192e4a7');
	const count = await Task.countDocuments({ completed: false });
	return count;
};

deleteTaskAndCount()
	.then(result => {
		console.log(result);
	})
	.catch(err => {
		console.log(err);
	});
