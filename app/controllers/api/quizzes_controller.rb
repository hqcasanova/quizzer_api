class Api::QuizzesController < ApplicationController

  respond_to :json

  def index
    page_no = params[:page]
    quizzes = Quiz.order(:id).page(page_no).select(:id, :title, :updated_at)
    quizzes.append(page_no.to_i == quizzes.num_pages)  #flag for the browser to stop retrieving pages
    respond_with(:api, quizzes)
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