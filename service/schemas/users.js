import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
	name: {
		type: String,
		minLength: 2,
		maxLength: 20,
		required: true,
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Email is required'],
	},
	token: {
		type: String,
		default: null,
	},
	subscription: {
		type: String,
		enum: ['starter', 'pro', 'business'],
		default: 'starter',
	},
});

userSchema.methods.setPassword = function (password) {
	this.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
};

userSchema.methods.validatePassword = function (password) {
	try {
		console.log('Comparing:', password, this.password);
		return bcrypt.compareSync(password, this.password);
	} catch (err) {
		console.error('Password comparison failed:', err);
		return false;
	}
};

export const User = model('user', userSchema);
