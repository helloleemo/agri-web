import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import PATHS from '@/routes/paths'

type ProductCategory = '常規農產品' | '端午限定' | '其他'

interface ProductItem {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: ProductCategory
}

const categories: ProductCategory[] = ['常規農產品', '端午限定', '其他']

const products: ProductItem[] = [
  {
    id: 'peach-harvest-01',
    name: '農產品牌水蜜桃',
    price: 500,
    description: '清洗去絨後即可鮮食，也適合切片搭優格或氣泡飲，保留果肉香甜與細緻水分。',
    image: `https://picsum.photos/id/30/600/400?auto=format&fit=crop&w=1800&q=80`,
    category: '常規農產品',
  },
  {
    id: 'peach-gift-02',
    name: '鮮採蜜桃禮盒',
    price: 500,
    description: '果型飽滿、甜度穩定，適合作為家庭分裝與季節送禮，收到後冷藏風味更佳。',
    image: `https://picsum.photos/id/50/600/400?auto=format&fit=crop&w=1800&q=80`,
    category: '常規農產品',
  },
  {
    id: 'pomelo-moon-03',
    name: '中秋文旦精選箱',
    price: 680,
    description: '節慶限定規格，果香清新、甜酸均衡，適合端午團聚共享或企業贈禮。',
    image: `https://picsum.photos/id/32/600/400?auto=format&fit=crop&w=1800&q=80`,
    category: '端午限定',
  },
  {
    id: 'citrus-box-04',
    name: '產地柑橘綜合箱',
    price: 560,
    description: '依採收狀況搭配不同品種，酸甜層次明顯，適合每日鮮食與家庭備品。',
    image: `https://picsum.photos/id/33/600/400?auto=format&fit=crop&w=1800&q=80`,
    category: '其他',
  },
  {
    id: 'peach-farm-05',
    name: '梅山水蜜桃家庭箱',
    price: 500,
    description: '果肉細嫩、香氣突出，採收後低溫配送，適合家庭分次享用。',
    image: `https://picsum.photos/id/34/600/400?auto=format&fit=crop&w=1800&q=80`,
    category: '常規農產品',
  },
  {
    id: 'gift-selection-06',
    name: '季節水果精選組',
    price: 720,
    description: '依照當週產地成熟度挑選搭配，兼顧口感與視覺，作為送禮組合更有層次。',
    image: `https://picsum.photos/id/35/600/400?auto=format&fit=crop&w=1800&q=80`,
    category: '其他',
  },
]

const ProductsListPage = () => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('常規農產品')
  const filteredProducts = products.filter((product) => product.category === activeCategory)

  return (
    <Box component="main" sx={{ py: { xs: 5, md: 7 } }}>
      <Container>
        <Breadcrumbs sx={{ mb: 2, color: 'text.secondary', fontSize: '0.82rem' }}>
          <Typography
            component={RouterLink}
            to={`/${PATHS.root}`}
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            首頁
          </Typography>
          <Typography color="text.primary">{activeCategory}</Typography>
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

        <Grid container spacing={3.5}>
          {filteredProducts.map((product, index) => (
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
                  image={product.image}
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
                    <Typography sx={{ color: 'primary.main', fontSize: '1.6rem', fontWeight: 500 }}>
                      $ {product.price}
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3, lineHeight: 1.9 }}>
                    {product.description}
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      component={RouterLink}
                      to={`/${PATHS.mekarang.root}/${PATHS.mekarang.products.root}/${product.id}`}
                    >
                      查看詳情
                    </Button>
                    <Button fullWidth variant="contained">
                      加入購物車
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default ProductsListPage
