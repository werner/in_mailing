class UsersController < StandardController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  before_action :setup

  def create
    @record = @model.new(record_params)

    respond_to do |format|
      if @record.save
        redirect_to root_url, :notice => "Signed Up!"
      else
        format.html { render action: 'new' }
        format.json { render json: @record.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def setup
      @main_path = users_path
      @new_path = new_user_path
      @edit_path = lambda { |record| edit_user_path(record) }
      @destroy_path = lambda { |record| user_path(record) }
      @model = User
    end

    def set_user
      @record = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def record_params
      params.require(:user).permit(:login, :name, :lastname, :password, :password_confirmation, :department_id)
    end
end
