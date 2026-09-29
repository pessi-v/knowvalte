class Admin::PagesController < Admin::BaseController
  before_action :set_page, only: %i[edit update destroy editor publish]

  def index
    render inertia: "Admin/Pages/Index", props: {
      pages: Page.ordered.map { |page| page_json(page) }
    }
  end

  def new
    render inertia: "Admin/Pages/Form", props: { page: page_json(Page.new) }
  end

  def create
    page = Page.new(page_params)
    if page.save
      redirect_to editor_admin_page_path(page), notice: "Page created."
    else
      redirect_to new_admin_page_path, inertia: { errors: page.errors }
    end
  end

  def edit
    render inertia: "Admin/Pages/Form", props: { page: page_json(@page) }
  end

  def update
    if @page.update(page_params)
      redirect_to admin_pages_path, notice: "Page settings saved."
    else
      redirect_to edit_admin_page_path(@page), inertia: { errors: @page.errors }
    end
  end

  def destroy
    if @page.home?
      redirect_to admin_pages_path, alert: "The home page can't be deleted."
    else
      @page.destroy!
      redirect_to admin_pages_path, notice: "Page deleted.", status: :see_other
    end
  end

  # Full-screen Puck editor for the page content.
  def editor
    render inertia: "Admin/Pages/Editor", props: { page: page_json(@page).merge(content: @page.content) }
  end

  # Saves the Puck data. Read from the raw JSON body: it's arbitrary nested data
  # that strong parameters can't describe.
  def publish
    content = request.request_parameters["content"]
    if content.is_a?(Hash) && content["content"].is_a?(Array)
      @page.update!(content: content)
      redirect_to editor_admin_page_path(@page), notice: "Content saved."
    else
      redirect_to editor_admin_page_path(@page), alert: "Invalid content."
    end
  end

  private
    def set_page
      @page = Page.find(params[:id])
    end

    def page_params
      params.expect(page: %i[title slug menu position published meta_description])
    end

    def page_json(page)
      page.as_json(only: %i[id title slug menu position published meta_description updated_at]).merge(path: page.path)
    end
end
