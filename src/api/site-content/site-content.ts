import BASE_URL from '../base/apiBaseUrl'
import { API_ENDPOINT } from '../base/apiEndpoint'
import { GET } from '../base/apiMethods'

export interface HomePageContent {
  hero: {
    title: string
    description: string
    button_text: string
    button_link: string
    image_url: string
  }
  showcase_blocks: Array<{
    title: string
    description: string
    image_url: string
  }>
  flow: {
    title: string
    items: Array<{
      title: string
      description: string
    }>
  }
  bottom_cta: {
    title: string
    description: string
    button_text: string
    button_link: string
    image_url: string
  }
  mekarang: {
    banner_image_url: string
  }
  orders_query: {
    description: string
    image_url: string
  }
  footer: {
    title: string
    button_text: string
    description: string
    social_links: {
      facebook: string
      instagram: string
      youtube: string
    }
  }
}

export interface SiteContentResponse<T = Record<string, unknown>> {
  id: string
  page_key: string
  content_data: T
  created_at: string
  updated_at: string
}

export const siteContentService = {
  getPublicByPageKey: async <T = Record<string, unknown>>(pageKey: string) => {
    return GET<SiteContentResponse<T>>(BASE_URL, API_ENDPOINT.PUBLIC_SITE_CONTENTS_BY_PAGE(pageKey))
  },
}
