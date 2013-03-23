# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :mroute do
    mailing
    user
  end
end
