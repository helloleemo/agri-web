import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Link as RouterLink, useLoaderData } from 'react-router-dom'
import { resolveApiAssetUrl } from '@/api/utils'
import { useCart } from '@/contexts/CartContext'
import { useAppSnackbar } from '@/contexts/SnackbarContext'
import PATHS from '@/routes/paths'
import type { ProductResponse } from '@/api/types/product'
import type { ProductListLoaderData } from './productsListLoader'

const FALLBACK_IMAGE = 'https://picsum.photos/id/50/600/400?auto=format&fit=crop&w=1800&q=80'

const toCategoryLabel = (product: ProductResponse) => product.category_name || '未分類'

const pickImage = (product: ProductResponse) => {
  if (!product.images || product.images.length === 0) {
    return FALLBACK_IMAGE
  }

  const primary = product.images.find((image) => image.is_primary)
  const rawUrl = primary?.file_url || product.images[0].file_url || FALLBACK_IMAGE
  return resolveApiAssetUrl(rawUrl)
}

const pickPrice = (product: ProductResponse) => {
  if (!product.units || product.units.length === 0) {
    return 0
  }

  return Math.min(...product.units.map((unit) => unit.price))
}

const ProductsListPage = () => {
  const { addItem } = useCart()
  const { showSnackbar } = useAppSnackbar()
  const { products, errorMessage } = useLoaderData() as ProductListLoaderData
  const [activeCategory, setActiveCategory] = useState<string>('全部')
  const [selectedUnitMap, setSelectedUnitMap] = useState<Record<string, string>>({})

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleUnitChange = (productId: string, unitId: string) => {
    setSelectedUnitMap((prev) => ({
      ...prev,
      [productId]: unitId,
    }))
  }

  const handleAddToCart = (product: ProductResponse) => {
    const selectedUnitId = selectedUnitMap[product.id] ?? product.units[0]?.unit_id ?? ''
    const selectedUnit = product.units.find((unit) => unit.unit_id === selectedUnitId)

    if (!selectedUnit) {
      showSnackbar(`${product.name} 暫無可選規格`, { severity: 'warning' })
      return
    }

    try {
      addItem({
        id: `${product.id}-${selectedUnit.unit_id}`,
        name: product.name,
        description: product.description || '此商品目前尚未提供詳細描述。',
        unit_id: selectedUnit.unit_id,
        unit: selectedUnit.unit_name || '規格未命名',
        unitPrice: selectedUnit.price,
        quantity: 1,
        image: pickImage(product),
      })

      showSnackbar(`${product.name} 已加入購物車`, { severity: 'success' })
    } catch {
      showSnackbar(`加入 ${product.name} 失敗，請稍後再試`, { severity: 'error' })
    }
  }

  const categories = ['全部', ...Array.from(new Set(products.map(toCategoryLabel)))]
  const enabledProducts = products.filter((product) => product.status_code == 1)

  const filteredProducts =
    activeCategory === '全部'
      ? enabledProducts
      : enabledProducts.filter((product) => toCategoryLabel(product) === activeCategory)

  return (
    <Box component="main" sx={{ py: { xs: 5, md: 7 } }}>
      <Container>
        <Breadcrumbs sx={{ mb: 2, color: 'text.secondary', fontSize: '0.82rem' }}>
          <Typography
            component={RouterLink}
            to={PATHS.root}
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            首頁
          </Typography>
          <Typography color="text.primary">商品列表</Typography>
        </Breadcrumbs>

        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mb: 4 }}>
          {activeCategory}
        </Typography>

        <Stack direction="row" spacing={1.5} useFlexGap sx={{ mb: 6, flexWrap: 'wrap' }}>
          {categories.map((category) => {
            const isActive = category === activeCategory

            return (
              <Chip
                key={category}
                label={category}
                clickable
                onClick={() => setActiveCategory(category)}
                sx={{
                  px: 1.2,
                  py: 2.4,
                  borderRadius: 999,
                  border: '1px solid',
                  borderColor: isActive ? 'primary.main' : 'transparent',
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.secondary',
                  '& .MuiChip-label': { px: 1.2, fontWeight: 700 },
                }}
              />
            )
          })}
        </Stack>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {errorMessage}
          </Alert>
        )}

        {!errorMessage && filteredProducts.length === 0 && (
          <Alert severity="info" sx={{ mb: 4 }}>
            目前此分類沒有商品。
          </Alert>
        )}

        {!errorMessage && filteredProducts.length > 0 && (
          <Grid container spacing={3.5}>
            {filteredProducts.map((product, index) =>
              (() => {
                // console.log('product', product)
                // if (product.status_code !== 1) return null
                const selectedUnitId =
                  selectedUnitMap[product.id] ?? product.units[0]?.unit_id ?? ''
                const selectedUnit = product.units.find((unit) => unit.unit_id === selectedUnitId)
                const displayPrice = selectedUnit?.price ?? pickPrice(product)

                return (
                  <Grid key={`${activeCategory}-${product.id}`} size={{ xs: 12, md: 6 }}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'grey.300',
                        overflow: 'hidden',
                        boxShadow: '0 18px 34px rgba(15, 23, 42, 0.06)',
                        //   ':hover': {
                        //     boxShadow: '0 24px 48px rgba(15, 23, 42, 0.11)',
                        //     transform: 'scale(1.05)',
                        //     transition: 'transform 240ms ease, box-shadow 300ms ease-in-out',
                        //   },
                        opacity: 0,
                        transform: 'translateY(14px)',
                        animation: 'cardReveal 520ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                        animationDelay: `${index * 110}ms`,
                        '@keyframes cardReveal': {
                          from: {
                            opacity: 0,
                            transform: 'translateY(14px)',
                          },
                          to: {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={pickImage(product)}
                        alt={product.name}
                        sx={{ height: 280 }}
                      />
                      <CardContent sx={{ p: 3 }}>
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}
                        >
                          <Typography variant="h5" sx={{ fontSize: '1.35rem', fontWeight: 700 }}>
                            {product.name}
                          </Typography>
                          <Typography
                            sx={{ color: 'primary.main', fontSize: '1.6rem', fontWeight: 500 }}
                          >
                            $ {displayPrice}
                          </Typography>
                        </Stack>
                        <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3, lineHeight: 1.9 }}>
                          {product.description || '尚未提供商品描述。'}
                        </Typography>
                        <Stack spacing={2} sx={{ mb: 2.5 }}>
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', fontWeight: 600 }}
                          >
                            選擇單位
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Select
                              value={selectedUnitId}
                              displayEmpty
                              onChange={(event) => handleUnitChange(product.id, event.target.value)}
                              disabled={product.units.length === 0}
                              sx={{ borderRadius: 2 }}
                            >
                              {product.units.length === 0 ? (
                                <MenuItem value="">暫無可選規格</MenuItem>
                              ) : (
                                product.units.map((unit) => (
                                  <MenuItem key={unit.unit_id} value={unit.unit_id}>
                                    {(unit.unit_name || '規格未命名') + `（$ ${unit.price}）`}
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                          </FormControl>
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                          <Button
                            fullWidth
                            variant="outlined"
                            component={RouterLink}
                            to={`/${PATHS.mekarang.root}/${PATHS.mekarang.products.root}/${product.id}`}
                          >
                            查看詳情
                          </Button>
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.units.length === 0}
                          >
                            加入購物車
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })(),
            )}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default ProductsListPage
