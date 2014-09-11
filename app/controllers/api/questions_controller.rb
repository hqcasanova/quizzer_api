class Api::QuestionsController < ApplicationController

  respond_to :json
  before_filter :load_quiz

  def index
    respond_with @quiz.questions.all
  end

  def show 
    respond_with @quiz.questions.find(params[:id])
  end

  def create
    respond_with @quiz.questions.create(params[:question])
  end

  def update 
    respond_with Question.update(params[:id], params[:question])
  end

  def destroy
    respond_with @quiz.questions.find(params[:id]).destroy
  end

  private

  def load_quiz
    @quiz = Quiz.find(params[:quiz_id])
  end

end