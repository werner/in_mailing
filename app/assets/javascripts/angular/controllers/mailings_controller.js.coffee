App.controller 'MailingsController', ['$scope', 'Mailing', ($scope, Mailing) ->
  $scope.mailings = Mailing.query()
  $scope.selectedMail = null
]
