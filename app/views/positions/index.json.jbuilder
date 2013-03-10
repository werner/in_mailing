json.array!(@records) do |record|
  json.extract! record, :name
  json.url position_url(record, format: :json)
end
