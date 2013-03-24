Given /^the following departments:$/ do |departments|
  Department.create!(departments.hashes)
end

When /^I delete the (\d+)(?:st|nd|rd|th) department$/ do |pos|
  visit departments_path
  within("table tr:nth-child(#{pos.to_i+1})") do
    click_link "Delete"
  end
end

Given /^I create a department named "(.*?)" for "(.*?)"$/ do |department_name, full_name|
  first_name = full_name.split(" ").first
  last_name = full_name.split(" ").last
  department = FactoryGirl.create(:department, name: department_name)
  User.where(name: first_name, lastname: last_name).update_all(department_id: department.id)
end

