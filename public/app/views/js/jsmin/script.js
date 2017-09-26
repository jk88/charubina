
var app = angular.module('mapp', ['angularModalService']);

app.controller('mctrl', function($scope, ModalService) {
    
	var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};
	
	$scope.pridaj = function() {
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
	/*{
	  nadpis: "Test nadpis",
	  p1: "Test vkladania oznamu, odsek 1."
	}*/
    ];
	
	$scope.pridajOznam = function() {
		//alert("kokot");
		
		nn = {nadpis: $scope.nadpisH, p1: $scope.textH};
		
		//alert(nn.nadpis);
		
		$scope.oznamy.splice(0, 0, nn);
		
		$scope.nadpisH ="";
		$scope.textH="";
    }; 
});

app.controller('ModalController', function($scope, close) {
  
 $scope.close = function(result) {
 	close(result, 500); // close, but give 500ms for bootstrap to animate
 };

});