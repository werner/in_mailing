# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :user do
    sequence(:login, 1000, aliases: [:sender, :receiver]) {|l| "jhon#{l}"}
    name 'Jhon'
    lastname 'Jhonson'
    password '12345'
    password_confirmation '12345'
  end
end
