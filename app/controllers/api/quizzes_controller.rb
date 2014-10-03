class Api::QuizzesController < ApplicationController

  respond_to :json

  def index
    page_no = params[:page]
    quizzes = Quiz.order('updated_at DESC').page(page_no).select(:id, :title, :updated_at)
    last_page = quizzes.num_pages
    quizzes.append(page_no.to_i == last_page)  #flag for the browser to stop retrieving pages
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