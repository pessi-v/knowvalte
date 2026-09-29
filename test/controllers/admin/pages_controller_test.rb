require "test_helper"

class Admin::PagesControllerTest < ActionDispatch::IntegrationTest
  setup { sign_in_as users(:one) }

  test "requires sign-in" do
    sign_out
    get admin_pages_path
    assert_redirected_to new_session_path
  end

  test "index" do
    get admin_pages_path

    assert_inertia_component "Admin/Pages/Index"
    assert_equal Page.count, inertia.props[:pages].size
  end

  test "create redirects to the editor" do
    assert_difference -> { Page.count } do
      post admin_pages_path, params: { page: { title: "Open calls", slug: "Open Calls", menu: "main" } }
    end

    page = Page.find_by!(slug: "open-calls")
    assert_redirected_to editor_admin_page_path(page)
    assert_not page.published?
  end

  test "create with errors" do
    post admin_pages_path, params: { page: { title: "", slug: "about" } }

    assert_redirected_to new_admin_page_path
    follow_redirect!
    assert_equal [ "can't be blank" ], inertia.props[:errors][:title]
    assert_equal [ "has already been taken" ], inertia.props[:errors][:slug]
  end

  test "update settings" do
    patch admin_page_path(pages(:draft)), params: { page: { published: "1", menu: "footer" } }

    assert_redirected_to admin_pages_path
    assert pages(:draft).reload.published?
    assert pages(:draft).menu_footer?
  end

  test "editor" do
    get editor_admin_page_path(pages(:home))

    assert_inertia_component "Admin/Pages/Editor"
    assert_equal "Hero", inertia.props[:page][:content][:content].first[:type]
  end

  test "publish saves the Puck data" do
    content = {
      root: { props: {} },
      content: [ { type: "Heading", props: { id: "Heading-1", text: "Hello", level: "h2" } } ],
      zones: {}
    }
    patch publish_admin_page_path(pages(:about)), params: { content: content }, as: :json

    assert_redirected_to editor_admin_page_path(pages(:about))
    assert_equal "Hello", pages(:about).reload.content.dig("content", 0, "props", "text")
  end

  test "publish rejects invalid data" do
    patch publish_admin_page_path(pages(:about)), params: { content: "nope" }, as: :json

    assert_equal "Invalid content.", flash[:alert]
  end

  test "home page can't be deleted" do
    assert_no_difference -> { Page.count } do
      delete admin_page_path(pages(:home))
    end
  end

  test "destroy" do
    assert_difference -> { Page.count }, -1 do
      delete admin_page_path(pages(:about))
    end
  end
end
