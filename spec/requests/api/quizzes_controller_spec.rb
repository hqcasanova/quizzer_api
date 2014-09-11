require 'spec_helper'

describe Api::QuizzesController do

  it "should get all quizzes" do
    get '/api/quizzes', format: :json
    response.should be_success
  end

  it "should be able to create a new quiz" do
    post '/api/quizzes', quiz: {title: "New quiz"}, format: :json
    response.should be_success
    JSON.parse(response.body)['title'].should == 'New quiz'
  end

  it "should get a specified quiz" do
    quiz = Quiz.create(title: "New quiz")
    get "/api/quizzes/#{quiz.id}"
    response.should be_success
    JSON.parse(response.body)['title'].should == 'New quiz'
  end

  it "should be able to update a specified quiz"

  it "should be able to delete a quiz"

end