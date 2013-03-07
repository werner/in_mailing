Then /^I should see the following ([^"]*):$/ do |name, expected_table|
  rows = find("table").all('tr')
  table = rows.map { |r| r.all('th,td').map { |c| c.text.strip } }
  expected_table.diff!(table)
end
