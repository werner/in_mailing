class Mailing < ActiveRecord::Base
  attr_accessor :receiver_id, :sender_id

  validates_presence_of :receiver_id

  scope :sent, -> (current_user) { 
    joins(:mroutes).where("mailings.status = ? and mroutes.user_id = ? and mroutes.status = ?", 
                          Mailing::STATUS[:sent], current_user, Mroute::STATUS[:sender])
  }

  scope :unsent, -> (current_user) { 
    joins(:mroutes).where("mailings.status = ? and mroutes.user_id = ? and mroutes.status = ?", 
                          Mailing::STATUS[:saved], current_user, Mroute::STATUS[:sender])
  }

  scope :inbox, -> (current_user) { 
    joins(:mroutes).where("mroutes.user_id = ? and mroutes.status = ?", current_user, Mroute::STATUS[:receiver])
  }

  has_many :mroutes, dependent: :destroy
  has_many :users, :through => :mroutes

  belongs_to :type

  delegate :name, to: :type, prefix: true, allow_nil: true

  STATUS = {saved: 1, sent: 2}

  before_create do
    mroutes.build user_id: @sender_id, status: Mroute::STATUS[:sender]
    self.number = self.class.next_number
  end

  before_save do
    mroutes.where(status: Mroute::STATUS[:receiver]).destroy_all
    @receiver_id.each { |receiver_id| mroutes.build user_id: receiver_id, status: Mroute::STATUS[:receiver] }
    #If it is sent it should not be editable
    false if Mailing::STATUS.key(status_was) == :sent
  end
  
  def status_to_sym
    Mailing::STATUS.key(self.status)
  end

  def human_sent_type
    {'Inner Mail' => 1, 'Outer Mail' => 2}.each {|key, value| return key if value == sent_type }
  end

  def receivers
    mroutes.where(status: Mroute::STATUS[:receiver]).map {|route| 
      route.user_name + ", from: " + route.department_name 
    }.join("; ")
  end

  def self.next_number

    generate_integer_number = lambda do |number|
      if number.nil?
        1
      else
        number.gsub(/[a-z]*/,"").to_i + 1
      end
    end

    next_integer_number = generate_integer_number.call(last.try(:number))


    generate_zeros = lambda do |x|
      {4=>10, 3=>100, 2=>1000, 1=>10000}.map { |k,v|
        if x > 10000
          return ""
        elsif x < v
          return k.times.collect { "0" }.join
        end
      }
    end
    generate_zeros.call(next_integer_number).to_s + next_integer_number.to_s
  end
end
