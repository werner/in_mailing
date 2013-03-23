class Mailing < ActiveRecord::Base
  attr_accessor :user_id

  has_many :mroutes
  has_many :users, :through => :mroutes

  belongs_to :type

  delegate :name, to: :type, prefix: true

  validates_presence_of :number, :message => "Insert a number"

  STATUS = {saved: 1, sent: 2}

  before_save do
    mroutes.build user_id: @user_id
    #If it is sent it should not be editable
    false if Mailing::STATUS.key(status_was) == :sent
  end

  def status_to_sym
    Mailing::STATUS.key(self.status)
  end

  def user_name
    mroutes.first.try(:user_name)
  end

  def department_name
    mroutes.first.try(:department_name)
  end
end
