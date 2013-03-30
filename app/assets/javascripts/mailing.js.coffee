Mailing =
  setup: ->
    $("#mailing_receiver_id").chosen()
    tinyMCE.init
      mode: "exact"
      elements: "mailing_body"
    $("#recipients_search").submit ->
      $.get @action, $(this).serialize(), null, 'script'
      return false

Mailing.setup()
