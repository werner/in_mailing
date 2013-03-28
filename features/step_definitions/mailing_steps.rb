When /^I create a Type$/ do
  FactoryGirl.create(:type)
end

Given /^I create a Memo$/ do
  user = FactoryGirl.create(:user)
  FactoryGirl.create(:mailing, receiver_id: [user.id])
end
