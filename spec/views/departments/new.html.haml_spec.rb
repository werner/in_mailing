require 'spec_helper'

describe "departments/new" do
  before(:each) do
    assign(:department, stub_model(Department).as_new_record)
  end

  it "renders new department form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", departments_path, "post" do
    end
  end
end
