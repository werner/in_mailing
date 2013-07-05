Inmailing::Application.routes.draw do
  resources :positions

  get "log_in" => "sessions#new", :as => "log_in"
  get "sign_up" => "users#new", :as => "sign_up"
  get "log_out" => "sessions#destroy", :as => "log_out"

  resources :departments
  resources :types
  resources :mailings
  resources :users
  resources :sessions

  root to: 'welcome#index'

  get "sent" => "mailings#index", type: "sent"
  get "unsent" => "mailings#index", type: "unsent"
  get "inbox" => "mailings#index", type: "inbox"

  get "/mailings(.:format)" => "mailings#index"
  get "/mailings/:id(.:format)" => "mailings#show"

end
