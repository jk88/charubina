angular.module('ulovkyCtrl', ['textAngular', 'ulovkyService', 'angularUtils.directives.dirPagination'])


	.controller('UlovkyController', function($scope, Ulovky, Auth, socketio) {


		var vm = this;

		vm.loggedAdmin = Auth.isLoggedAdmin();

		if (vm.loggedAdmin)
			Ulovky.allUlovkies()
				.success(function(data) {
					vm.ulovkies = data;
				});
		else
			Ulovky.all()
				.success(function(data) {
					vm.ulovkies = data;
				});

		vm.exportData = function() {
			var blob = new Blob([document.getElementById('exportable').innerHTML], {
            	type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        	});
        	
			var d = new Date();
			var dd = d.getDate();
			var mm = d.getMonth();
			mm++;
			var yy = d.getFullYear();
			menoSuboru = "ulovky-export-" + yy + "-" + mm + "-" + dd + ".xls";

        	saveAs(blob, menoSuboru);
		};


//////////////// ----- oznamy -------- //////////////////////

	Ulovky.all2()
		.success(function(data) {
			vm.oznamyUlovkies = data;
		});


	
	vm.createOznamyUlovky = function() {

		vm.processing = true;


		vm.message = '';
		Ulovky.create2(vm.oznamyUlovkyData)
			.success(function(data) {
				vm.processing = false;
				//clear up the form
				vm.oznamyUlovkyData = {};

				vm.message = data.message;

				
			});

		location.reload();
		//alert("TODO: Novy oznam bude viditelny po opatovnom nacitani stranky.");
	};

	vm.eachRefUlovky; // referencia na povodny riadok ktory sa ide editovat
	vm.lokalitaSelectedUlovky = "";
	vm.casSelectedUlovky = "";
	$scope.selectedRowUlovky = null;
	vm.setClickedRowUlovky = function(index, each){
		vm.eachRefUlovky = each;

		$scope.selectedRowUlovky = index;
		vm.lokalitaSelectedUlovky = each.text;
		vm.casSelectedUlovky = each.titulok;

	};

	vm.zrusUlovky = function() {
		$scope.selectedRowUlovky = null;
		vm.lokalitaSelectedUlovky = "";
		vm.casSelectedUlovky = "";
	};

	vm.vymazUlovky = function (index, each) {
		var r = confirm("Naozaj si želáte vymazať záznam?");
		if (r == true) {
		    //x = "You pressed OK!";
		    Ulovky.delete2(each)
			.success(function(data) {
				vm.processing = false;
				//clear up the form
				vm.oznamyUlovkyData = {};

				vm.message = data.message;
			});
			//$scope.selectedRowUlovky = null;

		} else {
		    //x = "You pressed Cancel!";
		}
		$scope.selectedRowUlovky = null;
		//scope.$apply();

		location.reload();
	};

	vm.saveUlovky = function(riadok) {
		alert("saveUlovky()");
		//$scope.selectedRowUlovky = null;

		// kvoli refresh ng-repeat novymi zadanymi hodnotami po editacii
		vm.eachRefUlovky.lokalita = vm.lokalitaSelectedUlovky;
		vm.eachRefUlovky.cas = vm.casSelectedUlovky;

		vm.processing = true;

		x = {_id: riadok._id, titulok: vm.casSelectedUlovky, text: vm.lokalitaSelectedUlovky};

		//alert(x._id + ", " + x.lokalita + ", " + x.cas);

		vm.message = '';
		Ulovky.update2(x)
			.success(function(data) {
				vm.processing = false;
				//clear up the form
				vm.oznamyUlovkyData = {};

				vm.message = data.message;
		});

		///////// namiesto socketio.on...
		riadok.titulok = vm.casSelectedUlovky;
		riadok.text = vm.lokalitaSelectedUlovky;
		$scope.selectedRowUlovky = null;
	};

	/// NEFUNGUJE PRI UPDATE NEVIEM PRECO....
	socketio.on('oznamyUlovky', function(data) {
		vm.oznamyUlovkies.push(data);
	});

	//////////////// --------------------- //////////////////////


	
	///ulovkyriadky/////
	vm.createUlovky = function() {

			vm.processing = true;

   
			vm.message = '';
			Ulovky.create(vm.ulovkyData)
				.success(function(data) {
					vm.processing = false;
					//clear up the form
					vm.ulovkyData = {};

					vm.message = data.message;

					
				});

		};

		vm.eachRef; // referencia na povodny riadok ktory sa ide editovat
		vm.znackaSelected = "";
		vm.zverSelected = "";
		vm.casSelected = "";
  		$scope.selectedRow = null;
  		vm.setClickedRow = function(index, each){
  			vm.eachRef = each;

     		$scope.selectedRow = index;
     		vm.znackaSelected = each.znacka;
			vm.zverSelected = each.zver;
			vm.casSelected = each.cas;
  		};

  		vm.setClickedRowVymaz = function(index, each){
  			vm.eachRef = each;

     		$scope.selectedRow = index;
     		//vm.znackaSelected = each.znacka;
			//vm.zverSelected = each.zver;
			//vm.casSelected = each.cas;




			var r = confirm("Naozaj si želáte vymazať záznam?");
			if (r == true) {
			    //x = "You pressed OK!";
			    Ulovky.delete(each)
				.success(function(data) {
					vm.processing = false;
					//clear up the form
					vm.ulovkyData = {};

					vm.message = data.message;
				});
				//$scope.selectedRowUlovky = null;

			} else {
			    //x = "You pressed Cancel!";
			}
			$scope.selectedRow = null;
			//scope.$apply();

			location.reload();
  		};

  		vm.save = function(riadok) {
     		
  			$scope.selectedRow = null;

  			// kvoli refresh ng-repeat novymi zadanymi hodnotami po editacii
  			vm.eachRef.znacka = vm.znackaSelected;
  			vm.eachRef.zver = vm.zverSelected;
  			vm.eachRef.cas = vm.casSelected;

     		vm.processing = true;

     		x = {_id: riadok._id, znacka: vm.znackaSelected, zver: vm.zverSelected, cas: vm.casSelected};

     		//alert(x._id + ", " + x.lokalita + ", " + x.cas);

     		vm.message = '';
			Ulovky.update(x)
				.success(function(data) {
					vm.processing = false;
					//clear up the form
					vm.ulovkyData = {};

					vm.message = data.message;

					
				});
  		};

		socketio.on('ulovky', function(data) {
			vm.ulovkies.push(data);
		})
	/////koniec ulovkyriadky////
	



})

.controller('AllNavsteviesController', function(ulovkies, socketio) {

	var vm = this;

	vm.ulovkies = ulovkies.data;

	socketio.on('ulovky', function(data) {
			vm.ulovkies.push(data);
	});



});