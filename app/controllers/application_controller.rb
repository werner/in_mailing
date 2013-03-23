class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  protected

  def authorize
    redirect_to log_in_path unless User.where(id: session[:user_id]).first
  end

end
