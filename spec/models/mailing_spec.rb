require 'spec_helper'

describe Mailing do
  def make_pair_docs(first_number, second_number)
    document1 = FactoryGirl.create(:mailing)
    document1.number = first_number
    document1.save
    document2 = FactoryGirl.create(:mailing)
    document2.number.should eq(second_number)
  end

  it "should make unique and automatically documents numbers" do
    [["00002", "00003"], ["00096", "00097"], ["00510", "00511"], ["8882312421",
      "8882312422"], ["01318", "01319"], ["10022", "10023"], ["11126", "11127"]]. each do |number|
        make_pair_docs number[0], number[1]
    end
  end
end
