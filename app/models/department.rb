class Department < ActiveRecord::Base
  validates_presence_of :name
  validates_uniqueness_of :name

  def self.options_for_search
    all.unshift(new(id: 0, name: "Select Department"))
  end
end
