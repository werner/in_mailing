require 'spec_helper'

describe "departments/index" do
  before(:each) do
    assign(:departments, [
      stub_model(Department),
      stub_model(Department)
    ])
  end

  it "renders a list of departments" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
  end
end
