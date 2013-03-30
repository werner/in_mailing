class MailingsController < StandardController
  before_action :set_mailing, only: [:show, :edit, :update, :destroy]
  before_action :setup
  before_action :set_status, only: [:create, :update]

  def index
    @records = if params[:type] == "sent" || params[:type] == "unsent" || params[:type] == "inbox"
                 Mailing.send(params[:type].to_sym, current_user)
                 .search_by_recipients(params[:search_user], params[:search_department])
                 .paginate(page: params[:page], per_page: 10)
               end
  end

  def create
    @record = @model.new(record_params)

    @record.receiver_id = params[:mailing][:receiver_id]

    respond_to do |format|
      if @record.save
        format.html { redirect_to @main_path, notice: 'successfully created.' }
        format.json { head :no_content }
      else
        format.html { render action: 'new' }
        format.json { render json: @record.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @record.receiver_id = params[:mailing][:receiver_id]
    respond_to do |format|
      if @record.update(record_params)
        format.html { redirect_to @main_path, notice: 'successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @record.errors, status: :unprocessable_entity }
      end
    end
  end

  private

    def setup
      @main_path = sent_path
      @new_path = new_mailing_path
      @edit_path = lambda { |record| edit_mailing_path(record) }
      @show_path = lambda { |record| mailing_path(record) }
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
