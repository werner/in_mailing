class CreateMroutes < ActiveRecord::Migration
  def change
    create_table :mroutes do |t|
      t.references :users
      t.references :mailing
      t.integer :status

      t.timestamps
    end
  end
end
