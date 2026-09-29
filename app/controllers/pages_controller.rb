class PagesController < InertiaController
  allow_unauthenticated_access

  def show
    page = Page.find_by!(slug: params[:slug] || Page::HOME_SLUG)
    raise ActiveRecord::RecordNotFound unless page.published? || authenticated?

    render inertia: "Pages/Show", props: {
      page: page.as_json(only: %i[title meta_description published]).merge(path: page.path, content: page.content)
    }
  end
end
