var express 				 = require('express');
var bodyParser 			 = require('body-parser');
var path 						 = require('path');
var expressValidator = require('express-validator');
var mongojs 				 = require('mongojs');

var ObjectId = mongojs.ObjectId;
//needed to talk to DB
var db = mongojs('customerapp', ['users']);

var app = express();
var port = 3000;

// var logger = function(req, res, next) {
// 	console.log('Logging...');
// 	next();
// };

// app.use(logger);

/////////////// Body-Parser Middleware ///////////////
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


/////////////// Body-Parser Middleware ///////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/////////////// Set Static Path ///////////////
app.use(express.static(path.join(__dirname, 'public')));


/////////////// Global Vars ///////////////
app.use(function(req, res, next) {
	res.locals.errors = null;
	next();
});


/////////////// Express Validator Middleware ///////////////
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;
		while (namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));



/////////////// Dummy Data ///////////////
var users = [
	{
		id: 1,
		first_name: 'John',
		last_name: 'Doe',
		email: 'johndoe@gmail.com'
	},
	{
		id: 2,
		first_name: 'Bob',
		last_name: 'Smith',
		email: 'bobsmith@gmail.com'
	},
	{
		id: 3,
		first_name: 'Jill',
		last_name: 'Jackson',
		email: 'jjackson@gmail.com'
	}
]

/////////////// Routes ///////////////
app.get('/', function(req, res){
	// res.send('Hello Grunt!');
	// res.json(people);

	// Needed to talk to DB.
	db.users.find(function (err, docs) {
		console.log(docs);
		res.render('index', {
			title: 'Customers',
			users: docs
			//users points to docs to retrieve from DB.
		});
	});
});

app.post('/users/add', function(req, res) {

	req.checkBody('first_name', 'First Name is Required').notEmpty();
	req.checkBody('last_name', 'Last Name is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();

	var errors = req.validationErrors();

	if (errors){
		res.render('index', {
			title: 'Customers',
			users: users,
			errors: errors
		});
		console.log(errors);
	} else {
		var newUser = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email
		};
		db.users.insert(newUser, function(err, result) {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/');
			}
		});
	}
});


app.delete('/users/delete/:id', function(req, res) {
	// console.log(req.params.id);
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});


app.listen(port, function() {
	console.log(`Listening on port ${port}. BOO-YEAH!`);
});