class Mailing < ActiveRecord::Base
  belongs_to :type
  delegate :name, to: :type, prefix: true

  validates_presence_of :number, :message => "Insert a number"

  STATUS = {saved: 1, sent: 2}
end
