When /^I create a Type$/ do
  FactoryGirl.create(:type)
end

Given /^I create a Memo with number "(.*)"$/ do |number|
  FactoryGirl.create(:mailing, number: number)
end
