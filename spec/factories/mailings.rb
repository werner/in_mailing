# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :mailing do
    subject "Important Memo!"
    number "0001"
    body "A very very important message"
  end
end
