module ApplicationHelper
  def user_and_department
    "User: #{current_user.try(:login)} Department: #{current_user.try(:department_name)}"
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
end
