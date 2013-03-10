class DepartmentsController < StandardController
  before_action :set_department, only: [:show, :edit, :update, :destroy]
  before_action :setup

  private
    # Use callbacks to share common setup or constraints between actions.
    def setup
      @main_url = departments_url
      @model = Department
    end

    def set_department
      @record = Department.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def record_params
      params.require(:department).permit(:name)
    end
end
