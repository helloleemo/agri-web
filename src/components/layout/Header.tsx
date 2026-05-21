import menuList from '@/settings/menu'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { IconButton, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

interface HeaderProps {
  alwaysSolidBackground?: boolean
}

const Header = ({ alwaysSolidBackground = false }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showHeaderBackground, setShowHeaderBackground] = useState(true)
  const [isHeaderHovered, setIsHeaderHovered] = useState(false)
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

  return (
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
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1.2 }}>
          MEKARANG
        </Typography>
        <Stack
          direction="row"
          spacing={3}
          sx={{
            display: {
              xs: 'none',
              md: 'flex',
            },
          }}
        >
          {menuList.map((item) => (
            <Typography
              key={item.label}
              variant="body2"
              component={RouterLink}
              to={item.link}
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer',
                opacity: 0.9,
                transition: 'opacity 180ms ease',
                '&:hover': { opacity: 1 },
              }}
            >
              {item.label}
            </Typography>
          ))}
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
        {menuList.map((item) => (
          <Typography
            key={item.label}
            variant="body1"
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
            {item.label}
          </Typography>
        ))}
      </Stack>
    </Stack>
  )
}

export default Header
