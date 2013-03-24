require 'spec_helper'

describe Mailing do
  it "should make unique and automatically documents numbers" do
    document1 = FactoryGirl.create(:mailing)
    document2 = FactoryGirl.create(:mailing)
    document2.number.should_be eq("0002")
  end
end
