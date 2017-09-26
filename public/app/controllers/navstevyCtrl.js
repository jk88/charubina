angular.module('navstevyCtrl', ['navstevyService', 'angularjs-datetime-picker','angularUtils.directives.dirPagination'])


	.controller('NavstevyController', function($scope, $filter, Navstevy, Auth, socketio) {


		var vm = this;

		vm.loggedAdmin = Auth.isLoggedAdmin();

		//if (vm.loggedAdmin) // vsetky navstevy zobrazene len pre admina
		if (true) // poziadavka na zobrazovanie vsetkych navstev pre vsetkych
			Navstevy.allNavstevies()
				.success(function(data) {
					vm.navstevies = data;
				});
		else
			Navstevy.all()
				.success(function(data) {
					vm.navstevies = data;
				});



		//vm.aktualnyDatumCas = {};
		//vm.rowsPerPage = 5;


		vm.exportData = function() {
			var blob = new Blob([document.getElementById('exportable').innerHTML], {
            	type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        	});
        	
			var d = new Date();
			var dd = d.getDate();
			var mm = d.getMonth();
			mm++;
			var yy = d.getFullYear();
			menoSuboru = "navstevy-export-" + yy + "-" + mm + "-" + dd + ".xls";

        	saveAs(blob, menoSuboru);
		};

//////////////// ----- oznamy -------- //////////////////////

	Navstevy.all2()
		.success(function(data) {
			vm.oznamyNavstevies = data;
		});


	
	vm.createOznamyNavstevy = function() {

		vm.processing = true;


		vm.message = '';
		Navstevy.create2(vm.oznamyNavstevyData)
			.success(function(data) {
				vm.processing = false;
				//clear up the form
				vm.oznamyNavstevyData = {};

				vm.message = data.message;

				
			});

		location.reload();
		//alert("TODO: Novy oznam bude viditelny po opatovnom nacitani stranky.");
	};

	vm.eachRefNavstevy; // referencia na povodny riadok ktory sa ide editovat
	vm.lokalitaSelectedNavstevy = "";
	vm.casSelectedNavstevy = "";
	$scope.selectedRowNavstevy = null;
	vm.setClickedRowNavstevy = function(index, each){
		vm.eachRefNavstevy = each;

		$scope.selectedRowNavstevy = index;
		vm.lokalitaSelectedNavstevy = each.text;
		vm.casSelectedNavstevy = each.titulok;

	};

	vm.zrusNavstevy = function() {
		$scope.selectedRowNavstevy = null;
		vm.lokalitaSelectedNavstevy = "";
		vm.casSelectedNavstevy = "";
	};

	vm.vymazNavstevy = function (index, each) {
		var r = confirm("Naozaj si želáte vymazať záznam?");
		if (r == true) {
		    //x = "You pressed OK!";
		    Navstevy.delete2(each)
			.success(function(data) {
				vm.processing = false;
				//clear up the form
				vm.oznamyNavstevyData = {};

				vm.message = data.message;
			});
			//$scope.selectedRowNavstevy = null;

		} else {
		    //x = "You pressed Cancel!";
		}
		$scope.selectedRowNavstevy = null;
		//scope.$apply();

		location.reload();
	};

	vm.saveNavstevy = function(riadok) {
		//alert("saveNavstevy()");
		//$scope.selectedRowNavstevy = null;

		// kvoli refresh ng-repeat novymi zadanymi hodnotami po editacii
		vm.eachRefNavstevy.lokalita = vm.lokalitaSelectedNavstevy;
		vm.eachRefNavstevy.cas = vm.casSelectedNavstevy;

		vm.processing = true;

		x = {_id: riadok._id, titulok: vm.casSelectedNavstevy, text: vm.lokalitaSelectedNavstevy};

		//alert(x._id + ", " + x.lokalita + ", " + x.cas);

		vm.message = '';
		Navstevy.update2(x)
			.success(function(data) {
				vm.processing = false;
				//clear up the form
				vm.oznamyNavstevyData = {};

				vm.message = data.message;
		});

		///////// namiesto socketio.on...
		riadok.titulok = vm.casSelectedNavstevy;
		riadok.text = vm.lokalitaSelectedNavstevy;
		$scope.selectedRowNavstevy = null;
	};

	/// NEFUNGUJE PRI UPDATE NEVIEM PRECO....
	socketio.on('oznamyNavstevy', function(data) {
		vm.oznamyNavstevies.push(data);
	});

	//////////////// --------------------- //////////////////////




	/* NAVSTEVY KOD --------------------------------- */



		vm.createNavstevy = function() {

			if (isNaN(Date.parse(vm.navstevyData.prichod)) || isNaN(Date.parse(vm.navstevyData.odchod)))
			{
				alert(  "                 CHYBNY DATUM ALEBO CAS!\n"
			    	   +"---------------------------------------------------------\n"
			    	   +"Zadaj cas pomocou NASTROJA NA VYBER DATUMU A CASU, ktory sa"
			    	   +" zobrazi po kliknuti do pola pre zadavanie datumu a casu."
			    	   +"\n\n"
			    	   +"V pripade, ze sa tento nastroj nezobrazuje, alebo nepracuje spravne, "
			    	   +"je nutne zadat datum a cas presne podla nasledovneho formatu, s dodrzanim poctu aj poradia znakov, vratane pomlciek, medzier a dvojbodky:"
			    	   +"\n\n"
			    	   +"                  rrrr-mm-dd hh:xx"
			    	   +"\n\n"
			    	   +"                  kde:\n"
			    	   +"                  rrrr - rok, napr. 2016\n"
			    	   +"                  mm - mesiac, napr. 05\n"
			    	   +"                  dd - den, napr. 21\n"
			    	   +"                  hh - hodina, napr. 12\n "
			    	   +"                  xx - minuta, napr. 54");

				return;
			}



			vm.processing = true;

   


			vm.message = '';
			Navstevy.create(vm.navstevyData)
				.success(function(data) {
					vm.processing = false;
					//clear up the form
					vm.navstevyData = {};

					vm.message = data.message;

					
				});

		};


		vm.eachRef; // referencia na povodny riadok ktory sa ide editovat
		vm.lokalitaSelected = "";
		vm.prichodSelected = "";
		vm.odchodSelected = "";
  		$scope.selectedRow = null;
  		vm.setClickedRow = function(index, each){
  			vm.eachRef = each;

     		$scope.selectedRow = index;
     		vm.lokalitaSelected = each.lokalita;
     		vm.prichodSelected = each.prichod;
     		vm.odchodSelected = each.odchod;
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
			    Navstevy.delete(each)
				.success(function(data) {
					vm.processing = false;
					//clear up the form
					vm.navstevyData = {};

					vm.message = data.message;
				});
				//$scope.selectedRowNavstevy = null;

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
  			vm.eachRef.lokalita = vm.lokalitaSelected;
  			vm.eachRef.prichod = vm.prichodSelected;
  			vm.eachRef.odchod = vm.odchodSelected;

     		vm.processing = true;

     		x = {_id: riadok._id, lokalita: vm.lokalitaSelected, prichod: vm.prichodSelected, odchod: vm.odchodSelected};

     		//alert(x._id + ", " + x.lokalita + ", " + x.cas);

     		vm.message = '';
			Navstevy.update(x)
				.success(function(data) {
					vm.processing = false;
					//clear up the form
					vm.navstevyData = {};

					vm.message = data.message;

					
				});
  		};


		socketio.on('navstevy', function(data) {
			vm.navstevies.push(data);
		});

		$scope.$apply();

})

.controller('AllNavsteviesController', function(navstevies, socketio) {

	var vm = this;

	vm.navstevies = navstevies.data;

	socketio.on('navstevy', function(data) {
			vm.navstevies.push(data);
	})





});