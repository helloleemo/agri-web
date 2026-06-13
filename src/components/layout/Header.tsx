import menuList from '@/settings/menu'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { Badge, Box, Button, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import LoginDialog from '@/components/auth/LoginDialog'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import PATHS from '@/routes/paths'

interface HeaderProps {
  alwaysSolidBackground?: boolean
}

const Header = ({ alwaysSolidBackground = false }: HeaderProps) => {
  const navigate = useNavigate()
  const { totalQuantity } = useCart()
  const { isAuthenticated, user, clearAuthSession, openLoginDialog } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileOrderMenuOpen, setIsMobileOrderMenuOpen] = useState(false)
  const [showHeaderBackground, setShowHeaderBackground] = useState(true)
  const [isHeaderHovered, setIsHeaderHovered] = useState(false)
  const [orderMenuAnchor, setOrderMenuAnchor] = useState<null | HTMLElement>(null)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    if (alwaysSolidBackground) {
      return
    }

    const handleScroll = () => {
      const currentY = window.scrollY
      const isScrollingUp = currentY < lastScrollYRef.current
      const shouldShowBackground = isScrollingUp || currentY < 8

      setShowHeaderBackground((prev) =>
        prev === shouldShowBackground ? prev : shouldShowBackground,
      )
      lastScrollYRef.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [alwaysSolidBackground])

  const shouldShowHeaderBackground =
    alwaysSolidBackground || showHeaderBackground || isHeaderHovered

  const handleLoginClick = () => {
    setIsMobileMenuOpen(false)
    openLoginDialog()
  }

  const handleLogout = () => {
    setIsMobileMenuOpen(false)
    clearAuthSession()
  }

  const handleOrderMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOrderMenuAnchor(event.currentTarget)
  }

  const handleOrderMenuClose = () => {
    setOrderMenuAnchor(null)
  }

  const handleNavigateToOrderQuery = () => {
    navigate(`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.query}`)
    handleOrderMenuClose()
  }

  const handleNavigateToOrderHistory = () => {
    if (isAuthenticated) {
      navigate(`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.history}`)
    }
    handleOrderMenuClose()
  }

  return (
    <>
      <Stack
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          px: { xs: 3, md: 6 },
          py: 2,
          mx: 'auto',
          width: '100%',
          bgcolor: {
            xs: 'rgba(9, 21, 19, 0.46)',
            md: shouldShowHeaderBackground ? 'rgba(9, 21, 19, 0.46)' : 'rgba(9, 21, 19, 0.1)',
          },
          backdropFilter: {
            xs: 'blur(8px)',
            md: shouldShowHeaderBackground ? 'blur(8px)' : 'none',
          },
          transition:
            'background-color 240ms ease, backdrop-filter 240ms ease, border-color 240ms ease',
        }}
      >
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            component={RouterLink}
            to="/"
            variant="h6"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 800,
              letterSpacing: 1.2,
              cursor: 'pointer',
            }}
          >
            MEKARANG
          </Typography>
          <Stack
            direction="row"
            spacing={2.5}
            sx={{
              alignItems: 'center',
              display: {
                xs: 'none',
                md: 'flex',
              },
            }}
          >
            {menuList.map((item) => {
              if (item.label === '訂單查詢') {
                return (
                  <Box key={item.label}>
                    <Typography
                      onClick={handleOrderMenuOpen}
                      variant="body2"
                      component="span"
                      sx={{
                        cursor: 'pointer',
                        opacity: 0.9,
                        transition: 'opacity 180ms ease',
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Menu
                      anchorEl={orderMenuAnchor}
                      open={Boolean(orderMenuAnchor)}
                      onClose={handleOrderMenuClose}
                      slotProps={{
                        paper: {
                          sx: {
                            backgroundColor: 'rgba(24, 49, 38, 0.95)',
                            backdropFilter: 'blur(8px)',
                            color: 'rgba(244, 237, 223, 0.95)',
                            minWidth: 220,
                          },
                        },
                      }}
                    >
                      <MenuItem onClick={handleNavigateToOrderQuery}>用訂單編號查詢</MenuItem>
                      <MenuItem onClick={handleNavigateToOrderHistory} disabled={!isAuthenticated}>
                        查詢個人歷史訂單
                      </MenuItem>
                    </Menu>
                  </Box>
                )
              }

              return (
                <Box
                  key={item.label}
                  component={RouterLink}
                  to={item.link}
                  sx={{
                    color: 'inherit',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    opacity: 0.9,
                    transition: 'opacity 180ms ease, transform 180ms ease',
                  }}
                >
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={item.label !== '購物車' || totalQuantity === 0}
                    overlap="circular"
                    sx={{
                      '& .MuiBadge-badge': {
                        position: 'absolute',
                        top: 0,
                        right: -4,
                        width: 10,
                        minWidth: 10,
                        height: 10,
                        borderRadius: '50%',
                      },
                    }}
                  >
                    <Typography variant="body2" component="span">
                      {item.label}
                    </Typography>
                  </Badge>
                </Box>
              )
            })}

            {isAuthenticated ? (
              <>
                <Typography variant="body2" sx={{ opacity: 0.78 }}>
                  {user?.user_name}
                </Typography>
                <Box
                  component={RouterLink}
                  to={`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.history}`}
                  sx={{
                    color: 'inherit',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    opacity: 0.9,
                    transition: 'opacity 180ms ease',
                  }}
                >
                  {/* <Typography variant="body2" component="span">
                    我的訂單
                  </Typography> */}
                </Box>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ borderColor: 'rgba(255,255,255,0.34)' }}
                >
                  登出
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={handleLoginClick}
                sx={{
                  px: 2.5,
                  borderRadius: 999,
                  backgroundColor: 'rgba(244, 237, 223, 0.95)',
                  color: '#183126',
                  '&:hover': { backgroundColor: 'rgba(251, 248, 240, 1)' },
                }}
              >
                登入
              </Button>
            )}
          </Stack>
          <IconButton
            aria-label={isMobileMenuOpen ? 'close menu' : 'open menu'}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            sx={{
              display: { xs: 'inline-flex', md: 'none' },
              color: 'inherit',
            }}
          >
            {isMobileMenuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
          </IconButton>
        </Stack>
        <Stack
          spacing={0.5}
          sx={{
            display: { xs: isMobileMenuOpen ? 'flex' : 'none', md: 'none' },
            mt: isMobileMenuOpen ? 1.5 : 0,
            pt: isMobileMenuOpen ? 1.5 : 0,
            borderTop: isMobileMenuOpen ? '1px solid rgba(255,255,255,0.16)' : 'none',
          }}
        >
          {menuList.map((item) => {
            if (item.label === '訂單查詢') {
              return (
                <Box key={item.label}>
                  <Box
                    onClick={() => setIsMobileOrderMenuOpen(!isMobileOrderMenuOpen)}
                    sx={{
                      color: 'inherit',
                      cursor: 'pointer',
                      py: 1,
                      opacity: 0.92,
                      transition: 'opacity 180ms ease',
                      '&:hover': { opacity: 1 },
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body1" component="span">
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        opacity: 0.6,
                        transform: isMobileOrderMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 180ms ease',
                      }}
                    >
                      ▼
                    </Typography>
                  </Box>
                  {isMobileOrderMenuOpen && (
                    <Stack
                      spacing={0.5}
                      sx={{ mt: 0.5, ml: 2, borderLeft: '2px solid rgba(255,255,255,0.2)', pl: 2 }}
                    >
                      <Box
                        onClick={() => {
                          navigate(`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.query}`)
                          setIsMobileMenuOpen(false)
                          setIsMobileOrderMenuOpen(false)
                        }}
                        sx={{
                          color: 'inherit',
                          cursor: 'pointer',
                          py: 1,
                          opacity: 0.92,
                          transition: 'opacity 180ms ease',
                          '&:hover': { opacity: 1 },
                        }}
                      >
                        <Typography variant="body2" component="span">
                          用訂單編號查詢
                        </Typography>
                      </Box>
                      <Box
                        onClick={() => {
                          if (isAuthenticated) {
                            navigate(`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.history}`)
                            setIsMobileMenuOpen(false)
                            setIsMobileOrderMenuOpen(false)
                          }
                        }}
                        sx={{
                          color: 'inherit',
                          cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                          py: 1,
                          opacity: isAuthenticated ? 0.92 : 0.4,
                          transition: 'opacity 180ms ease',
                          '&:hover': { opacity: isAuthenticated ? 1 : 0.4 },
                        }}
                      >
                        <Typography variant="body2" component="span">
                          查詢個人歷史訂單
                        </Typography>
                      </Box>
                    </Stack>
                  )}
                </Box>
              )
            }

            return (
              <Box
                key={item.label}
                component={RouterLink}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                sx={{
                  color: 'inherit',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  py: 1,
                  opacity: 0.92,
                  transition: 'opacity 180ms ease',
                  '&:hover': { opacity: 1 },
                }}
              >
                <Badge
                  color="error"
                  variant="dot"
                  invisible={item.label !== '購物車' || totalQuantity === 0}
                  overlap="circular"
                  sx={{
                    '& .MuiBadge-badge': {
                      width: 8,
                      minWidth: 8,
                      height: 8,
                      borderRadius: '50%',
                    },
                  }}
                >
                  <Typography variant="body1" component="span">
                    {item.label}
                  </Typography>
                </Badge>
              </Box>
            )
          })}

          {isAuthenticated ? (
            <>
              <Box
                component={RouterLink}
                to={`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.history}`}
                onClick={() => setIsMobileMenuOpen(false)}
                sx={{
                  color: 'inherit',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  py: 1,
                  opacity: 0.92,
                  transition: 'opacity 180ms ease',
                  '&:hover': { opacity: 1 },
                }}
              >
                <Typography variant="body1" component="span">
                  我的訂單
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ py: 1, opacity: 0.78 }}>
                已登入為 {user?.user_name}
              </Typography>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLogout}
                sx={{ borderColor: 'rgba(255,255,255,0.34)' }}
              >
                登出
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={handleLoginClick}
              sx={{
                mt: 1,
                borderRadius: 999,
                backgroundColor: 'rgba(244, 237, 223, 0.95)',
                color: '#183126',
                '&:hover': { backgroundColor: 'rgba(251, 248, 240, 1)' },
              }}
            >
              登入
            </Button>
          )}
        </Stack>
      </Stack>
      <LoginDialog />
    </>
  )
}

export default Header
