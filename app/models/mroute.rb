class Mroute < ActiveRecord::Base
  belongs_to :mailing
  belongs_to :user

  STATUS = {sender: 1, receiver: 2}

  def user_name
    user.try(:full_name)
  end

  def department_name
    user.try(:department).try(:name)
  end
end
