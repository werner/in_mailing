json.array!(@records) do |position|
  json.extract! position, :name
  json.url position_url(position, format: :json)
end
