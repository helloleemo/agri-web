import { useEffect } from 'react'
import { Box, Button, Container, Grid, Typography } from '@mui/material'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import { useSearchParams } from 'react-router-dom'
import { Header, Footer } from '@/components/layout'
import { useAuth } from '@/contexts/AuthContext'
// import {Typography as themeTypography} from "../../theme/typography";

const heroImage =
  'https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?auto=format&fit=crop&w=1800&q=80'
const fieldImage =
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1800&q=80'
const crateImage = 'https://picsum.photos/id/684/600/400?auto=format&fit=crop&w=1800&q=80'

const showcaseBlocks = [
  {
    title: '友善耕作，季節直送',
    description:
      '挑選當季最鮮甜的蔬果，由合作農場每日採收。從田間到餐桌，每一份都保留自然風味與安心履歷。',
    image: fieldImage,
  },
  {
    title: '品質把關，全程透明',
    description:
      '每批產品皆經過分級與包裝檢驗，提供清楚來源與保存建議，讓你可以輕鬆選購、放心食用。',
    image: crateImage,
  },
]

const flowItems = [
  {
    title: '訂購',
    description: '線上快速選購，依需求挑選蔬果組合與配送時段。',
    icon: <CalendarMonthRoundedIcon sx={{ fontSize: 42 }} />,
  },
  {
    title: '打包',
    description: '採收後即刻分類與低溫包裝，完整保留新鮮口感。',
    icon: <Inventory2RoundedIcon sx={{ fontSize: 42 }} />,
  },
  {
    title: '到府',
    description: '冷鏈配送準時送達，讓每日料理都能輕鬆上桌。',
    icon: <LocalShippingRoundedIcon sx={{ fontSize: 42 }} />,
  },
]

const MainPage = () => {
  const [searchParams] = useSearchParams()
  const { openLoginDialog } = useAuth()

  useEffect(() => {
    if (searchParams.get('verified') !== 'success') {
      return
    }

    openLoginDialog()
  }, [openLoginDialog, searchParams])

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '84vh', md: '92vh' },
          display: 'flex',
          alignItems: 'center',
          color: 'common.white',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(115deg, rgba(9, 21, 19, 0.7), rgba(9, 21, 19, 0.45)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'scale(1.03)',
          }}
        />

        <Container sx={{ position: 'relative', zIndex: 1, pt: { xs: 14, md: 18 }, pb: 6 }}>
          <Header />

          <Box sx={{ maxWidth: 640, textAlign: { xs: 'left', md: 'center' }, mx: { md: 'auto' } }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.1rem', md: '3.35rem' },
                mb: 2,
                animation: 'fadeInUp 900ms ease both',
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              農場直送的真實新鮮
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.88)',
                mb: 4,
                lineHeight: 1.8,
                animation: 'fadeInUp 1200ms ease both',
              }}
            >
              精選在地小農合作，當日採收、當日出貨。每一口都來自看得見的土地，為你保留蔬果最純粹的味道。
            </Typography>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: 'common.white',
                borderColor: 'rgba(255,255,255,0.8)',
                px: 5,
                animation: 'fadeInUp 1400ms ease both',
                '&:hover': {
                  borderColor: 'common.white',
                  bgcolor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              立即預訂
            </Button>
          </Box>
        </Container>
      </Box>

      {showcaseBlocks.map((block, index) => (
        <Grid container key={block.title}>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              minHeight: { xs: 260, md: 420 },
              order: { xs: 1, md: index % 2 === 0 ? 1 : 2 },
              backgroundImage: `url(${block.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              minHeight: { xs: 260, md: 420 },
              order: { xs: 2, md: index % 2 === 0 ? 2 : 1 },
              display: 'grid',
              placeItems: 'center',
              bgcolor: index % 2 === 0 ? 'grey.200' : 'grey.200',
              px: 4,
              py: 8,
            }}
          >
            <Box sx={{ maxWidth: 470, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ mb: 2, fontSize: { xs: '1.6rem', md: '2rem' } }}>
                {block.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                {block.description}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      ))}

      <Box sx={{ bgcolor: 'grey.100', py: { xs: 8, md: 10 } }}>
        <Container>
          <Typography
            variant="h3"
            align="center"
            sx={{
              mt: 20,
              mb: 10,
              fontSize: {
                xs: '1.7rem',
                md: '2.1rem',
              },
            }}
          >
            從下單到餐桌的三步驟
          </Typography>
          <Grid
            container
            spacing={4}
            sx={{
              mb: 20,
            }}
          >
            {flowItems.map((item) => (
              <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    px: 3,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{item.icon}</Box>
                  <Typography variant="h5" sx={{ mb: 1.5, fontSize: '1.35rem' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.85 }}>
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 360, md: 470 },
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
            backgroundImage: `linear-gradient(180deg, rgba(8, 31, 31, 0.3), rgba(8, 31, 31, 0.65)), url(${fieldImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(0.95)',
          }}
        />
        <Container sx={{ position: 'relative', zIndex: 1, px: 3 }}>
          <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
            現在訂購，享受當季直送
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
            每週更新當季蔬果清單，提供單次購買與定期配送。把採收時刻的清甜，準時送到你的廚房。
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
            立即開始
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}

export default MainPage
