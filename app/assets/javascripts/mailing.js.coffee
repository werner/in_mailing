Mailing =
  setup: ->
    $("#mailing_receiver_id").chosen()

    $("#recipients_search").submit ->
      $.get @action, $(this).serialize(), null, 'script'
      return false

Mailing.setup()
