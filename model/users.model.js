const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const userSchema = new Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	passWord: {
		type: String,
		required: true,
	},
});

// Encrypt password before saving to the database
userSchema.pre("save", async function (next) {
	const user = this;
	const hash = await bcrypt.hash(
		this.passWord,
		10
	);

	this.passWord = hash;
	next();
});

userSchema.methods.comparePasswords =
	async function (password) {
		return await bcrypt.compare(
			password,
			this.passWord
		);
	};

const User = mongoose.model("User", userSchema);

module.exports = User;
