var express 		= require('express');
var bodyParser 	= require('body-parser');
var path 				= require('path');

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
	res.render('index', {
		title: 'Customers',
		users: users
	});
});


app.listen(port, function() {
	console.log(`Listening on port ${port}. BOO-YEAH!`);
});