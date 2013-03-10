class PositionsController < StandardController
  before_action :set_position, only: [:show, :edit, :update, :destroy]
  before_action :setup

  private
    # Use callbacks to share common setup or constraints between actions.
    def setup
      @main_url = positions_url
      @model = Position
    end

    def set_position
      @record = Position.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def record_params
      params.require(:position).permit(:name)
    end
end
