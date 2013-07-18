describe 'MailingsController', ->
  it 'query all documents', ->
    scope = {}
    ctrl = new MailingsController(scope)

    expect(scope.mailings.length).toBe 3

