class User < ActiveRecord::Base
  has_secure_password
  validates_presence_of :password, :on => :create
  validates_presence_of :name
  validates_presence_of :lastname
  validates_presence_of :department_id

  belongs_to :department
  delegate :name, to: :department, prefix: true, :allow_nil => true

  def self.options_for_search
    all.unshift(new(id: 0, name: "Select User"))
  end

  def full_name
    "#{name} #{lastname}"
  end
end
