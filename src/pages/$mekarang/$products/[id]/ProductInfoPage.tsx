import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
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
import { productService } from '@/api/product/product'
import type { ProductResponse } from '@/api/types/product'
import { resolveApiAssetUrl } from '@/api/utils'
import { useCart } from '@/contexts/CartContext'
import { useAppSnackbar } from '@/contexts/SnackbarContext'
import PATHS from '@/routes/paths'

const FALLBACK_IMAGES = [
  'https://picsum.photos/id/30/1200/900?auto=format&fit=crop&w=1800&q=80',
  'https://picsum.photos/id/31/1200/900?auto=format&fit=crop&w=1800&q=80',
  'https://picsum.photos/id/33/1200/900?auto=format&fit=crop&w=1800&q=80',
]

const orderSteps = [
  {
    title: '訂購',
    description: '線上快速選購，依需求挑選規格與數量。',
    icon: <CalendarMonthRoundedIcon sx={{ fontSize: 42 }} />,
  },
  {
    title: '打包',
    description: '分級揀選後進行低溫包裝，完整保留鮮度。',
    icon: <Inventory2RoundedIcon sx={{ fontSize: 42 }} />,
  },
  {
    title: '到府',
    description: '冷鏈配送準時送達，讓你收到當季最佳狀態。',
    icon: <LocalShippingRoundedIcon sx={{ fontSize: 42 }} />,
  },
]

const ProductInfoPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem, replaceWithSingleItem } = useCart()
  const { showSnackbar } = useAppSnackbar()
  const [product, setProduct] = useState<ProductResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const [selectionMap, setSelectionMap] = useState<
    Record<string, { unitId: string; quantity: string; activeImageIndex: number }>
  >({})

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
    return (
      <Box component="main" sx={{ py: 14, display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
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
            農產品標題
          </Typography>
          <Typography sx={{ maxWidth: 700, mx: 'auto', color: 'text.secondary', lineHeight: 1.9 }}>
            {displayDescription}
            每一批次皆標示產地與建議保存方式，從選果到出貨流程透明可追溯，讓你在家中也能安心享受土地的季節風味。
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
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{step.icon}</Box>
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
            農產品標題
          </Typography>
          <Typography sx={{ maxWidth: 700, mx: 'auto', color: 'text.secondary', lineHeight: 1.9 }}>
            嚴選合作農場與當季採收時程，透過穩定冷鏈與分級包裝管理，把自然甜香維持在最好的狀態。
            讓每次下單都能收到一致品質。
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
            backgroundImage:
              'linear-gradient(180deg, rgba(8, 31, 31, 0.28), rgba(8, 31, 31, 0.64)), url(https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1800&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Container sx={{ position: 'relative', zIndex: 1, px: 3 }}>
          <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
            標題標題
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
            清洗去絨後，父母半日前即訂購桃禮，面語言用毫果口入半通古就購票方字，
            再次用果包瓜此處貨決？已回穿，林有花藝。兒升光了單馬中真河以的門卡上連七日？又分者。
          </Typography>
          <Button
            variant="outlined"
            size="large"
            sx={{
              color: 'common.white',
              borderColor: 'rgba(255,255,255,0.85)',
              px: 5,
              '&:hover': { borderColor: 'common.white', bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            立即預訂
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export default ProductInfoPage
