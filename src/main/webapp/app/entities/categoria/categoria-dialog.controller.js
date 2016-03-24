(function() {
    'use strict';

    angular
        .module('inventoryApp')
        .controller('CategoriaDialogController', CategoriaDialogController);

    CategoriaDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Categoria'];

    function CategoriaDialogController ($scope, $stateParams, $uibModalInstance, entity, Categoria) {
        var vm = this;
        vm.categoria = entity;
        vm.load = function(id) {
            Categoria.get({id : id}, function(result) {
                vm.categoria = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('inventoryApp:categoriaUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.categoria.id !== null) {
                Categoria.update(vm.categoria, onSaveSuccess, onSaveError);
            } else {
                Categoria.save(vm.categoria, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
