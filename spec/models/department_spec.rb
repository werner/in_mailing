require 'spec_helper'

describe Department do
  it "stub emails_received" do
    department = double("department")
    department.stub(:emails_received) { 78 }
    department.emails_received.should eq(78)
    department.emails_received.should_not eq(88)
  end
end
