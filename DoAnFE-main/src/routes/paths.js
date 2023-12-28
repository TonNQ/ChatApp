// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  signup: path(ROOTS_AUTH, '/signup'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  forgotPassword: path(ROOTS_AUTH, '/forgot-password'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    conversation: path(ROOTS_DASHBOARD, '/chat/:conversationKey'),
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  users: {
    root: path(ROOTS_DASHBOARD, '/users'),
    profile: path(ROOTS_DASHBOARD, '/users/profile'),
    cards: path(ROOTS_DASHBOARD, '/users/cards'),
    list: path(ROOTS_DASHBOARD, '/users/list'),
    newUser: path(ROOTS_DASHBOARD, '/users/new'),
    edit: path(ROOTS_DASHBOARD, `/users/edit`),
    account: path(ROOTS_DASHBOARD, '/users/account'),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    product: path(ROOTS_DASHBOARD, '/e-commerce/product/:name'),
    productById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    newProduct: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    editById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    invoice: path(ROOTS_DASHBOARD, '/e-commerce/invoice'),
  },
  topics: {
    root: path(ROOTS_DASHBOARD, '/learn/topics'),
    newTopic: path(ROOTS_DASHBOARD, '/learn/topics/new-topic'),
    edit: path(ROOTS_DASHBOARD, '/learn/topics/:id/edit'),
  },
  lessons: {
    root: path(ROOTS_DASHBOARD, '/learn/lessons'),
    lessonById: path(ROOTS_DASHBOARD, '/learn/lessons/:id'),
    examResult: path(ROOTS_DASHBOARD, '/learn/lessons/:id/result'),
    newLession: path(ROOTS_DASHBOARD, ':topicId/learn/new-lession'),
    edit: path(ROOTS_DASHBOARD, '/learn/lessons/:id/edit'),
  },
  questions: {
    root: path(ROOTS_DASHBOARD, '/learn/questions'),
    newQuestion: path(ROOTS_DASHBOARD, ':lessonId/learn/new-question'),
    edit: path(ROOTS_DASHBOARD, '/learn/questions/:id/edit'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    edit: path(ROOTS_DASHBOARD, '/blog/posts/:id/edit'),
    post: path(ROOTS_DASHBOARD, '/blog/post/:title'),
    postById: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
    newPost: path(ROOTS_DASHBOARD, '/blog/new-post'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
