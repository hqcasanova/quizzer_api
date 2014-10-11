class Question < ActiveRecord::Base

  belongs_to :quiz
  belongs_to :option
  has_many :options

end
