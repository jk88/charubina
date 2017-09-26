var User = require('../models/user');
var Navstevy = require('../models/navstevy');
var Ulovky = require('../models/ulovky');
var Oznamy = require('../models/oznamy');
var OznamyUlovky = require('../models/oznamyUlovky');
var OznamyNavstevy = require('../models/oznamyNavstevy');

var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {

	var token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expirtesInMinute: 1440
	});


	return token;

}

module.exports = function(app, express, io) {


	var api = express.Router();

	api.post('/signup', function(req, res) {

		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password,
    		bydlisko: req.body.bydlisko,
    		email: req.body.email,
    		telefon: req.body.telefon
		});
		var token = createToken(user);
		user.save(function(err) {
			if(err) {
				res.send(err);
				return;
			}

			res.json({ 
				success: true,
				message: 'User has been created!',
				meno: req.body.username,
				token: token
			});
		});
	});


	api.get('/users', function(req, res) {

		User.find({}, function(err, users) {
			if(err) {
				res.send(err);
				return;
			}

			res.json(users);

		});
	});
	
	
	

	api.post('/login', function(req, res) {

		User.findOne({ 
			username: req.body.username
		}).select('name username password').exec(function(err, user) {

			if(err) throw err;

			if(!user) {

				res.send({ message: "User doenst exist"});
			} else if(user){ 

				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.send({ message: "Invalid Password"});
				} else {

					///// token
					var token = createToken(user);

					res.json({
						success: true,
						message: "Successfuly login!",
						meno: req.body.username,
						token: token
					});
				}
			}
		});
	});

	api.use(function(req, res, next) {


		console.log("Somebody just came to our app!");

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		// check if token exist
		if(token) {

			jsonwebtoken.verify(token, secretKey, function(err, decoded) {

				if(err) {
					res.status(403).send({ success: false, message: "Failed to authenticate user"});

				} else {

					//
					req.decoded = decoded;
					next();
				}
			});
		} else {
			res.status(403).send({ success: false, message: "No Token Provided"});
		}

	});

	

	// Destination B // provide a legitimate token

	// len pre admina vrat vsetky navstevy vsetkych uzivatelov
	api.get('/all_navstevies', function(req, res) {
		//if (req.decoded.name==='admin') { //strict equality
			Navstevy.find({}, function(err, navstevies) {
				if(err) {
					res.send(err);
					return;
				}
				res.json(navstevies);
			});
		//}
		//res.json({message: "Neni si admin vole!"});
	});

	api.get('/all_ulovkies', function(req, res) {
		//if (req.decoded.name==='admin') { //strict equality
			Ulovky.find({}, function(err, ulovkies) {
				if(err) {
					res.send(err);
					return;
				}
				res.json(ulovkies);
			});
		//}
		//res.json({message: "Neni si admin vole!"});
	});

	// post/get navstevy len prihlaseneho uzivatela
	api.route('/navstevy')
		// post do navstevy prida do DB novu navstevu s prihlasenym menom
		.post(function(req, res) {

			var navstevy = new Navstevy({
				uzivatelId: req.decoded.id,
				uzivatelMeno: req.decoded.name, // viz create token
				lokalita: req.body.lokalita,
				prichod: req.body.prichod,
				odchod: req.body.odchod
			});

			navstevy.save(function(err, newNavstevy) {
				if(err) {
					res.send(err);
					return
				}
				io.emit('navstevy', newNavstevy);
				res.json({message: "Navsteva ulozena!"});
			});
			
		})
		//get z navstevy vrati len tie navstevy ktore patria prihlasenemu menu (vsetky navstevy vsetkych uzivatelov vrati vyssie all_navstevies
		.get(function(req, res) {

			Navstevy.find({ uzivatelId: req.decoded.id }, function(err, navstevies) {

				if(err) {
					res.send(err);
					return;
				}

				res.send(navstevies);
			});
		});

	api.route('/ulovky')
		// post do ulovky prida do DB novu ulovok s prihlasenym menom
		.post(function(req, res) {

			var ulovky = new Ulovky({
				uzivatelId: req.decoded.id,
				uzivatelMeno: req.decoded.name, // viz create token
				znacka: req.body.znacka,
				zver: req.body.zver
			});

			ulovky.save(function(err, newUlovky) {
				if(err) {
					res.send(err);
					return
				}
				io.emit('ulovky', newUlovky);
				res.json({message: "Ulovok ulozeny!"});
			});
			
		})
		//get z navstevy vrati len tie ulovky ktore patria prihlasenemu menu (vsetky ulovky vsetkych uzivatelov vrati vyssie all_ulovkies
		.get(function(req, res) {

			Ulovky.find({ uzivatelId: req.decoded.id }, function(err, ulovkies) {

				if(err) {
					res.send(err);
					return;
				}

				res.send(ulovkies);
			});
		});	
	
	/*api.route('/')

		.post(function(req, res) {

			var story = new Story({
				creator: req.decoded.id,
				content: req.body.content

			});

			story.save(function(err, newStory) {
				if(err) {
					res.send(err);
					return
				}
				io.emit('story', newStory);
				res.json({message: "New Story Created!"});
			});
		})


		.get(function(req, res) {

			Story.find({ creator: req.decoded.id }, function(err, stories) {

				if(err) {
					res.send(err);
					return;
				}

				res.send(stories);
			});
		});*/

	api.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	api.get('/mojProfil', function(req, res) {
		User.find({username:req.decoded.username}, function(err, user) {
			if(err) {
				res.send(err);
				return;
			}

			res.json(user);

		});
	});

	api.post('/update_profil', function(req, res) {
		console.log("Update profil");
		User.findOneAndUpdate({username:req.decoded.username}, {name: req.body.name, bydlisko: req.body.bydlisko, email: req.body.email, telefon: req.body.telefon}, function (err, user) {
			if(err) {
				res.send(err);
				return;
			}
	  		res.send(user);
		});
    });


    api.post('/update_heslo', function(req, res) {
		console.log("Update heslo");
		User.findOneAndUpdate({username:req.decoded.username}, {name: req.body.name, bydlisko: req.body.bydlisko, email: req.body.email, telefon: req.body.telefon}, function (err, user) {
			if(err) {
				res.send(err);
				return;
			}
	  		res.send(user);
		});
    });

	/*api.post('/update_navstevy', function(req, res) {
		console.log("Update navstevy");
		/*Navstevy.update(
    		{_id: req._id},
    		{$set: {lokalita: req.body.lokalita, cas: req.body.cas}, 
    			function(err, navstevies) {
					if(err) {
						res.send(err);
						return;
					}

					res.send(navstevies);
				}
			});
		Navstevy.findOneAndUpdate({_id:req._id}, req.body, function (err, navstevy) {
	  		res.send(navstevy);
		});
    });*/

	// updatuje jednu vybranu navstevu podla id, povolena editacia lokalita a cas
	api.post('/update_navstevy', function(req, res) {
		console.log("Update navstevy");
		Navstevy.findOneAndUpdate({_id:req.body._id}, {lokalita: req.body.lokalita, prichod: req.body.prichod, odchod: req.body.odchod}, function (err, navstevies) {
			if(err) {
				res.send(err);
				return;
			}
	  		res.send(navstevies);
		});
    });

    api.post('/remove_navstevy', function(req, res) {
		console.log("Remove navstevy");
		Navstevy.remove({_id:req.body._id}, function (err, navstevies) {
			if(err) {
				res.send(err);
				return;
			}
	  		res.send(navstevies);
		});
    });

    api.post('/remove_vsetky_navstevy', function(req, res) {
		console.log("Remove VSETKY navstevy");
		Navstevy.remove({}, function (err, navstevies) {
			if(err) {
				res.send(err);
				return;
			}
	  		res.send(navstevies);
		});
    });

	// updatuje jeden zvoleny ulovok podla id, povoleny edit znacka, zver, cas
    api.post('/update_ulovky', function(req, res) {
		console.log("Update ulovky");
		Ulovky.findOneAndUpdate({_id:req.body._id}, {znacka: req.body.znacka, zver: req.body.zver, cas: req.body.cas}, function (err, ulovkies) {
			if(err) {
				res.send(err);
				return;
			}
	  		res.send(ulovkies);
		});
    });

    api.post('/remove_ulovky', function(req, res) {
		console.log("Remove ulovky");
		Ulovky.remove({_id:req.body._id}, function (err, ulovkies) {
			if(err) {
				res.send(err);
				return;
			}
	  		res.send(ulovkies);
		});
    });

    api.post('/remove_vsetky_ulovky', function(req, res) {
		console.log("Remove VSETKY ulovky");
		Ulovky.remove({}, function (err, ulovkies) {
			if(err) {
				res.send(err);
				return;
			}
	  		res.send(ulovkies);
		});
    });


	//iba test updatu
	/*api.post('/najdi_navstevu', function(req, res) {
		console.log("najdi_navstevu");
		Navstevy.find({ _id: req.body._id }, function(err, navstevies) {

				if(err) {
					res.send(err);
					return;
				}

				res.send(navstevies);
			});
	});*/

	api.route('/oznamy')

		.post(function(req, res) {

			//console.log("1");
			var oznamy = new Oznamy({
				titulok: req.body.titulok,
				text: req.body.text
			});
			//console.log("2");
			oznamy.save(function(err, newOznamy) {
				if(err) {
					res.send(err);
					//console.log("3");
					return
				}
				//console.log("4");
				io.emit('oznamy', newOznamy);
				res.json({message: "Vytvoreny novy oznam!"});
			});
			//console.log("5");
		})


		.get(function(req, res) {

			Oznamy.find({}, function(err, oznamies) {

				if(err) {
					res.send(err);
					return;
				}

				res.send(oznamies);
			});
		});

	api.route('/oznamyUlovky')

		.post(function(req, res) {

			//console.log("1");
			var oznamy = new OznamyUlovky({
				titulok: req.body.titulok,
				text: req.body.text
			});
			//console.log("2");
			oznamy.save(function(err, newOznamy) {
				if(err) {
					res.send(err);
					//console.log("3");
					return
				}
				//console.log("4");
				io.emit('oznamy', newOznamy);
				res.json({message: "Vytvoreny novy oznam!"});
			});
			//console.log("5");
		})


		.get(function(req, res) {

			OznamyUlovky.find({}, function(err, oznamyUlovkies) {

				if(err) {
					res.send(err);
					return;
				}

				res.send(oznamyUlovkies);
			});
		});


		api.route('/oznamyNavstevy')

		.post(function(req, res) {

			//console.log("1");
			var oznamy = new OznamyNavstevy({
				titulok: req.body.titulok,
				text: req.body.text
			});
			//console.log("2");
			oznamy.save(function(err, newOznamy) {
				if(err) {
					res.send(err);
					//console.log("3");
					return
				}
				//console.log("4");
				io.emit('oznamy', newOznamy);
				res.json({message: "Vytvoreny novy oznam!"});
			});
			//console.log("5");
		})


		.get(function(req, res) {

			OznamyNavstevy.find({}, function(err, oznamyNavstevies) {

				if(err) {
					res.send(err);
					return;
				}

				res.send(oznamyNavstevies);
			});
		});

	api.post('/update_oznamy', function(req, res) {
		console.log("Update oznamy");
		Oznamy.findOneAndUpdate({_id:req.body._id}, {titulok: req.body.titulok, text: req.body.text}, function (err, oznamies) {
			if(err) {
				res.send(err);
				return;
			}
	  		res.send(oznamies);
		});
    });

    api.post('/update_oznamyUlovky', function(req, res) {
		console.log("Update oznamy");
		OznamyUlovky.findOneAndUpdate({_id:req.body._id}, {titulok: req.body.titulok, text: req.body.text}, function (err, oznamyUlovkies) {
			if(err) {
				res.send(err);
				return;
			}
	  		res.send(oznamyUlovkies);
		});
    });

    api.post('/update_oznamyNavstevy', function(req, res) {
		console.log("Update oznamy navstevy");
		OznamyNavstevy.findOneAndUpdate({_id:req.body._id}, {titulok: req.body.titulok, text: req.body.text}, function (err, oznamyNavstevies) {
			if(err) {
				res.send(err);
				return;
			}
	  		res.send(oznamyNavstevies);
		});
    });

    /*api.post('/najdi_oznam', function(req, res) {
		console.log("najdi_oznam");
		Navstevy.find({_id:req.body._id}, function (err, oznamies) {
				if(err) {
					res.send(err);
					return;
				}

				res.send(oznamies);
			});
	});*/

	api.post('/remove_oznamy', function(req, res) {
		console.log("Remove oznamy");
		Oznamy.remove({_id:req.body._id}, function (err, oznamies) {
			if(err) {
				res.send(err);
				return;
			}
	  		res.send(oznamies);
		});
    });

    api.post('/remove_oznamyUlovky', function(req, res) {
		console.log("Remove oznamy");
		OznamyUlovky.remove({_id:req.body._id}, function (err, oznamyUlovkies) {
			if(err) {
				res.send(err);
				return;
			}
	  		res.send(oznamyUlovkies);
		});
    });

    api.post('/remove_oznamyNavstevy', function(req, res) {
		console.log("Remove oznamy navstevy");
		OznamyNavstevy.remove({_id:req.body._id}, function (err, oznamyNavstevies) {
			if(err) {
				res.send(err);
				return;
			}
	  		res.send(oznamyNavstevies);
		});
    });


	return api;


}