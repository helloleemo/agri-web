import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { Outlet, useNavigation } from 'react-router-dom'
import { siteContentService, type HomePageContent } from '@/api'
import LoadingDialog from '@/components/common/LoadingDialog'
import { Footer, Header } from '@/components/layout'
import PATHS from '@/routes/paths'

const HOME_PAGE_KEY = 'home'
const defaultBannerImage =
  'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1800&q=80'

const Layout = () => {
  const [bannerImage, setBannerImage] = useState(defaultBannerImage)
  const navigation = useNavigation()
  const productsListPath = `/${PATHS.mekarang.root}/${PATHS.mekarang.products.root}`
  const isProductsListLoading =
    navigation.state === 'loading' && navigation.location?.pathname === productsListPath

  useEffect(() => {
    const loadBannerImage = async () => {
      try {
        const data = await siteContentService.getPublicByPageKey<HomePageContent>(HOME_PAGE_KEY)
        const managedImage = data.content_data?.mekarang?.banner_image_url?.trim()
        if (managedImage) {
          setBannerImage(managedImage)
        }
      } catch {
        // Keep fallback banner when API is unavailable.
      }
    }

    void loadBannerImage()
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <LoadingDialog open={isProductsListLoading} />
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 180, md: 220 },
          color: 'common.white',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(180deg, rgba(24, 25, 28, 0.76), rgba(24, 25, 28, 0.35)), url(${bannerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Header alwaysSolidBackground />
      </Box>

      <Outlet />

      <Box
        sx={{
          pt: 10,
        }}
      >
        <Footer />
      </Box>
    </Box>
  )
}

export default Layout
