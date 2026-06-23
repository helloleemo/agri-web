import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { siteContentService, type HomePageContent } from '@/api'
import { productService } from '@/api/product/product'
import type { ProductResponse } from '@/api/types/product'
import LoadingDialog from '@/components/common/LoadingDialog'
import { resolveApiAssetUrl } from '@/api/utils'
import { useCart } from '@/contexts/CartContext'
import { useAppSnackbar } from '@/contexts/SnackbarContext'
import PATHS from '@/routes/paths'

const FALLBACK_IMAGES = [
  'https://picsum.photos/id/30/1200/900?auto=format&fit=crop&w=1800&q=80',
  'https://picsum.photos/id/31/1200/900?auto=format&fit=crop&w=1800&q=80',
  'https://picsum.photos/id/33/1200/900?auto=format&fit=crop&w=1800&q=80',
]

const HOME_PAGE_KEY = 'home'
const defaultProductsPath = `/${PATHS.mekarang.root}/${PATHS.mekarang.products.root}`

type ProductDetailPageContent = Pick<HomePageContent, 'flow' | 'product_detail'>

const defaultProductDetailPageContent: ProductDetailPageContent = {
  flow: {
    title: '從下單到餐桌的三步驟',
    items: [
      { title: '訂購', description: '線上快速選購，依需求挑選蔬果組合與配送時段。' },
      { title: '打包', description: '採收後即刻分類與低溫包裝，完整保留新鮮口感。' },
      { title: '到府', description: '冷鏈配送準時送達，讓每日料理都能輕鬆上桌。' },
    ],
  },
  product_detail: {
    intro: {
      title: '農產品標題',
      description:
        '嚴選合作農場與當季採收時程，透過穩定冷鏈與分級包裝管理，把自然甜香維持在最好的狀態。讓每次下單都能收到一致品質。',
    },
    bottom_cta: {
      title: '標題標題',
      description:
        '清洗去絨後，父母半日前即訂購桃禮，面語言用毫果口入半通古就購票方字，再次用果包瓜此處貨決？已回穿，林有花藝。兒升光了單馬中真河以的門卡上連七日？又分者。',
      button_text: '立即預訂',
      button_link: defaultProductsPath,
      image_url:
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1800&q=80',
    },
  },
}

const cloneDefaultProductDetailPageContent = () =>
  JSON.parse(JSON.stringify(defaultProductDetailPageContent)) as ProductDetailPageContent

const ensureProductDetailPageContent = (input: unknown): ProductDetailPageContent => {
  const fallback = cloneDefaultProductDetailPageContent()
  if (!input || typeof input !== 'object') {
    return fallback
  }

  const raw = input as Partial<HomePageContent>
  const flowItems = Array.isArray(raw.flow?.items) ? raw.flow.items.slice(0, 3) : []

  while (flowItems.length < 3) {
    flowItems.push(fallback.flow.items[flowItems.length])
  }

  return {
    flow: {
      title: raw.flow?.title ?? fallback.flow.title,
      items: flowItems.map((item, index) => ({
        title: item?.title ?? fallback.flow.items[index].title,
        description: item?.description ?? fallback.flow.items[index].description,
      })),
    },
    product_detail: {
      intro: {
        title: raw.product_detail?.intro?.title ?? fallback.product_detail.intro.title,
        description:
          raw.product_detail?.intro?.description ?? fallback.product_detail.intro.description,
      },
      bottom_cta: {
        title: raw.product_detail?.bottom_cta?.title ?? fallback.product_detail.bottom_cta.title,
        description:
          raw.product_detail?.bottom_cta?.description ??
          fallback.product_detail.bottom_cta.description,
        button_text:
          raw.product_detail?.bottom_cta?.button_text ??
          fallback.product_detail.bottom_cta.button_text,
        button_link:
          raw.product_detail?.bottom_cta?.button_link ??
          fallback.product_detail.bottom_cta.button_link,
        image_url:
          raw.product_detail?.bottom_cta?.image_url ?? fallback.product_detail.bottom_cta.image_url,
      },
    },
  }
}

const orderStepIcons = [
  {
    icon: <CalendarMonthRoundedIcon sx={{ fontSize: 42 }} />,
  },
  {
    icon: <Inventory2RoundedIcon sx={{ fontSize: 42 }} />,
  },
  {
    icon: <LocalShippingRoundedIcon sx={{ fontSize: 42 }} />,
  },
]

const ProductInfoPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem, replaceWithSingleItem } = useCart()
  const { showSnackbar } = useAppSnackbar()
  const [product, setProduct] = useState<ProductResponse | null>(null)
  const [pageContent, setPageContent] = useState<ProductDetailPageContent>(
    cloneDefaultProductDetailPageContent,
  )
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const [selectionMap, setSelectionMap] = useState<
    Record<string, { unitId: string; quantity: string; activeImageIndex: number }>
  >({})

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const response = await siteContentService.getPublicByPageKey<HomePageContent>(HOME_PAGE_KEY)
        setPageContent(ensureProductDetailPageContent(response.content_data))
      } catch {
        // Keep fallback content when API is unavailable.
      }
    }

    void fetchPageContent()
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setErrorMessage('缺少商品編號，請返回商品列表重新選擇。')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setErrorMessage('')

        const response = await productService.getById(id)
        setProduct(response)
      } catch (error) {
        console.error('Failed to fetch product detail:', error)
        setErrorMessage('無法取得商品詳情，請稍後再試。')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const imageUrls = useMemo(() => {
    if (!product?.images || product.images.length === 0) {
      return FALLBACK_IMAGES
    }

    return [...product.images]
      .sort((a, b) => {
        if (a.is_primary !== b.is_primary) {
          return a.is_primary ? -1 : 1
        }

        if (a.sort_order !== b.sort_order) {
          return a.sort_order - b.sort_order
        }

        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      })
      .map((image) => resolveApiAssetUrl(image.file_url))
  }, [product])

  const productId = product?.id ?? 'unknown'
  const selectedUnitId = selectionMap[productId]?.unitId ?? product?.units[0]?.unit_id ?? ''
  const quantity = selectionMap[productId]?.quantity ?? '1'
  const activeImageIndex = selectionMap[productId]?.activeImageIndex ?? 0
  const activeImage = imageUrls[activeImageIndex] ?? imageUrls[0]

  const selectedUnit = useMemo(
    () => product?.units.find((unit) => unit.unit_id === selectedUnitId) ?? product?.units[0],
    [product, selectedUnitId],
  )

  const displayPrice = selectedUnit?.price ?? 0

  const displayDescription =
    product?.description || '此商品目前尚未提供詳細描述，歡迎先加入購物車或聯絡我們了解更多。'

  const orderSteps = useMemo(
    () =>
      pageContent.flow.items.slice(0, 3).map((step, index) => ({
        title: step.title,
        description: step.description,
        icon: orderStepIcons[index]?.icon,
      })),
    [pageContent.flow.items],
  )

  const gotoOrderFlow = (mode: 'addToCart' | 'buyNow') => {
    if (!product || !selectedUnit) {
      showSnackbar('商品資料尚未完整，請稍後再試', { severity: 'warning' })
      return
    }

    const itemQuantity = Number(quantity) || 1
    const cartItem = {
      id: `${product.id}-${selectedUnit.unit_id}`,
      name: product.name,
      description: displayDescription,
      unit_id: selectedUnit.unit_id,
      unit: selectedUnit.unit_name || '規格未命名',
      unitPrice: selectedUnit.price,
      quantity: itemQuantity,
      image: activeImage,
    }

    if (mode === 'addToCart') {
      try {
        addItem(cartItem)
        showSnackbar(`${product.name} 已加入購物車`, { severity: 'success' })
      } catch {
        showSnackbar(`加入 ${product.name} 失敗，請稍後再試`, { severity: 'error' })
      }
      return
    }

    replaceWithSingleItem(cartItem)
    navigate(`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.root}`, {
      state: null,
    })
  }

  const handleVariantChange = (nextVariant: string) => {
    if (!product) return

    setSelectionMap((prev) => ({
      ...prev,
      [product.id]: {
        unitId: nextVariant,
        quantity: prev[product.id]?.quantity ?? '1',
        activeImageIndex: prev[product.id]?.activeImageIndex ?? 0,
      },
    }))
  }

  const handleQuantityChange = (nextQuantity: string) => {
    if (!product) return

    setSelectionMap((prev) => ({
      ...prev,
      [product.id]: {
        unitId: prev[product.id]?.unitId ?? product.units[0]?.unit_id ?? '',
        quantity: nextQuantity,
        activeImageIndex: prev[product.id]?.activeImageIndex ?? 0,
      },
    }))
  }

  const handleImageChange = (nextIndex: number) => {
    if (!product) return

    setSelectionMap((prev) => ({
      ...prev,
      [product.id]: {
        unitId: prev[product.id]?.unitId ?? product.units[0]?.unit_id ?? '',
        quantity: prev[product.id]?.quantity ?? '1',
        activeImageIndex: nextIndex,
      },
    }))
  }

  if (loading) {
    return <LoadingDialog open />
  }

  if (errorMessage || !product) {
    return (
      <Box component="main" sx={{ py: 10 }}>
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage || '找不到商品資料'}
          </Alert>
          <Button
            component={RouterLink}
            to={`/${PATHS.mekarang.root}/${PATHS.mekarang.products.root}`}
          >
            返回商品列表
          </Button>
        </Container>
      </Box>
    )
  }

  return (
    <Box component="main" sx={{ pb: 0 }}>
      <Container sx={{ py: { xs: 5, md: 7 } }}>
        <Breadcrumbs sx={{ mb: 2, color: 'text.secondary', fontSize: '0.82rem' }}>
          <Typography
            component={RouterLink}
            to={PATHS.root}
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            首頁
          </Typography>
          <Typography
            component={RouterLink}
            to={`/${PATHS.mekarang.root}/${PATHS.mekarang.products.root}`}
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            常規農產品
          </Typography>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mb: 4 }}>
          {product.category_name || '未分類商品'}
        </Typography>

        <Grid container spacing={{ xs: 3, md: 5 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              component="img"
              src={activeImage}
              alt={product.name}
              sx={{
                width: '100%',
                borderRadius: 3,
                minHeight: { xs: 260, md: 430 },
                objectFit: 'cover',
                boxShadow: '0 16px 34px rgba(15, 23, 42, 0.12)',
              }}
            />

            <Box
              sx={{
                mt: 1.6,
                pb: 0.5,
                display: 'grid',
                width: '100%',
                gap: 1.2,
                gridTemplateColumns: `repeat(${Math.max(imageUrls.length, 1)}, minmax(0, 1fr))`,
              }}
            >
              {imageUrls.map((image, index) => {
                const isActive = index === activeImageIndex
                return (
                  <Box
                    key={`${product.id}-thumb-${index}`}
                    component="button"
                    type="button"
                    onClick={() => handleImageChange(index)}
                    sx={{
                      border: 'none',
                      p: 0,
                      bgcolor: 'transparent',
                      cursor: 'pointer',
                      borderRadius: 1.5,
                      overflow: 'hidden',
                      width: '100%',
                      height: { xs: 62, md: 76 },
                      outline: isActive ? '2px solid' : '1px solid',
                      outlineColor: isActive ? 'primary.main' : 'grey.300',
                      opacity: isActive ? 1 : 0.72,
                      transition: 'opacity 180ms ease, outline-color 180ms ease',
                      '&:hover': { opacity: 1 },
                    }}
                    aria-label={`切換到第 ${index + 1} 張商品圖`}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={`${product.name} 縮圖 ${index + 1}`}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                )
              })}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Typography sx={{ color: 'text.secondary', mb: 1.2, fontSize: '0.82rem' }}>
              首頁 / 常規農產品 / {product.name}
            </Typography>
            <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 1.5 }}>
              {product.name}
            </Typography>
            <Typography sx={{ color: 'primary.main', fontSize: '1.8rem', fontWeight: 700, mb: 2 }}>
              $ {displayPrice}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.85 }}>
              {displayDescription}
            </Typography>

            <Stack spacing={2}>
              <FormControl fullWidth>
                <Select
                  value={selectedUnitId}
                  displayEmpty
                  onChange={(event) => handleVariantChange(event.target.value)}
                >
                  {product.units.map((item) => (
                    <MenuItem key={item.unit_id} value={item.unit_id}>
                      {(item.unit_name || '規格未命名') + `（$ ${item.price}）`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <Select
                  value={quantity}
                  onChange={(event) => handleQuantityChange(event.target.value)}
                >
                  {['1', '2', '3', '4', '5'].map((item) => (
                    <MenuItem key={item} value={item}>
                      {item} 件
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.8}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => gotoOrderFlow('addToCart')}
                >
                  加入購物車
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => gotoOrderFlow('buyNow')}
                >
                  直接購買
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'grey.100', py: { xs: 8, md: 10 } }}>
        <Container sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 2, fontSize: { xs: '1.7rem', md: '2rem' } }}>
            {pageContent.product_detail.intro.title}
          </Typography>
          <Typography sx={{ maxWidth: 700, mx: 'auto', color: 'text.secondary', lineHeight: 1.9 }}>
            {pageContent.product_detail.intro.description}
          </Typography>

          <Typography
            variant="h3"
            sx={{ mt: { xs: 5, md: 8 }, mb: 2, fontSize: { xs: '1.7rem', md: '2rem' } }}
          >
            {pageContent.flow.title}
          </Typography>
          <Grid container spacing={4} sx={{ mt: { xs: 5, md: 8 } }}>
            {orderSteps.map((step, index) => (
              <Grid key={step.title} size={{ xs: 12, md: 4 }}>
                <Box sx={{ px: 2, textAlign: 'center', position: 'relative' }}>
                  {index < orderSteps.length - 1 && (
                    <Box
                      sx={{
                        display: { xs: 'none', md: 'block' },
                        position: 'absolute',
                        top: 20,
                        right: '-22%',
                        width: '44%',
                        height: 2,
                        bgcolor: 'primary.main',
                        opacity: 0.7,
                      }}
                    />
                  )}
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{step.icon ?? null}</Box>
                  <Typography variant="h5" sx={{ mb: 1.4, fontSize: '1.35rem' }}>
                    {step.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.85 }}>
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          bgcolor: '#f5f7f8',
        }}
      >
        <Container>
          <Typography variant="h3" sx={{ mb: 2, fontSize: { xs: '1.7rem', md: '2rem' } }}>
            {pageContent.product_detail.bottom_cta.title}
          </Typography>
          <Typography sx={{ maxWidth: 700, mx: 'auto', color: 'text.secondary', lineHeight: 1.9 }}>
            {pageContent.product_detail.bottom_cta.description}
          </Typography>
        </Container>
      </Box>

      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 340, md: 520 },
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          color: 'common.white',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(180deg, rgba(8, 31, 31, 0.28), rgba(8, 31, 31, 0.64)), url(${pageContent.product_detail.bottom_cta.image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Container sx={{ position: 'relative', zIndex: 1, px: 3 }}>
          <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
            {pageContent.product_detail.bottom_cta.title}
          </Typography>
          <Typography
            sx={{
              maxWidth: 720,
              mx: 'auto',
              mb: 4,
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.8,
            }}
          >
            {pageContent.product_detail.bottom_cta.description}
          </Typography>
          <Button
            component={RouterLink}
            to={pageContent.product_detail.bottom_cta.button_link || defaultProductsPath}
            variant="outlined"
            size="large"
            sx={{
              color: 'common.white',
              borderColor: 'rgba(255,255,255,0.85)',
              px: 5,
              '&:hover': { borderColor: 'common.white', bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            {pageContent.product_detail.bottom_cta.button_text}
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export default ProductInfoPage
