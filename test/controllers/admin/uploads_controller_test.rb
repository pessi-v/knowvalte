require "test_helper"

class Admin::UploadsControllerTest < ActionDispatch::IntegrationTest
  setup { sign_in_as users(:one) }

  test "uploads an image" do
    post admin_uploads_path, params: { file: fixture_file_upload("pixel.png", "image/png") }

    assert_response :created
    assert_match %r{\A/rails/active_storage/blobs/}, response.parsed_body["url"]
    assert_equal "pixel.png", response.parsed_body["filename"]
  end

  test "rejects other file types" do
    post admin_uploads_path, params: { file: fixture_file_upload("script.html", "text/html") }

    assert_response :unprocessable_content
  end

  test "requires sign-in" do
    sign_out
    post admin_uploads_path, params: { file: fixture_file_upload("pixel.png", "image/png") }

    assert_redirected_to new_session_path
  end
end
