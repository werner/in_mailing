class WelcomeController < ApplicationController
  #This controller is just to show a main page
  before_filter :authorize
end
