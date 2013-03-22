class Mailing < ActiveRecord::Base

  has_many :mroutes

  belongs_to :type
  delegate :name, to: :type, prefix: true

  validates_presence_of :number, :message => "Insert a number"

  STATUS = {saved: 1, sent: 2}

  #If it is sent it should not be editable
  before_save do
    false if Mailing::STATUS.key(status_was) == :sent
  end

  def status_to_sym
    Mailing::STATUS.key(self.status)
  end
end
