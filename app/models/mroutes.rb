class Mroutes < ActiveRecord::Base
  belongs_to :mailing
  belongs_to :users

  STATUS = {sender: 1, receiver: 2}
end
