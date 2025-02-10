import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../service/schemas/users.js';
import 'dotenv/config';

const SECRET = process.env.JWT_SECRET;

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: SECRET,
};

passport.use(
	new JwtStrategy(opts, async (payload, done) => {
		try {
			const user = await User.findOne({ email: payload.email });
			if (!user) {
				return done(null, false);
			}
			return done(null, user);
		} catch (err) {
			return done(err, false);
		}
	})
);

const auth = (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user) => {
		if (err || !user) {
			return res.status(401).json({
				status: 'Unauthorized',
				message: 'Invalid or missing token',
			});
		}
		const token = req.header('Authorization')?.split(' ')[1];
		if (user.token !== token) {
			return res.status(401).json({
				status: 'Unauthorized',
				message: 'Invalid or missing token',
			});
		}
		req.user = user;
		next();
	})(req, res, next);
};

export default auth;
