module ApplicationHelper
  def user_and_department
    "User: #{current_user.try(:full_name)} Department: #{current_user.try(:department_name)}"
  end

  def get_mail_path_by_url(url)
    eval(url + "_path") if url == "sent" || url == "unsent" || url == "inbox" 
  end
end
