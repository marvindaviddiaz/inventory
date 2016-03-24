(function() {
    'use strict';

    angular
        .module('inventoryApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('categoria', {
            parent: 'entity',
            url: '/categoria?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Categorias'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/categoria/categorias.html',
                    controller: 'CategoriaController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }]
            }
        })
        .state('categoria-detail', {
            parent: 'entity',
            url: '/categoria/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Categoria'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/categoria/categoria-detail.html',
                    controller: 'CategoriaDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Categoria', function($stateParams, Categoria) {
                    return Categoria.get({id : $stateParams.id});
                }]
            }
        })
        .state('categoria.new', {
            parent: 'categoria',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/categoria/categoria-dialog.html',
                    controller: 'CategoriaDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                nombre: null,
                                descripcion: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('categoria', null, { reload: true });
                }, function() {
                    $state.go('categoria');
                });
            }]
        })
        .state('categoria.edit', {
            parent: 'categoria',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/categoria/categoria-dialog.html',
                    controller: 'CategoriaDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Categoria', function(Categoria) {
                            return Categoria.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('categoria', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('categoria.delete', {
            parent: 'categoria',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/categoria/categoria-delete-dialog.html',
                    controller: 'CategoriaDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Categoria', function(Categoria) {
                            return Categoria.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('categoria', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
