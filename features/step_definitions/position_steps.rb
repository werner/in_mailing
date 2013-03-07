Given /^the following positions:$/ do |departments|
  Position.create!(departments.hashes)
end

When /^I delete the (\d+)(?:st|nd|rd|th) position$/ do |pos|
  visit positions_path
  within("table tr:nth-child(#{pos.to_i+1})") do
    click_link "Delete"
  end
end
