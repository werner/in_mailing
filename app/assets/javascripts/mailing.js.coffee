Mailing =
  setup: ->
    $("#mailing_receiver_id").chosen()
    tinyMCE.init
      mode: "exact"
      elements: "mailing_body"

Mailing.setup()
