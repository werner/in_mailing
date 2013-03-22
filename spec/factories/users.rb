# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :user do
    login 'jhon'
    password '12345'
    password_confirmation '12345'
  end
end
