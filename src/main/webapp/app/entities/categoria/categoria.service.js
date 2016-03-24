(function() {
    'use strict';
    angular
        .module('inventoryApp')
        .factory('Categoria', Categoria);

    Categoria.$inject = ['$resource'];

    function Categoria ($resource) {
        var resourceUrl =  'api/categorias/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
