# frozen_string_literal: true

class InertiaController < ApplicationController
  # Shared with every Inertia response. See https://inertia-rails.dev/guide/shared-data
  inertia_share do
    {
      site: {
        name: "KnowValTE",
        navigation: Page.published.menu_main.ordered.map { |page| { title: page.title, path: page.path } },
        footer: Page.published.menu_footer.ordered.map { |page| { title: page.title, path: page.path } },
        social: Rails.configuration.x.site.social
      },
      auth: { user: (Current.user.as_json(only: %i[id email_address]) if authenticated?) }
    }
  end
end
