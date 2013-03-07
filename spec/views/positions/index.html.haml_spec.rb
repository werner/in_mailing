require 'spec_helper'

describe "positions/index" do
  before(:each) do
    assign(:positions, [
      stub_model(Position,
        :name => "Name"
      ),
      stub_model(Position,
        :name => "Name"
      )
    ])
  end

  it "renders a list of positions" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Name".to_s, :count => 2
  end
end
