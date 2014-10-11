# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# Create a few users
10.times do
  User.create(email: Faker::Internet.safe_email)
end

100.times do
  # Create a quiz
  random_date = (rand*100).days.ago
  quiz = Quiz.create(title: Faker::Company.bs, created_at: random_date, updated_at: random_date)

  # Create some questions and options. Randomly choose an option as the correct answer.
  prefixes = ["How does one", "Choose the proper way to", "What best describes"]
  10.times do
    question = Question.create(quiz_id: quiz.id, title: "#{prefixes.sample} #{Faker::Hacker.verb} #{Faker::Hacker.noun.pluralize}?")
    4.times do 
      Option.create(question_id: question.id, title: Faker::Lorem.sentence)
    end
    question.update(option_id: question.options.pluck(:id).sample)
  end
end

quiz = Quiz.create(title: "A speckle in the Atlantic: Tenerife")

question = Question.create(quiz_id: quiz.id, title: "How tall is Mount Teide?")
Option.create(question_id: question.id, title: "2500 - 3000");
Option.create(question_id: question.id, title: "3000 - 3500");
Option.create(question_id: question.id, title: "3500 - 4000");

question = Question.create(quiz_id: quiz.id, title: "What's the population of Tenerife?")
Option.create(question_id: question.id, title: "0 - 250,000");
Option.create(question_id: question.id, title: "250,000 - 500,000");
Option.create(question_id: question.id, title: "500,000 - 750,000");
Option.create(question_id: question.id, title: "750,000 - 1,000,000");

question = Question.create(quiz_id: quiz.id, title: "How many airports are there on the island?")
Option.create(question_id: question.id, title: "1");
Option.create(question_id: question.id, title: "2");
Option.create(question_id: question.id, title: "3");


