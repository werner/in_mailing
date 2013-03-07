Given /^the following departments:$/ do |departments|
  Department.create!(departments.hashes)
end

When /^I delete the (\d+)(?:st|nd|rd|th) department$/ do |pos|
  visit departments_path
  within("table tr:nth-child(#{pos.to_i+1})") do
    click_link "Delete"
  end
end
