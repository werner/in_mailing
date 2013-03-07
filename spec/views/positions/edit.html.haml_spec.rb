require 'spec_helper'

describe "positions/edit" do
  before(:each) do
    @position = assign(:position, stub_model(Position,
      :name => "MyString"
    ))
  end

  it "renders the edit position form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", position_path(@position), "post" do
      assert_select "input#position_name[name=?]", "position[name]"
    end
  end
end
