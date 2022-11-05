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
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blog",
		},
	],
});

userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		// returnedObject.id =
		// 	returnedObject._id.toString();
		// delete returnedObject._id;
		delete returnedObject.__v;
		// the passwordHash should not be revealed
		delete returnedObject.passWord;
	},
});

// Encrypt password before saving to the database
userSchema.pre("save", async function (next) {
	const user = this;

	if (!user.isModified("passWord")) return next();
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
