const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const UserModel = require('../models/userModel');

passport.use(
  new JWTstrategy(
    {
      secretOrKey: 'TOP_SECRET',
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken('secret_token')
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'signup',
  // eslint-disable-next-line new-cap
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const newUser = {
          email: req.body.email,
          password: req.body.password,
          passwordConfirm: req.body.passwordConfirm,
          fristName: req.body.fristName,
          lastName: req.body.lastName,
          role: req.body.role
        };

        const user = await UserModel.create(newUser);

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// ...

passport.use(
  'login',
  // eslint-disable-next-line new-cap
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email1, password1, done) => {
      try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        const validate = await user.isValidPassword(password, user.password);
        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }
        // console.log(user.suspended);
        if (user.suspended) {
          return done(null, false, {
            message: 'Your Account has been suspended'
          });
        }
        if (!user.inActivate && user.role === 'seller') {
          return done(null, false, {
            message: 'Please Check your email to confirm your account'
          });
        }

        if (user.closeAccount) {
          return done(null, false, {
            message: 'Please contact-us to recover your account'
          });
        }
        // console.log(user);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
