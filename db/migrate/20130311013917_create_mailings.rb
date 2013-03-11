class CreateMailings < ActiveRecord::Migration
  def change
    create_table :mailings do |t|
      t.date       :mailing_date
      t.string     :number
      t.string     :subject
      t.references :type
      t.integer    :status
      t.text       :notes
      t.text       :body
      t.date       :received_date
      t.date       :sent_date
      t.integer    :sent_type

      t.timestamps
    end
  end
end
