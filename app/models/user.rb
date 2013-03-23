class User < ActiveRecord::Base
  has_secure_password
  validates_presence_of :password, :on => :create
  validates_presence_of :name
  validates_presence_of :lastname

  belongs_to :department
  delegate :name, to: :department, prefix: true, :allow_nil => true

  def full_name
    "#{name} #{lastname}"
  end
end
