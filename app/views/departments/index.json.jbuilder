json.array!(@records) do |record|
  json.extract! record, :name
  json.url department_url(record, format: :json)
end
