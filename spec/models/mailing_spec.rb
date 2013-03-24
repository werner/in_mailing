require 'spec_helper'

describe Mailing do
  it "should make unique and automatically documents numbers" do
    document1 = FactoryGirl.create(:mailing)
    document2 = FactoryGirl.create(:mailing)
    document2.number.should eq("00002")
  end
end
