class MailingsController < StandardController
  before_action :set_position, only: [:show, :edit, :update, :destroy]
  before_action :setup

  private
    # Use callbacks to share common setup or constraints between actions.
    def setup
      @main_path = mailings_path
      @new_path = new_mailing_path
      @edit_path = lambda { |record| edit_mailing_path(record) }
      @destroy_path = lambda { |record| mailing_path(record) }
      @model = Mailing
    end

    def set_position
      @record = Mailing.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def record_params
      params.require(:mailing).permit(:mailing_date, :number, :subject, :type, 
                                      :notes, :body, :received_date, :sent_date, :sent_type)
    end
end
