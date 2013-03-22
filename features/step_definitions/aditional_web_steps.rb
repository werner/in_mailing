Given /I am an authorized user/i do
  user = FactoryGirl.create(:user)
  visit "/log_in"
  fill_in("login", :with => "jhon")
  fill_in("password", :with => "12345")
  click_button("LogIn")
end

Then /^I should see the following ([^"]*):$/ do |name, expected_table|
  rows = find("table").all('tr')
  table = rows.map { |r| r.all('th,td').map { |c| c.text.strip } }
  expected_table.diff!(table)
end
