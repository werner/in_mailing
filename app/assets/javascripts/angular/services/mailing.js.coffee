App.factory 'Mailing', ['$resource', ($resource) ->
  $resource '/mailings/:id', id: '@id'
]
