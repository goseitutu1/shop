const express = require('express');
const session = require('express-session')
const path = require('path');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const sequelize = require('./util/database')
const csrf = require('csurf');
const flash = require('connect-flash');
const { graphqlHTTP } = require('express-graphql');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middlewares/backend/auth')

const app = express();

/** use to authenticate users for backend services */
app.use(auth);

/** graphql setup */
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    }
  })
);

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false })); // request body parser initialization

// initalize sequelize with session store
var SequelizeStore = require("connect-session-sequelize")(session.Store);
app.use(session({secret: 'the secret', resave: false, saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize,
  }),
})); // session initialization 

const csrfProtection = csrf();
app.use(csrfProtection);
app.use(flash());

/** passing variables to views globaly */
app.use((req, res, next) => {
  const errorMessages = req.flash('errors');
  const successMessages = req.flash('success');
  res.locals.errorMessages = errorMessages;
  res.locals.successMessages = successMessages;
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

/** route middlewares */
app.use(shopRoutes);
app.use('/admin', adminRoutes);
app.use(cartRoutes);
app.use(authRoutes);
app.use(errorController.get404);


/** association definition */
Product.belongsTo(User, {constraints: true, onDelete: "CASCADE"});
User.hasMany(Product); 
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize.sync()
.then((result) => {
  app.listen(3000);
})
.catch()
