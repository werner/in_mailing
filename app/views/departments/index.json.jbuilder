json.array!(@departments) do |department|
  json.extract! department, 
  json.url department_url(department, format: :json)
end