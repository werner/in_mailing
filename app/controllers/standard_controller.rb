class StandardController < ApplicationController

  before_filter :authorize

  def index
    @records = @model.all
  end

  def show
  end

  def new
    @record = @model.new
  end

  def edit
  end

  def create
    @record = @model.new(record_params)

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

  def destroy
    @record.destroy
    respond_to do |format|
      format.html { redirect_to @main_path }
      format.json { head :no_content }
    end
  end
end
