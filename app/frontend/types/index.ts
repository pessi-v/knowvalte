export type FlashData = {
  notice?: string
  alert?: string
}

export type NavLink = { title: string; path: string }

export type SharedProps = {
  site: {
    name: string
    navigation: NavLink[]
    footer: NavLink[]
    social: { name: string; url: string }[]
  }
  auth: { user: { id: number; email_address: string } | null }
}

export type AdminPage = {
  id: number | null
  title: string
  slug: string
  path: string
  menu: 'none' | 'main' | 'footer'
  position: number
  published: boolean
  meta_description: string | null
  updated_at: string | null
}
