import { createInertiaApp } from '@inertiajs/react'
import SiteLayout from '@/layouts/SiteLayout'
import AdminLayout from '@/layouts/AdminLayout'
import '@/styles/app.css'

void createInertiaApp({
  pages: '../pages',

  strictMode: true,

  title: (title) => (title ? `${title} – KnowValTE` : 'KnowValTE'),

  // The Puck editor is full screen and has no layout.
  layout: (name) => {
    if (name === 'Admin/Pages/Editor') return null
    if (name.startsWith('Admin/')) return AdminLayout
    return SiteLayout
  },

  defaults: {
    form: {
      forceIndicesArrayFormatInFormData: false,
      withAllErrors: true,
    },
    visitOptions: () => {
      return { queryStringArrayFormat: 'brackets' }
    },
  },
}).catch((error) => {
  // This entrypoint is only meant for Inertia pages (with the #app root element).
  if (document.getElementById('app')) {
    throw error
  } else {
    console.error('Missing Inertia root element.', error)
  }
})
