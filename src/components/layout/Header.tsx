import menuList from '@/settings/menu'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { Badge, Box, Button, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import LoginDialog from '@/components/auth/LoginDialog'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useAppSnackbar } from '@/contexts/SnackbarContext'
import PATHS from '@/routes/paths'

interface HeaderProps {
  alwaysSolidBackground?: boolean
}

const Header = ({ alwaysSolidBackground = false }: HeaderProps) => {
  const navigate = useNavigate()
  const { showSnackbar } = useAppSnackbar()
  const { totalQuantity } = useCart()
  const { isAuthenticated, user, clearAuthSession, openLoginDialog } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileOrderMenuOpen, setIsMobileOrderMenuOpen] = useState(false)
  const [showHeaderBackground, setShowHeaderBackground] = useState(true)
  const [isHeaderHovered, setIsHeaderHovered] = useState(false)
  const [orderMenuAnchor, setOrderMenuAnchor] = useState<null | HTMLElement>(null)
  const [memberMenuAnchor, setMemberMenuAnchor] = useState<null | HTMLElement>(null)
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
    showSnackbar('已成功登出', { severity: 'success' })
    navigate(PATHS.root, { replace: true })
  }

  const handleOrderMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOrderMenuAnchor(event.currentTarget)
  }

  const handleOrderMenuClose = () => {
    setOrderMenuAnchor(null)
  }

  const handleMemberMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMemberMenuAnchor(event.currentTarget)
  }

  const handleMemberMenuClose = () => {
    setMemberMenuAnchor(null)
  }

  const handleChangePasswordClick = () => {
    handleMemberMenuClose()
    setIsMobileMenuOpen(false)
    navigate(`/${PATHS.mekarang.root}/${PATHS.mekarang.account.changePassword}`)
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

  const desktopNavButtonSx = {
    color: 'inherit',
    textTransform: 'none',
    px: 1,
    minWidth: 'auto',
    opacity: 0.9,
    transition: 'opacity 180ms ease',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)', opacity: 1 },
  }

  const mobileNavButtonSx = {
    color: 'inherit',
    textTransform: 'none',
    justifyContent: 'flex-start',
    py: 1,
    px: 0,
    opacity: 0.92,
    transition: 'opacity 180ms ease',
    '&:hover': { backgroundColor: 'transparent', opacity: 1 },
  }

  const menuPaperSx = {
    backgroundColor: '#ffffff',
    color: '#183126',
    minWidth: 220,
    boxShadow: '0 16px 40px rgba(9, 21, 19, 0.18)',
    border: '1px solid rgba(24, 49, 38, 0.12)',
    borderRadius: 1.5,
  }

  const menuItemSx = {
    fontSize: '0.92rem',
    '&:hover': {
      backgroundColor: 'rgba(24, 49, 38, 0.08)',
    },
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
          color: 'rgba(244, 237, 223, 0.95)',
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
                    <Button onClick={handleOrderMenuOpen} sx={desktopNavButtonSx}>
                      {item.label}
                    </Button>
                    <Menu
                      anchorEl={orderMenuAnchor}
                      open={Boolean(orderMenuAnchor)}
                      onClose={handleOrderMenuClose}
                      slotProps={{
                        paper: {
                          sx: menuPaperSx,
                        },
                      }}
                    >
                      <MenuItem onClick={handleNavigateToOrderQuery} sx={menuItemSx}>
                        用訂單編號查詢
                      </MenuItem>
                      <MenuItem
                        onClick={handleNavigateToOrderHistory}
                        disabled={!isAuthenticated}
                        sx={menuItemSx}
                      >
                        查詢個人歷史訂單
                      </MenuItem>
                    </Menu>
                  </Box>
                )
              }

              return (
                <Button
                  key={item.label}
                  component={RouterLink}
                  to={item.link}
                  sx={desktopNavButtonSx}
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
                    <Typography variant="body2" component="span" sx={{ textDecoration: 'none' }}>
                      {item.label}
                    </Typography>
                  </Badge>
                </Button>
              )
            })}

            {isAuthenticated ? (
              <>
                <Button onClick={handleMemberMenuOpen} sx={desktopNavButtonSx}>
                  {user?.user_name}
                </Button>
                <Menu
                  anchorEl={memberMenuAnchor}
                  open={Boolean(memberMenuAnchor)}
                  onClose={handleMemberMenuClose}
                  slotProps={{
                    paper: {
                      sx: {
                        ...menuPaperSx,
                        minWidth: 180,
                      },
                    },
                  }}
                >
                  <MenuItem onClick={handleChangePasswordClick} sx={menuItemSx}>
                    更改密碼
                  </MenuItem>
                </Menu>
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
                  <Button
                    onClick={() => setIsMobileOrderMenuOpen(!isMobileOrderMenuOpen)}
                    sx={{
                      ...mobileNavButtonSx,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Typography variant="body1" component="span" sx={{ textDecoration: 'none' }}>
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
                  </Button>
                  {isMobileOrderMenuOpen && (
                    <Stack
                      spacing={0.5}
                      sx={{ mt: 0.5, ml: 2, borderLeft: '2px solid rgba(255,255,255,0.2)', pl: 2 }}
                    >
                      <Button
                        onClick={() => {
                          navigate(`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.query}`)
                          setIsMobileMenuOpen(false)
                          setIsMobileOrderMenuOpen(false)
                        }}
                        sx={mobileNavButtonSx}
                      >
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{ textDecoration: 'none' }}
                        >
                          用訂單編號查詢
                        </Typography>
                      </Button>
                      <Button
                        onClick={() => {
                          if (isAuthenticated) {
                            navigate(`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.history}`)
                            setIsMobileMenuOpen(false)
                            setIsMobileOrderMenuOpen(false)
                          }
                        }}
                        sx={{
                          ...mobileNavButtonSx,
                          justifyContent: 'flex-start',
                          opacity: isAuthenticated ? 0.92 : 0.4,
                          '&:hover': { opacity: isAuthenticated ? 1 : 0.4 },
                        }}
                        disabled={!isAuthenticated}
                      >
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{ textDecoration: 'none' }}
                        >
                          查詢個人歷史訂單
                        </Typography>
                      </Button>
                    </Stack>
                  )}
                </Box>
              )
            }

            return (
              <Button
                key={item.label}
                component={RouterLink}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                sx={mobileNavButtonSx}
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
                  <Typography variant="body1" component="span" sx={{ textDecoration: 'none' }}>
                    {item.label}
                  </Typography>
                </Badge>
              </Button>
            )
          })}

          {isAuthenticated ? (
            <>
              <Button
                component={RouterLink}
                to={`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.history}`}
                onClick={() => setIsMobileMenuOpen(false)}
                sx={mobileNavButtonSx}
              >
                <Typography variant="body1" component="span" sx={{ textDecoration: 'none' }}>
                  我的訂單
                </Typography>
              </Button>
              <Typography variant="body2" sx={{ py: 1, opacity: 0.78 }}>
                已登入為 {user?.user_name}
              </Typography>
              <Button onClick={handleChangePasswordClick} sx={mobileNavButtonSx}>
                <Typography variant="body1" component="span" sx={{ textDecoration: 'none' }}>
                  更改密碼
                </Typography>
              </Button>
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
