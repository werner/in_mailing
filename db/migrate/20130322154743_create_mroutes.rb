class CreateMroutes < ActiveRecord::Migration
  def change
    create_table :mroutes do |t|
      t.references :department
      t.references :mailing
      t.integer :status

      t.timestamps
    end
  end
end
