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
  rows = find("table").all('tr')
  table = rows.map { |r| r.all('th,td').map { |c| c.text.strip } }
  expected_departments_table.diff!(table)
end
