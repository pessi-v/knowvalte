require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "home page" do
    get root_path

    assert_response :success
    assert_inertia_component "Pages/Show"
    assert_equal "Home", inertia.props[:page][:title]
    assert_equal "/", inertia.props[:page][:path]
  end

  test "page by slug with shared navigation" do
    get "/about"

    assert_equal "About", inertia.props[:page][:title]
    assert_equal [ { "title" => "About", "path" => "/about" } ], inertia.props[:site][:navigation]
    assert_equal [ { "title" => "Privacy notice", "path" => "/privacy" } ], inertia.props[:site][:footer]
  end

  test "drafts are hidden from visitors" do
    get "/draft"
    assert_response :not_found
  end

  test "drafts are visible to signed-in editors" do
    sign_in_as users(:one)
    get "/draft"

    assert_response :success
    assert_equal false, inertia.props[:page][:published]
  end

  test "unknown page" do
    get "/nope"
    assert_response :not_found
  end
end
