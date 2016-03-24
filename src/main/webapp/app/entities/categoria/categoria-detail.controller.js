(function() {
    'use strict';

    angular
        .module('inventoryApp')
        .controller('CategoriaDetailController', CategoriaDetailController);

    CategoriaDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Categoria'];

    function CategoriaDetailController($scope, $rootScope, $stateParams, entity, Categoria) {
        var vm = this;
        vm.categoria = entity;
        vm.load = function (id) {
            Categoria.get({id: id}, function(result) {
                vm.categoria = result;
            });
        };
        var unsubscribe = $rootScope.$on('inventoryApp:categoriaUpdate', function(event, result) {
            vm.categoria = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
