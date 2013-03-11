class TypesController < StandardController
  before_action :set_type, only: [:show, :edit, :update, :destroy]
  before_action :setup

  private
    # Use callbacks to share common setup or constraints between actions.
    def setup
      @main_path = types_path
      @new_path = new_type_path
      @edit_path = lambda { |record| edit_type_path(record) }
      @destroy_path = lambda { |record| type_path(record) }
      @model = Type
    end

    def set_type
      @record = Type.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def record_params
      params.require(:type).permit(:name)
    end
end
