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

# Create a quiz
quiz = Quiz.create(title: "Rails Fundamentals")

# Create some questions and options
prefixes = ["How does one", "Choose the proper way to", "What best describes"]
10.times do
  question = Question.create(quiz_id: quiz.id, title: "#{prefixes.sample} #{Faker::Hacker.verb} #{Faker::Hacker.noun.pluralize}?")
  4.times do 
    Option.create(question_id: question.id, title: Faker::Lorem.sentence)
  end
end


