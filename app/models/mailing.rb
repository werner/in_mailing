class Mailing < ActiveRecord::Base
  attr_accessor :receiver_id, :sender_id

  scope :sent, -> (current_user) { 
    joins(:mroutes).where("mroutes.user_id = ? and mroutes.status = ?", current_user, Mroute::STATUS[:sender]) 
  }

  scope :inbox, -> (current_user) { 
    joins(:mroutes).where("mroutes.user_id = ? and mroutes.status = ?", current_user, Mroute::STATUS[:receiver]) 
  }

  has_many :mroutes
  has_many :users, :through => :mroutes

  belongs_to :type

  delegate :name, to: :type, prefix: true, allow_nil: true

  validates_presence_of :number, :message => "Insert a number"

  STATUS = {saved: 1, sent: 2}

  before_save do
    mroutes.build user_id: @sender_id, status: Mroute::STATUS[:sender]
    mroutes.build user_id: @receiver_id, status: Mroute::STATUS[:receiver]
    #If it is sent it should not be editable
    false if Mailing::STATUS.key(status_was) == :sent
  end

  def status_to_sym
    Mailing::STATUS.key(self.status)
  end

  def receiver_user_name
    mroutes.where(status: Mroute::STATUS[:receiver]).first.try(:user_name)
  end

  def receiver_department_name
    mroutes.where(status: Mroute::STATUS[:receiver]).first.try(:department_name)
  end
end
