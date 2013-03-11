class Mailing < ActiveRecord::Base
  belongs_to :type

  validates_presence_of :number, :message => "Insert a number"
end
