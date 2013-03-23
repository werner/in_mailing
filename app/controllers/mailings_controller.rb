class MailingsController < StandardController
  before_action :set_mailing, only: [:show, :edit, :update, :destroy]
  before_action :setup
  before_action :set_status, only: [:create, :update]

  def index
    @records = if params[:type] == "sent"
                 Mailing.sent(current_user)
               elsif params[:type] == "inbox"
                 Mailing.inbox(current_user)
               end
  end

  private
    def setup
      @main_path = sent_path
      @new_path = new_mailing_path
      @edit_path = lambda { |record| edit_mailing_path(record) }
      @destroy_path = lambda { |record| mailing_path(record) }
      @model = Mailing
    end

    def set_mailing
      @record = Mailing.find(params[:id])
    end

    def record_params
      params.require(:mailing).permit(:mailing_date, :number, :subject, :type, :status, :type_id, 
                                      :sender_id, :receiver_id,
                                      :notes, :body, :received_date, :sent_date, :sent_type)
    end

    def set_status
      params[:mailing][:sender_id] = current_user.id
      {"Save" => :saved, "Send" => :sent}.each {|key, value| 
        params[:mailing][:status] = Mailing::STATUS[value] if params[:commit] == key 
      }
    end
end
