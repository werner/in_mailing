class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :login
      t.string :name
      t.string :lastname
      t.string :password_digest
      t.string :salt
      t.references :department

      t.timestamps
    end
  end
end
