(function() {
    'use strict';

    angular
        .module('inventoryApp')
        .controller('CategoriaDeleteController',CategoriaDeleteController);

    CategoriaDeleteController.$inject = ['$uibModalInstance', 'entity', 'Categoria'];

    function CategoriaDeleteController($uibModalInstance, entity, Categoria) {
        var vm = this;
        vm.categoria = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Categoria.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
