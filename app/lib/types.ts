interface ProductVariant {
  id: number
  product_id: number
  title: string
  price: string
  sku: string
  position: number
  compare_at_price: string
  fulfillment_service: string
  inventory_management: string
  option1: string
  option2: string | null
  option3: string | null
  created_at: string
  updated_at: string
  taxable: boolean
  barcode: string
  grams: number
  image_id: number
  weight: number
  weight_unit: string
  requires_shipping: boolean
  quantity_rule: {
    min: number
    max: number | null
    increment: number
  }
  quantity_price_breaks: any[] // You can replace `any[]` with a more specific type if needed
}

interface ProductOption {
  id: number
  product_id: number
  name: string
  position: number
  values: string[]
}

interface ProductImage {
  id: number
  product_id: number
  position: number
  created_at: string
  updated_at: string
  alt: string
  width: number
  height: number
  src: string
  variant_ids: number[]
}

export interface ShopifyStoreJSON {
  products: ProductInfo[]
}

interface ProductInfo {
  id: number
  title: string
  body_html: string
  vendor: string
  product_type: string
  created_at: string
  handle: string
  updated_at: string
  published_at: string
  template_suffix: string
  published_scope: string
  tags: string
  variants: ProductVariant[]
  options: ProductOption[]
  images: ProductImage[]
  image: ProductImage
}

export interface CrawlData {
  chatbotId: string
  url: string
  title: string
  content: string
}

export interface CrawlPayload {
  url: string
  chatbotId: string
}
