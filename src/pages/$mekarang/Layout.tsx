import { Box } from '@mui/material'
import { Outlet, useNavigation } from 'react-router-dom'
import LoadingDialog from '@/components/common/LoadingDialog'
import { Footer, Header } from '@/components/layout'
import PATHS from '@/routes/paths'

const bannerImage =
  'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1800&q=80'

const Layout = () => {
  const navigation = useNavigation()
  const productsListPath = `/${PATHS.mekarang.root}/${PATHS.mekarang.products.root}`
  const isProductsListLoading =
    navigation.state === 'loading' && navigation.location?.pathname === productsListPath

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
