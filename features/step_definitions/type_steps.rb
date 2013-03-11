Given /^the following types:$/ do |types|
  Type.create!(types.hashes)
end

When /^I delete the (\d+)(?:st|nd|rd|th) type$/ do |pos|
  visit types_path
  within("table tr:nth-child(#{pos.to_i+1})") do
    click_link "Delete"
  end
end
