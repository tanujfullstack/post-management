const mongoose = require('mongoose');
const uuid = require('uuid');


const usersSchema = new mongoose.Schema({
	userID: {
		type: String,
		index: true,
		default() { return uuid.v5(this.username, uuid.v4()); },
		immutable: true,
	},
	username: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
		required: true,
	},
	updated_at: {
		type: Date,
		default: Date.now,
		required: true,
	},
	active: {
		type: Boolean,
		default: true,
		required: true,
	},
	deleted: {
		type: Boolean,
		default: false,
		required: true,
	},
});

usersSchema.index({
	userID: 1,
	username: 1
}, {
	unique: true,
	name: 'user_id_username_unique_idx'
});

usersSchema.index({
	created_at: -1,
	updated_at: -1
}, {
	name: 'created_at_updated_at_idx'
});

const model = mongoose.model('Users', usersSchema);


module.exports = {
	model,
	create: async ({ username, name }) => {
		return await model.create({
			username,
			name
		});
	},
	getAll: async ({ pageNumber, pageSize, sortBy }) => {

		return (await model.find(
			{
				active: true,
				deleted: false
			},
			['userID', 'username', 'name', 'created_at', 'updated_at'],
			{
				skip: pageSize * (pageNumber - 1),
				limit: pageSize,
				sort: sortBy
			}
		))
	},
	getByUsernameOrUserID: async (identifier) => {

		return (await model.findOne(
			{
				$or: [
					{
						username: identifier,
					},
					{
						userID: identifier,
					}
				],
				active: true,
				deleted: false,
			},
			['userID', 'username', 'name', 'created_at', 'updated_at']
		))
	},
	update: async (identifier, { username, name }) => {
		return await model.findOneAndUpdate({
			$or: [
				{
					username: identifier,
				},
				{
					userID: identifier
				}
			],
			active: true,
			deleted: false,
		}, {
			username,
			name,
			updated_at: Date.now()
		})
	},
	remove: async (identifier) => {
		return await model.findOneAndDelete(
			{
				$or: [
					{
						userID: identifier
					},
					{
						username: identifier
					}
				]
			},
			{
				active: false,
				deleted: true,
				updated_at: Date.now()
			}
		)
	}
}

