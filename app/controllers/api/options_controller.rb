class Api::OptionsController < ApplicationController

  respond_to :json
  
  before_filter :load_question

  def index
    respond_with(:api, @question.options.all)
  end

  def show 
    respond_with(:api, @question.options.find(params[:id]))
  end

  def create
    respond_with(:api, @question.options.create(params[:option]))
  end

  def update 
    respond_with(:api, Option.update(params[:id], params[:option]))
  end

  def destroy
    respond_with(:api, @question.options.find(params[:id]).destroy)
  end

  private

  def load_question
    @question = Question.find(params[:question_id])
  end

end