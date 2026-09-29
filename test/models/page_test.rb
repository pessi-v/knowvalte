require "test_helper"

class PageTest < ActiveSupport::TestCase
  test "normalizes the slug" do
    assert_equal "codes-of-practice", Page.new(slug: " Codes of Practice ").slug
  end

  test "rejects reserved slugs" do
    page = Page.new(title: "Admin", slug: "admin")
    assert_not page.valid?
    assert_includes page.errors[:slug], "is reserved"
  end

  test "path" do
    assert_equal "/", pages(:home).path
    assert_equal "/about", pages(:about).path
  end

  test "empty content defaults to an empty Puck document" do
    assert_equal({ "root" => { "props" => {} }, "content" => [] }, Page.new.content)
  end
end
