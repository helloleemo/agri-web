import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Container, Grid, Typography } from '@mui/material'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import { Link, useSearchParams } from 'react-router-dom'
import { Header, Footer } from '@/components/layout'
import { siteContentService, type HomePageContent } from '@/api'
import { useAuth } from '@/contexts/AuthContext'
import PATHS from '@/routes/paths'
// import {Typography as themeTypography} from "../../theme/typography";

const HOME_PAGE_KEY = 'home'
const defaultProductsPath = `/${PATHS.mekarang.root}/${PATHS.mekarang.products.root}`

const defaultHomeContent: HomePageContent = {
  hero: {
    title: '農場直送的真實新鮮',
    description:
      '精選在地小農合作，當日採收、當日出貨。每一口都來自看得見的土地，為你保留蔬果最純粹的味道。',
    button_text: '立即預訂',
    button_link: defaultProductsPath,
    image_url:
      'https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?auto=format&fit=crop&w=1800&q=80',
  },
  showcase_blocks: [
    {
      title: '友善耕作，季節直送',
      description:
        '挑選當季最鮮甜的蔬果，由合作農場每日採收。從田間到餐桌，每一份都保留自然風味與安心履歷。',
      image_url:
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1800&q=80',
    },
    {
      title: '品質把關，全程透明',
      description:
        '每批產品皆經過分級與包裝檢驗，提供清楚來源與保存建議，讓你可以輕鬆選購、放心食用。',
      image_url: 'https://picsum.photos/id/684/600/400?auto=format&fit=crop&w=1800&q=80',
    },
  ],
  flow: {
    title: '從下單到餐桌的三步驟',
    items: [
      { title: '訂購', description: '線上快速選購，依需求挑選蔬果組合與配送時段。' },
      { title: '打包', description: '採收後即刻分類與低溫包裝，完整保留新鮮口感。' },
      { title: '到府', description: '冷鏈配送準時送達，讓每日料理都能輕鬆上桌。' },
    ],
  },
  bottom_cta: {
    title: '現在訂購，享受當季直送',
    description:
      '每週更新當季蔬果清單，提供單次購買與定期配送。把採收時刻的清甜，準時送到你的廚房。',
    button_text: '立即開始',
    button_link: defaultProductsPath,
    image_url:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1800&q=80',
  },
  mekarang: {
    banner_image_url:
      'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1800&q=80',
  },
  orders_query: {
    description:
      '輸入你的訂單編號與 Email，立即查看付款狀態、配送進度與收件資訊。若你剛完成下單，也可以在這裡快速追蹤最新處理狀態。',
    image_url:
      'https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?auto=format&fit=crop&w=1800&q=80',
  },
  footer: {
    title: '與我們保持聯繫',
    button_text: '聯絡我們',
    description: '分享料理靈感、農場日常與最新檔期。追蹤我們，第一時間收到新品上市與優惠資訊。',
    social_links: {
      facebook: '',
      instagram: '',
      youtube: '',
    },
  },
}

const cloneDefaultContent = () => JSON.parse(JSON.stringify(defaultHomeContent)) as HomePageContent

const ensureHomeContent = (raw: unknown): HomePageContent => {
  const fallback = cloneDefaultContent()
  if (!raw || typeof raw !== 'object') {
    return fallback
  }

  const content = raw as Partial<HomePageContent>
  const showcaseBlocks = Array.isArray(content.showcase_blocks)
    ? content.showcase_blocks.slice(0, 2)
    : []
  const flowItems = Array.isArray(content.flow?.items) ? content.flow.items.slice(0, 3) : []

  while (showcaseBlocks.length < 2) {
    showcaseBlocks.push(fallback.showcase_blocks[showcaseBlocks.length])
  }

  while (flowItems.length < 3) {
    flowItems.push(fallback.flow.items[flowItems.length])
  }

  return {
    hero: {
      title: content.hero?.title ?? fallback.hero.title,
      description: content.hero?.description ?? fallback.hero.description,
      button_text: content.hero?.button_text ?? fallback.hero.button_text,
      button_link: content.hero?.button_link ?? fallback.hero.button_link,
      image_url: content.hero?.image_url ?? fallback.hero.image_url,
    },
    showcase_blocks: showcaseBlocks.map((item, index) => ({
      title: item?.title ?? fallback.showcase_blocks[index].title,
      description: item?.description ?? fallback.showcase_blocks[index].description,
      image_url: item?.image_url ?? fallback.showcase_blocks[index].image_url,
    })),
    flow: {
      title: content.flow?.title ?? fallback.flow.title,
      items: flowItems.map((item, index) => ({
        title: item?.title ?? fallback.flow.items[index].title,
        description: item?.description ?? fallback.flow.items[index].description,
      })),
    },
    bottom_cta: {
      title: content.bottom_cta?.title ?? fallback.bottom_cta.title,
      description: content.bottom_cta?.description ?? fallback.bottom_cta.description,
      button_text: content.bottom_cta?.button_text ?? fallback.bottom_cta.button_text,
      button_link: content.bottom_cta?.button_link ?? fallback.bottom_cta.button_link,
      image_url: content.bottom_cta?.image_url ?? fallback.bottom_cta.image_url,
    },
    footer: {
      title: content.footer?.title ?? fallback.footer.title,
      button_text: content.footer?.button_text ?? fallback.footer.button_text,
      description: content.footer?.description ?? fallback.footer.description,
      social_links: {
        facebook: content.footer?.social_links?.facebook ?? fallback.footer.social_links.facebook,
        instagram:
          content.footer?.social_links?.instagram ?? fallback.footer.social_links.instagram,
        youtube: content.footer?.social_links?.youtube ?? fallback.footer.social_links.youtube,
      },
    },
    mekarang: {
      banner_image_url: content.mekarang?.banner_image_url ?? fallback.mekarang.banner_image_url,
    },
    orders_query: {
      description: content.orders_query?.description ?? fallback.orders_query.description,
      image_url: content.orders_query?.image_url ?? fallback.orders_query.image_url,
    },
  }
}

const MainPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { openLoginDialog } = useAuth()
  const [homeContent, setHomeContent] = useState<HomePageContent>(cloneDefaultContent)

  useEffect(() => {
    if (searchParams.get('verified') !== 'success') {
      return
    }

    openLoginDialog()
    // Consume the flag so the dialog does not re-open on later renders/navigation.
    setSearchParams({}, { replace: true })
  }, [openLoginDialog, searchParams, setSearchParams])

  useEffect(() => {
    const loadHomeContent = async () => {
      try {
        const data = await siteContentService.getPublicByPageKey<HomePageContent>(HOME_PAGE_KEY)
        setHomeContent(ensureHomeContent(data.content_data))
      } catch {
        // Keep fallback content when API is unavailable.
      }
    }

    void loadHomeContent()
  }, [])

  const flowItems = useMemo(
    () => [
      {
        title: homeContent.flow.items[0]?.title,
        description: homeContent.flow.items[0]?.description,
        icon: <CalendarMonthRoundedIcon sx={{ fontSize: 42 }} />,
      },
      {
        title: homeContent.flow.items[1]?.title,
        description: homeContent.flow.items[1]?.description,
        icon: <Inventory2RoundedIcon sx={{ fontSize: 42 }} />,
      },
      {
        title: homeContent.flow.items[2]?.title,
        description: homeContent.flow.items[2]?.description,
        icon: <LocalShippingRoundedIcon sx={{ fontSize: 42 }} />,
      },
    ],
    [homeContent.flow.items],
  )

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
            backgroundImage: `linear-gradient(115deg, rgba(9, 21, 19, 0.7), rgba(9, 21, 19, 0.45)), url(${homeContent.hero.image_url})`,
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
              {homeContent.hero.title}
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
              {homeContent.hero.description}
            </Typography>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to={homeContent.hero.button_link || defaultProductsPath}
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
              {homeContent.hero.button_text}
            </Button>
          </Box>
        </Container>
      </Box>

      {homeContent.showcase_blocks.map((block, index) => (
        <Grid container key={block.title}>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              minHeight: { xs: 260, md: 420 },
              order: { xs: 1, md: index % 2 === 0 ? 1 : 2 },
              backgroundImage: `url(${block.image_url})`,
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
            {homeContent.flow.title}
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
            backgroundImage: `linear-gradient(180deg, rgba(8, 31, 31, 0.3), rgba(8, 31, 31, 0.65)), url(${homeContent.bottom_cta.image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(0.95)',
          }}
        />
        <Container sx={{ position: 'relative', zIndex: 1, px: 3 }}>
          <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
            {homeContent.bottom_cta.title}
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
            {homeContent.bottom_cta.description}
          </Typography>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to={homeContent.bottom_cta.button_link || defaultProductsPath}
            sx={{
              color: 'common.white',
              borderColor: 'rgba(255,255,255,0.85)',
              px: 5,
              '&:hover': { borderColor: 'common.white', bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            {homeContent.bottom_cta.button_text}
          </Button>
        </Container>
      </Box>

      <Footer
        title={homeContent.footer.title}
        buttonText={homeContent.footer.button_text}
        description={homeContent.footer.description}
        socialLinks={homeContent.footer.social_links}
      />
    </Box>
  )
}

export default MainPage
