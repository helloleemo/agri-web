import PATHS from '@/routes/paths'

const menuList = [
  {
    label: '產品',
    link: `/${PATHS.mekarang.root}/${PATHS.mekarang.products.root}`,
  },
  {
    label: '購物車',
    link: `/${PATHS.mekarang.root}/${PATHS.mekarang.orders.root}`,
  },
  {
    label: '訂單查詢',
    link: `/${PATHS.mekarang.root}/${PATHS.mekarang.orders.query}`,
  },
  //   {
  //     label: '產地故事',
  //     link: `${PATHS.mekarang.root}/${PATHS.mekarang.stories.root}`,
  //   },
  //   {
  //     label: '登入/註冊',
  //     link: `${PATHS.auth.root}/${PATHS.auth.login}`,
  //   },
]

export default menuList
