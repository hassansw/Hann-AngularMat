angular
  .module('App',['ngMaterial','users'])
  .config(function($mdThemingProvider, $mdIconProvider){
    $mdIconProvider.defaultIconSet("assets/svg/avatars.svg",128);
  })
  .controller('AppCtrl', function ($scope, $timeout, $mdSidenav){
    $scope.isSidenavOpen = false;

    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();
    };



  })
  .run(function ($log){
    $log.debug("App Started");
  });
