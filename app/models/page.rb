class Page < ApplicationRecord
  HOME_SLUG = "home"

  # Where the page is linked from: the main navigation, the footer, or nowhere.
  enum :menu, { none: 0, main: 1, footer: 2 }, prefix: true, validate: true

  normalizes :slug, with: ->(slug) { slug.to_s.strip.downcase.parameterize }

  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true,
    exclusion: { in: %w[admin session passwords rails up assets vite-dev vite-test], message: "is reserved" }

  scope :published, -> { where(published: true) }
  scope :ordered, -> { order(:position, :title) }

  def self.home
    find_by(slug: HOME_SLUG)
  end

  def home?
    slug == HOME_SLUG
  end

  def path
    home? ? "/" : "/#{slug}"
  end

  # Puck's data shape: { root: { props: {} }, content: [], zones: {} }
  def content
    super.presence || { "root" => { "props" => {} }, "content" => [] }
  end
end
