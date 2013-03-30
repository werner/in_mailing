require 'spec_helper'

describe Mailing do
  describe "generate automatically documents numbers" do
    def make_pair_docs(first_number, second_number)
      user = FactoryGirl.create(:user)
      document1 = FactoryGirl.create(:mailing, receiver_id: [user.id])
      document1.number = first_number
      document1.save
      document2 = FactoryGirl.create(:mailing, receiver_id: [user.id])
      document2.number.should eq(second_number)
    end

    it "should make unique and automatically documents numbers" do
      [["00002", "00003"], ["00096", "00097"], ["00510", "00511"], ["8882312421",
        "8882312422"], ["01318", "01319"], ["10022", "10023"], ["11126", "11127"]]. each do |number|
          make_pair_docs number[0], number[1]
      end
    end
  end

  describe "search by recipient" do
    before(:each) do
      department = FactoryGirl.create(:department)
      human_resources = FactoryGirl.create(:department, name: "Human Resources")
      FactoryGirl.create(:user, name: "Britney", lastname: "Spears", department: department)
      FactoryGirl.create(:user, name: "Richards", lastname: "Obama", department: human_resources)
      50.times do |n|
        FactoryGirl.create(:mailing, receiver_id: [User.find(n % 2 + 1).id])
      end
    end

    it "should search by recipient 'Britney' and return 25 documents found" do
      records = Mailing.search_by_recipients("Britney")
      records.count.should eq(25)
    end

    it "should search by recipient 'Obama' and return 25 documents found" do
      records = Mailing.search_by_recipients("Obama")
      records.count.should eq(25)
    end

    it "should search by recipient 'Peter' and return 0 documents found" do
      records = Mailing.search_by_recipients("Peter")
      records.count.should eq(0)
    end

    it "should search by recipient department 'Accounting' and return 50 documents found" do
      records = Mailing.search_by_recipients("Accounting")
      records.count.should eq(25)
    end
  end
end
