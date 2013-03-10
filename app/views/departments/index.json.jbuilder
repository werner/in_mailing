json.array!(@records) do |department|
  json.extract! department, 
  json.url department_url(department, format: :json)
end
