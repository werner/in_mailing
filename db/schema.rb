# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20130322155842) do

  create_table "departments", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "mailings", force: true do |t|
    t.string   "number"
    t.string   "subject"
    t.integer  "type_id"
    t.integer  "status"
    t.text     "notes"
    t.text     "body"
    t.date     "received_date"
    t.date     "sent_date"
    t.integer  "sent_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "mroutes", force: true do |t|
    t.integer  "users_id"
    t.integer  "mailing_id"
    t.integer  "status"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "positions", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "statuses", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "types", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "login"
    t.string   "name"
    t.string   "lastname"
    t.string   "password_digest"
    t.string   "salt"
    t.integer  "department_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
