# Idempotent: creates missing pages but never changes pages edited in the CMS.
# The first admin is created from ADMIN_EMAIL and ADMIN_PASSWORD when set.

if ENV["ADMIN_EMAIL"].present? && ENV["ADMIN_PASSWORD"].present?
  User.find_or_create_by!(email_address: ENV["ADMIN_EMAIL"]) do |user|
    user.password = ENV["ADMIN_PASSWORD"]
  end
end

def block(type, props)
  { "type" => type, "props" => { "id" => "#{type}-#{SecureRandom.uuid}" }.merge(props) }
end

def text(html) = block("RichText", "text" => html)
def header(title, intro = "") = block("PageHeader", "title" => title, "intro" => intro)

PAGES = [
  { slug: "home", title: "Home", menu: :none, content: [
    block("Hero", "title" => "KnowValTE", "text" => "Strengthening knowledge valorisation across Europe.",
      "linkLabel" => "About the project", "linkUrl" => "/about", "image" => nil, "alt" => "", "decorative" => false),
    text("<p>Introduction to the project.</p>")
  ] },
  { slug: "about", title: "About", menu: :main },
  { slug: "codes-of-practice", title: "Codes of Practice", menu: :main },
  { slug: "kv-hub", title: "KV-HUB", menu: :main, content: [
    header("KV-HUB", "The single, open entry point for the project’s tools and materials. Coming soon."),
    text("<p>The KV-HUB will bring together:</p><ul><li>Resources &amp; Learning</li><li>Services &amp; Mentoring</li>" \
         "<li>Open Calls</li><li>Reuse &amp; Licensing</li></ul>")
  ] },
  { slug: "training-and-events", title: "Training & Events", menu: :main },
  { slug: "news", title: "News", menu: :main },
  { slug: "partners", title: "Partners", menu: :main },
  { slug: "contact", title: "Contact", menu: :main },
  { slug: "legal-notice", title: "Legal notice", menu: :footer },
  { slug: "privacy", title: "Privacy notice", menu: :footer },
  { slug: "accessibility", title: "Accessibility statement", menu: :footer }
]

PAGES.each.with_index(1) do |attrs, position|
  Page.find_or_create_by!(slug: attrs[:slug]) do |page|
    page.title = attrs[:title]
    page.menu = attrs[:menu]
    page.position = position
    page.published = true
    page.content = {
      "root" => { "props" => {} },
      "content" => attrs[:content] || [ header(attrs[:title]), text("<p>Content coming soon.</p>") ]
    }
  end
end
