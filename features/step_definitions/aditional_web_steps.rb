Given /^I create an user named "(.*?)" and lastname "(.*?)" and the "(.*?)" department for the user$/ do |user, lastname, department_name|
  department = FactoryGirl.create(:department, name: department_name)
  user = FactoryGirl.create(:user, name: user, lastname: lastname, department: department)
end

Given /I am an authorized user/i do
  user = FactoryGirl.create(:user)
  visit "/log_in"
  fill_in("login", :with => user.login)
  fill_in("password", :with => "12345")
  click_button("LogIn")
end

Then /^I should see the following ([^"]*):$/ do |name, expected_table|
  rows = find("table").all('tr')
  table = rows.map { |r| r.all('th,td').map { |c| c.text.strip } }
  expected_table.diff!(table)
end
