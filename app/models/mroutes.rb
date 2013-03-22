class Mroutes < ActiveRecord::Base
  belongs_to :mailing
  belongs_to :department
end
