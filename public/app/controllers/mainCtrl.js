angular.module('mainCtrl', ['textAngular', 'oznamyService'])


.controller('MainController', function($scope, $rootScope, $location, Oznamy, Auth, socketio) {

	// --------------- komprimovana kniznica na formatovanie datumu a casu http://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
	//var dateFormat=function(){var t=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,e=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,a=/[^-+\dA-Z]/g,m=function(t,e){for(t=String(t),e=e||2;t.length<e;)t="0"+t;return t};return function(d,n,r){var y=dateFormat;if(1!=arguments.length||"[object String]"!=Object.prototype.toString.call(d)||/\d/.test(d)||(n=d,d=void 0),d=d?new Date(d):new Date,isNaN(d))throw SyntaxError("invalid date");n=String(y.masks[n]||n||y.masks["default"]),"UTC:"==n.slice(0,4)&&(n=n.slice(4),r=!0);var s=r?"getUTC":"get",i=d[s+"Date"](),o=d[s+"Day"](),u=d[s+"Month"](),M=d[s+"FullYear"](),l=d[s+"Hours"](),T=d[s+"Minutes"](),h=d[s+"Seconds"](),c=d[s+"Milliseconds"](),g=r?0:d.getTimezoneOffset(),S={d:i,dd:m(i),ddd:y.i18n.dayNames[o],dddd:y.i18n.dayNames[o+7],m:u+1,mm:m(u+1),mmm:y.i18n.monthNames[u],mmmm:y.i18n.monthNames[u+12],yy:String(M).slice(2),yyyy:M,h:l%12||12,hh:m(l%12||12),H:l,HH:m(l),M:T,MM:m(T),s:h,ss:m(h),l:m(c,3),L:m(c>99?Math.round(c/10):c),t:12>l?"a":"p",tt:12>l?"am":"pm",T:12>l?"A":"P",TT:12>l?"AM":"PM",Z:r?"UTC":(String(d).match(e)||[""]).pop().replace(a,""),o:(g>0?"-":"+")+m(100*Math.floor(Math.abs(g)/60)+Math.abs(g)%60,4),S:["th","st","nd","rd"][i%10>3?0:(i%100-i%10!=10)*i%10]};return n.replace(t,function(t){return t in S?S[t]:t.slice(1,t.length-1)})}}();dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"},dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]},Date.prototype.format=function(t,e){return dateFormat(this,t,e)};
	// ------------------------------------------------------------
	
	/*$scope.pridaj = function() {
        //alert(m);
		nn = {name: $scope.meno, points: $scope.lokalita, cas: $scope.cas};
		$scope.names.splice(0, 0, nn);
		
		$scope.meno ="";
		$scope.lokalita="";
		$scope.cas="";
    }; 
	
	$scope.pridajUlovok = function() {
		//alert("kokot");
		
		today = new Date();
		var ccc = today.format("yyyy-mm-dd HH:MM:ss");
		nn = {cas: ccc, meno: $scope.menoUlovok, zver: $scope.zverUlovok, znacka: $scope.znackaUlovok};
		
		//alert(nn2.meno);
		
		$scope.ulovky.splice(0, 0, nn);
		
		$scope.menoUlovok ="";
		$scope.zverUlovok="";
		$scope.znackaUlovok="";
    }; 
	
    $scope.show = function(id) {
        ModalService.showModal({
            templateUrl: 'modal.html',
            controller: "ModalController"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                $scope.message = "You said " + result;
            });
        });
    };
	
	$scope.names = [
	{
	  name: "Michal Kovacik",
	  points: "Navtatna-Hlboká-Hliny",
	  cas: "7.8.2015 4,00-8,00"
	}, 

	{
	  name: "Robert Domanicky",
	  points: "Veľká Čierna - Bančeky",
	  cas: "6.8.2015 20:00 - 22:30"
	}, 

	{
	  name: "Vladimír Domanicky",
	  points: "Veľká Čierna - Bančeky",
	  cas: "6.8.2015 20:00 - 22:30"
	},

	{
	  name: "Filo Jozef",
	  points: "Velká Cierna - Trscová",
	  cas: "6.8.2015 19.00-23.00"
	},

	{
	  name: "Michal Siplak",
	  points: "Jasenove za Haj",
	  cas: "6.8.2015 19.00-22.30"
	},

	{
	  name: "Michal Kovacik",
	  points: "Stran -Kosariska",
	  cas: "6.8.20015 16,30-22,00"
	},

	{
	  name: "JAN JANEK",
	  points: "Jasenove Hradisko",
	  cas: "6.8.2015-4.00-8.00"
	},

	{
	  name: "Jozef Halko",
	  points: "Rajec-Stran",
	  cas: "06.08.2015 3:30-6:00"
	},

	{
	  name: "Michal Siplak",
	  points: "Jasenove za haj",
	  cas: "06.08.2015 4:00-6:00"
	},

	{
	  name: "Filo Jozef",
	  points: "V.Čierna - Bôrie",
	  cas: "05.08.2015 20:00 - 23:00"
	},

	{
	  name: "Betinský Karol",
	  points: "V.Čierna - Lúčky",
	  cas: "05.08.2015 20:00 - 23:00"
	}, 

	{
	  name: "Andrej Ševčík",
	  points: "Rajec, Trstená",
	  cas: "5.8.2015 19:30 - 22:30"
	}, 

	{
	  name: "Domanický Róbert",
	  points: "V.Čierna - Bančeky",
	  cas: "05.08.2015 20:00 - 23:00"
	},

	{
	  name: "Lukáš Šujan",
	  points: "Jasenove-Za háj,pod háj",
	  cas: "5.8.2015 19:30-22:30"
	},

	{
	  name: "Jozef Pesek",
	  points: "Rakec Vojtova",
	  cas: "5.8.2015 19.00-22.30"
	},

	{
	  name: "Jakub Gabaj",
	  points: "Rajec - Prievrat",
	  cas: "05.08.2015 19:00-22:00"
	},

	{
	  name: "Michal Siplak",
	  points: "Rajec-Suja, Pizlik",
	  cas: "5.8.2015 19.00-22.30"
	},

	{
	  name: "Miloš Kumančík",
	  points: "Rajec - Návratná - Červené smreky",
	  cas: "05.08.2015 19:00 - 22:00"
	},

	{
	  name: "Miloš Kumančík",
	  points: "Rajec - Návratná - Červené smreky",
	  cas: "05.08.2015 19:00 - 22:00"
	},

	{
	  name: "Jakub Gabaj",
	  points: "Rajec -stráň",
	  cas: "05.08.2015 15:30 - 17:30"
	}
	];
	
	$scope.ulovky = [
	{
	  cas: "2015-08-07 11:21:05",
	  meno: "Filo Jozef",
	  zver: "Diviačia-lanštiak",
	  znacka: "Di51173268,6.8.2015,21.30V.Čierna-Trscová"
	},
	
	{
	  cas: "2015-08-03 22:42:14",
	  meno: "Peter Papala",
	  zver: "Skodna",
	  znacka: "Chybny vystrel prievrat 22:00"
	},
	{
	  cas: "2015-08-02 16:09:32",
	  meno: "Domanicky Robert",
	  zver: "Diviak",
	  znacka: "V.Čierna - Kruh 1.8.2015 23:55 Di73322"
	},
	{
	  cas: "2015-08-02 08:46:40",
	  meno: "Jozef Halko",
	  zver: "Diviacia-lanstiak",
	  znacka: "DI 51173279 Rajec-pod Trstenu 1.8.2015 23:45"
	},
	{
	  cas: "2015-07-31 10:30:17",
	  meno: "Jozef Mihalec",
	  zver: "Diviačia-lanštiak",
	  znacka: "Di51173333 Jasenove-Pod hradisko 30.07.2015  22,15"
	},
	{
	  cas: "2015-07-29 01:00:24",
	  meno: "Skorcik Jozef",
	  zver: "1x chybna rana-diviača",
	  znacka: "27.7.2015 22:00"
	},
	{
	  cas: "2015-07-15 21:31:01",
	  meno: "Peter Papala",
	  zver: "Diviačia - diviača",
	  znacka: "Di51173120 Veľká Čierna - hôrky 13.7.2015, 21-30"
	},
	{
	  cas: "2015-07-15 21:28:20",
	  meno: "Ľuboš Osička",
	  zver: "Srnčia - srnec III. VT",
	  znacka: "Di 51173120 Rajec 10.7.2015"
	},
	{
	  cas: "2015-07-14 22:43:42",
	  meno: "Jozef Mihalec",
	  zver: "chybny vystrel",
	  znacka: "Jasenove-pod hradiskom 21,50"
	},
	{
	  cas: "2015-07-11 06:02:12",
	  meno: "Gažúr Ján",
	  zver: "Škodná - líška - 1 ks",
	  znacka: "Jasenové-Na Doline 11.07.2015 05:00"
	},
	{
	  cas: "2015-07-10 12:58:06",
	  meno: "Jozef Mihalec",
	  zver: "Diviačia-diviača",
	  znacka: "Di 51173334 Jasenove-Pod hradiskom 09.07.2015  22,15"
	},
	{
	  cas: "2015-07-09 10:55:42",
	  meno: "Jozef Filo",
	  zver: "Diviačia - diviača",
	  znacka: "Di 51173267, Veľká Čierna - Bôrie, 8.7.2015, 20:30"
	},
	{
	  cas: "2015-07-07 07:31:57",
	  meno: "Jozef Mihalec",
	  zver: "škodna-liška-1.kus",
	  znacka: "Jasenove-pod hradiskom 20,50"
	},
	{
	  cas: "2015-07-07 07:22:09",
	  meno: "Peter Papala",
	  zver: "Diviačia - lanštiak",
	  znacka: "Di 511 02327 Veľká Čierna -tŕstie 6.7.2015 21:30"
	},
	{
	  cas: "2015-07-07 07:07:27",
	  meno: "Miloš Kumančík",
	  zver: "Diviačia-lanštiak",
	  znacka: "Di 511 73296 Rajec - Návratná 6.7.2015 21:25"
	},
	{
	  cas: "2015-07-06 07:48:46",
	  meno: "Jozef Halko",
	  zver: "Srnčia-srnec I.VT",
	  znacka: "Di 511 73278 Rajec-Vojtová 4:35"
	},
	{
	  cas: "2015-07-05 23:06:06",
	  meno: "Jozef Mihalec",
	  zver: "chybny vystrel",
	  znacka: "05.07.2015 jasenove-pod hradiskom 09,20"
	},
	{
	  cas: "2015-07-03 16:46:56",
	  meno: "Gažúr Ján",
	  zver: "Diviačia- lanštiak",
	  znacka: "Di 511 73261- Rajec-Vojtová 2.07.2015-23:20"
	},
	{
	  cas: "2015-07-01 10:25:45",
	  meno: "Skorčik Jozef",
	  zver: "Diviačia-lanštiak 1x",
	  znacka: "DI 511 73339 Rajec-pod Dubovou,1.7.2015 1:30"
	},
	{
	  cas: "2015-07-01 10:21:11",
	  meno: "Skorčik Jozef",
	  zver: "2x ulovena škodna",
	  znacka: "30.6.2015 21:00 Rajec-pod Dubovu"
	}
	];
	
	$scope.oznamy = [
	{
	  nadpis: "Test nadpis",
	  p1: "Test vkladania oznamu, odsek 1."
	}
    ];
	
	$scope.pridajOznam = function() {
		//alert("kokot");
		
		nn = {nadpis: $scope.nadpisH, p1: $scope.textH};
		
		//alert(nn.nadpis);
		
		$scope.oznamy.splice(0, 0, nn);
		
		$scope.nadpisH ="";
		$scope.textH="";
    }; */

    var vm = this;

    vm.loggedIn = Auth.isLoggedIn();
	vm.loggedAdmin = Auth.isLoggedAdmin();
	//////////////// ----- oznamy -------- //////////////////////

	Oznamy.all()
		.success(function(data) {
			vm.oznamies = data;
		});


	
	vm.createOznamy = function() {

		vm.processing = true;


		vm.message = '';
		Oznamy.create(vm.oznamyData)
			.success(function(data) {
				vm.processing = false;
				//clear up the form
				vm.oznamyData = {};

				vm.message = data.message;

				
			});
	};

	vm.eachRef; // referencia na povodny riadok ktory sa ide editovat
	vm.lokalitaSelected = "";
	vm.casSelected = "";
	$scope.selectedRow = null;
	vm.setClickedRow = function(index, each){
		vm.eachRef = each;

		$scope.selectedRow = index;
		vm.lokalitaSelected = each.text;
		vm.casSelected = each.titulok;
	};

	vm.zrus = function() {
		$scope.selectedRow = null;
		vm.lokalitaSelected = "";
		vm.casSelected = "";
	};

	vm.vymaz = function (index, each) {
		var r = confirm("Naozaj si želáte vymazať záznam?");
		if (r == true) {
		    //x = "You pressed OK!";
		    Oznamy.delete(each)
			.success(function(data) {
				vm.processing = false;
				//clear up the form
				vm.oznamyData = {};

				vm.message = data.message;
			});
			//$scope.selectedRow = null;

		} else {
		    //x = "You pressed Cancel!";
		}
		$scope.selectedRow = null;
		//scope.$apply();

		location.reload();
	};

	vm.save = function(riadok) {
		
		//$scope.selectedRow = null;

		// kvoli refresh ng-repeat novymi zadanymi hodnotami po editacii
		vm.eachRef.lokalita = vm.lokalitaSelected;
		vm.eachRef.cas = vm.casSelected;

		vm.processing = true;

		x = {_id: riadok._id, titulok: vm.casSelected, text: vm.lokalitaSelected};

		//alert(x._id + ", " + x.lokalita + ", " + x.cas);

		vm.message = '';
		Oznamy.update(x)
			.success(function(data) {
				vm.processing = false;
				//clear up the form
				vm.oznamyData = {};

				vm.message = data.message;
		});

		///////// namiesto socketio.on...
		riadok.titulok = vm.casSelected;
		riadok.text = vm.lokalitaSelected;
		$scope.selectedRow = null;
	};

	/// NEFUNGUJE PRI UPDATE NEVIEM PRECO....
	socketio.on('oznamy', function(data) {
		vm.oznamies.push(data);
	});

	//////////////// --------------------- //////////////////////


    /*$scope.oznamy = [
	{
	  nadpis: "Test nadpis",
	  p1: "Test vkladania oznamu, odsek 1."
	}
    ];

	vm.pridajOznam = function() {
		nn = {nadpis: vm.nadpisH, p1: vm.htmlcontent};
		
		$scope.oznamy.splice(0, 0, nn);
		
		vm.nadpisH ="";
		vm.htmlcontent="";
    };*/


	$rootScope.$on('$routeChangeStart', function() {

		vm.loggedIn = Auth.isLoggedIn();

		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
			});
	});


	vm.doLogin = function() {

		vm.processing = true;

		vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;

				Auth.getUser()
					.then(function(data) {
						vm.user = data.data;
					});

				if(data.success)
					$location.path('/');
				else
					vm.error = data.message;

			});
	}


	vm.doLogout = function() {
		Auth.logout();
		$location.path('/logout');
	}
});