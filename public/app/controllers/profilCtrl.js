angular.module('profilCtrl', ['profilService'])
	
.controller('ProfilController', function($scope, Profil, $filter, Auth, socketio) {

		var vm = this;
		vm.loggedAdmin = Auth.isLoggedAdmin();
		vm.hesloEdit = false;
		vm.noveHeslo = "";

		vm.zmenHeslo = function(){
  			vm.hesloEdit = false;

  			/*
  			 * TODO: api na change pass a service
  			 */

  			vm.noveHeslo = "";
  		};

		/*vm.datumEdit = false;
		vm.usernameEdit = false;
		vm.nameEdit = false;
		vm.bydliskoEdit = false;
		vm.emailEdit = false;
		vm.telefonEdit = false;*/

		vm.profilRecord = [
			{p1: "Dátum registrácie:", p2: "", p3: true}, // true=zablokovane napevno
			{p1: "Prihlasovacie meno:", p2: "", p3: true},
			{p1: "Meno Priezvisko:", p2: "", p3: !vm.loggedAdmin},
			{p1: "Bydlisko:", p2: "", p3: false},
			{p1: "E-mail:", p2: "", p3: false},
			{p1: "Telefón:", p2: "", p3: false}
		];


		Profil.mojProfil()
				.success(function(data) {
					vm.profilData = data;

					vm.profilRecord[0].p2 = $filter('date')(data[0].datumRegistracie, "yyyy-MM-dd HH:mm");
					vm.profilRecord[1].p2 = data[0].username;
					vm.profilRecord[2].p2 = data[0].name;
					vm.profilRecord[3].p2 = data[0].bydlisko;
					vm.profilRecord[4].p2 = data[0].email;
					vm.profilRecord[5].p2 = data[0].telefon;

					//alert(vm.profily[0].name); // prijata response je nie objekt ale pole objektov!
				});


		vm.eachRef; // referencia na povodny riadok ktory sa ide editovat
		vm.znackaSelected = "";
  		$scope.selectedRow = null;
  		vm.setClickedRow = function(index, each){
  			vm.eachRef = each;

     		$scope.selectedRow = index;
     		vm.znackaSelected = each.p2;
  		};

  		vm.save = function(riadok) {
     		
  			var i = $scope.selectedRow;
     		vm.profilRecord[i].p2 = vm.znackaSelected;

  			$scope.selectedRow = null;

  			// kvoli refresh ng-repeat novymi zadanymi hodnotami po editacii
  			vm.eachRef.p2 = vm.znackaSelected;

     		vm.processing = true;

     		//x = {_id: riadok._id, znacka: vm.znackaSelected, zver: vm.zverSelected, cas: vm.casSelected};
     		//vm.profilData

     		

     		x = {
     			datumRegistracie: vm.profilRecord[0].p2, 
     			username: vm.profilRecord[1].p2, 
     			name: vm.profilRecord[2].p2, 
     			bydlisko: vm.profilRecord[3].p2, 
     			email: vm.profilRecord[4].p2, 
     			telefon: vm.profilRecord[5].p2
     		};

     		//alert(x._id + ", " + x.lokalita + ", " + x.cas);

     		vm.message = '';
			Profil.update(x)
				.success(function(data) {
					vm.processing = false;
					//clear up the form
					vm.ulovkyData = {};

					vm.message = data.message;

					
				});
  		};

  		socketio.on('profil', function(data) {
				 vm.profilData.push(data);
				});
});