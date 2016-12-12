var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
			.when('/', {
				templateUrl: 'pages/home.html'
			})
			.when('/catalogo/:objName/:pag', {
				templateUrl: 'pages/catalogo.html',
				controller: 'catalogCtrl'
			})
			.when('/cart', {
				templateUrl: 'pages/carrello.html'
			})
			.otherwise({
				redirectTo: '/'
			});
			$locationProvider.html5Mode(false);
}]);

app.service('getCatalog', ['$http', function($http){
	var refService = this;
	this.list = [];
	this.askForList = function(info) {
		$http.get(info.source)
			.then(
				function(resp){
					refService.list = resp.data[info.objName];
				},
				function(){
					console.log('Richiesta fallita!');
				}
			);
	};
	this.getList = function(){
		return refService.list;
	};
}]);

app.controller('catalogCtrl', ['$scope', 'getCatalog', '$routeParams', function($scope, getCatalog, $routeParams) {
	$scope.infoService = {
		source : "json/"+$routeParams.objName+".json",
		objName : $routeParams.objName
	};
	$scope.pagina = $routeParams.pag;
	$scope.service = getCatalog;
	getCatalog.askForList($scope.infoService);
	$scope.$watch ('service.getList()', function(val){
		$scope.listaFoto = val;
	});
}]);

app.controller('cartCtrl', ['$scope', function($scope) {
	$scope.cart = {};
	$scope.totalPrice = 0;
	$scope.addCart = function(sel){
		if(angular.isUndefined($scope.cart[sel.nome])){
			$scope.cart[sel.nome] = angular.copy(sel);
		}
		else {
			$scope.cart[sel.nome].quantita = sel.quantita;
		}
	};
	$scope.remove = function(nome){
		delete $scope.cart[nome];
		$scope.calculateTot();
	};
	$scope.calculateTot = function(){
		var tot = 0;
		angular.forEach($scope.cart, function(value, key){
			tot += value.prezzo * value.quantita;
		});
		$scope.totalPrice = tot;
	};
}]);

app.controller('selectionsCtrl', ['$scope', function($scope) {
	$scope.selected = '';
	$scope.initSelected = function(nome, url, prezzo){
		$scope.selected = {
			nome: nome,
			url : url,
			prezzo : prezzo,
			quantita : 0
		};
	};
}]);

app.controller('scontoCtrl', ['$scope', function($scope) {
	$scope.sconto = 0;
	$scope.calculateDiscount = function(val){
		var sconto = val/10;
		if(sconto >= 1) $scope.sconto = Math.floor(sconto);
		else $scope.sconto = 0;
	};
}]);
