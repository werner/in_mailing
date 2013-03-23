module ApplicationHelper
  def user_and_department
    "User: #{current_user.try(:login)} Department: #{current_user.try(:department_name)}"
  end
end
