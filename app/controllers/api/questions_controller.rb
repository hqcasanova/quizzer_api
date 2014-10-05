class Api::QuestionsController < ApplicationController

  respond_to :json
  before_filter :load_quiz

  def index
    all_questions = @quiz.questions.all
    if (params[:options] && params[:page])  #include options with every question and paginate (1 question + options / page)
      page_no = params[:page]
      question = all_questions.order('title').page(page_no).per(1)
      question_id = question.pluck(:id)[0]
      respond_with [{
        :title => question.pluck(:title)[0], 
        :options => all_questions.find(question_id).options.pluck(:title).sort
      }, (page_no.to_i == question.num_pages)]    #flag for the browser to stop retrieving pages
    else
      respond_with all_questions
    end
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