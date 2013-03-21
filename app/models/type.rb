class Type < ActiveRecord::Base

  has_many :mailings

  validates_presence_of :name
  validates_uniqueness_of :name

end
