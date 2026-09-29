Rails.application.routes.draw do
  # Redirect to localhost from 127.0.0.1 to use same IP address with Vite server
  constraints(host: "127.0.0.1") do
    get "(*path)", to: redirect { |params, req| "#{req.protocol}localhost:#{req.port}/#{params[:path]}" }
  end

  resource :session
  resources :passwords, param: :token

  namespace :admin do
    root to: redirect("/admin/pages")
    resources :pages, except: :show do
      member do
        get :editor
        patch :publish
      end
    end
    resources :uploads, only: :create
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  root "pages#show"
  # CMS pages by slug. Keep last so it doesn't shadow other routes.
  get "*slug", to: "pages#show", as: :page,
    constraints: ->(req) { !req.path.start_with?("/rails/") },
    format: false
end
