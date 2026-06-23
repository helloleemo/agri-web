import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Box, Button, Container, IconButton, Stack, Typography } from '@mui/material'

type FooterProps = {
  title?: string
  description?: string
  buttonText?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    youtube?: string
  }
}

const Footer = ({
  title = '與我們保持聯繫',
  description = '分享料理靈感、農場日常與最新檔期。追蹤我們，第一時間收到新品上市與優惠資訊。',
  buttonText = '聯絡我們',
  socialLinks,
}: FooterProps) => {
  const iconItems = [
    {
      key: 'facebook',
      href: socialLinks?.facebook?.trim(),
      Icon: FacebookRoundedIcon,
      label: 'Facebook',
    },
    {
      key: 'instagram',
      href: socialLinks?.instagram?.trim(),
      Icon: InstagramIcon,
      label: 'Instagram',
    },
    { key: 'youtube', href: socialLinks?.youtube?.trim(), Icon: YouTubeIcon, label: 'YouTube' },
  ].filter((item) => Boolean(item.href))

  return (
    <Box sx={{ bgcolor: '#2b2f34', py: { xs: 7, md: 9 }, color: 'grey.100' }}>
      <Container sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2, fontSize: { xs: '1.7rem', md: '2rem' } }}>
          {title}
        </Typography>
        <Typography sx={{ maxWidth: 680, mx: 'auto', opacity: 0.85, mb: 4, lineHeight: 1.85 }}>
          {description}
        </Typography>
        <Button variant="outlined" sx={{ color: 'grey.50', borderColor: 'grey.300', px: 5, mb: 4 }}>
          {buttonText}
        </Button>
        {iconItems.length ? (
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
            {iconItems.map(({ key, href, Icon, label }) => (
              <IconButton
                key={key}
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                sx={{
                  color: 'grey.100',
                  border: '1px solid rgba(255,255,255,0.25)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </Stack>
        ) : null}
      </Container>
    </Box>
  )
}

export default Footer
