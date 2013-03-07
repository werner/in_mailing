Given /^the following departments:$/ do |departments|
  Department.create!(departments.hashes)
end

When /^I delete the (\d+)(?:st|nd|rd|th) department$/ do |pos|
  visit departments_path
  within("table tr:nth-child(#{pos.to_i+1})") do
    click_link "Destroy"
  end
end

Then /^I should see the following departments:$/ do |expected_departments_table|
  expected_departments_table.diff!(tableish('table tr', 'td,th'))
end
