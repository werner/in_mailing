Given /^I create an user named "(.*?)" and lastname "(.*?)"$/i do |user, lastname|
  FactoryGirl.create(:user, name: user, lastname: lastname)
end

Given /^I create a department named "(.*?)" for "(.*?)"$/ do |department_name, full_name|
  first_name = full_name.split(" ").first
  last_name = full_name.split(" ").last
  department = FactoryGirl.create(:department, name: department_name)
  User.where(name: first_name, lastname: last_name).update_all(department_id: department.id)
end

Given /^I am an authorized user$/i do
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

Given /^I logged in as "(.*?)"$/i do |full_name|
  first_name = full_name.split(" ").first
  last_name = full_name.split(" ").last
  user = User.where(name: first_name, lastname: last_name).first
  visit "/log_in"
  fill_in("login", :with => user.login)
  fill_in("password", :with => "12345")
  click_button("LogIn")
end

Then /^I logged out$/i do
  click_link("LogOut")
end
