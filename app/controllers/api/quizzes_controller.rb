class Api::QuizzesController < ApplicationController

  respond_to :json

  def index
    respond_with(:api, Quiz.all)
  end

  def show 
    respond_with(:api, Quiz.find(params[:id]))
  end

  def create
    respond_with(:api, Quiz.create(quiz_params))
  end

  def update 
    respond_with(:api, Quiz.update(params[:id], quiz_params))
  end

  def destroy
    respond_with(:api, Quiz.find(params[:id]).destroy)
  end

  private 

  def quiz_params
    params.require(:quiz).permit(:title)
  end

end