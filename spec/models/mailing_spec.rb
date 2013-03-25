require 'spec_helper'

describe Mailing do
  def make_pair_docs(number)
    document1 = FactoryGirl.create(:mailing)
    document2 = FactoryGirl.create(:mailing)
    document2.number.should eq(number)
  end
  it "should make unique and automatically documents numbers" do
    make_pair_docs("00002")
    make_pair_docs("00004")
    make_pair_docs("00006")
    make_pair_docs("00008")
    make_pair_docs("00010")
    make_pair_docs("00012")
    make_pair_docs("00014")
    make_pair_docs("00016")
    make_pair_docs("00018")
    make_pair_docs("00020")
    make_pair_docs("00022")
    make_pair_docs("00024")
    make_pair_docs("00026")
    make_pair_docs("00028")
  end
end
