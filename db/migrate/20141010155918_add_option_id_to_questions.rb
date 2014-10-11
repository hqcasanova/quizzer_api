class AddOptionIdToQuestions < ActiveRecord::Migration
  def change
    add_column :questions, :option_id, :integer
  end
end
