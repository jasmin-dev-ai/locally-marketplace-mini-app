export type Locale = 'uz-Latn' | 'uz-Cyrl' | 'ru' | 'en'

export interface LanguageOption {
  code: Locale
  label: string
  nativeName: string
  flag: string
}

export interface StatusStepTranslation {
  label: string
  description: string
}

export interface TranslationSchema {
  common: {
    back: string
    close: string
    cancel: string
    confirm: string
    save: string
    currency: string
    free: string
    loading: string
    error: string
    itemsCount: string
  }
  nav: {
    home: string
    menu: string
    cart: string
    profile: string
  }
  header: {
    deliveringTo: string
    defaultLocation: string
    notifications: string
    artisanCatalog: string
    catalogSubtitle: string
    locallyMarketplace: string
    yourCart: string
    yourProfile: string
    profileSubtitle: string
  }
  home: {
    greetingMorning: string
    greetingDay: string
    greetingEvening: string
    heroHeadline: string
    searchPlaceholder: string
    heroBadge: string
    heroTitle: string
    heroSubtitle: string
    orderNow: string
    featuredArtisans: string
    viewAll: string
    popularPicks: string
    noProductsFound: string
    resetFilters: string
  }
  catalog: {
    searchPlaceholder: string
    filterCatalog: string
    allCategories: string
    sortBy: string
    sortRecommended: string
    sortRating: string
    sortPriceAsc: string
    sortPriceDesc: string
    tags: {
      all: string
      halal: string
      freshDaily: string
      tandoor: string
      rawHoney: string
      heritage: string
    }
  }
  categories: {
    all: string
    bakery: string
    national: string
    sweets: string
    crafts: string
    dairy: string
  }
  categoryBadges: {
    freshBatch: string
    bestseller: string
    handmade: string
  }
  product: {
    addToBasket: string
    inBasket: string
    prepTime: string
    ingredients: string
    artisanMaker: string
    verifiedArtisan: string
    inStock: string
    onlyLeft: string
    reviews: string
    portion: string
    slice: string
    piece: string
    set: string
    jar: string
  }
  cart: {
    emptyCartTitle: string
    emptyCartDesc: string
    browseCatalog: string
    clearAll: string
    clearConfirm: string
    deliveryAddress: string
    deliveryAddressValue: string
    deliverySlot: string
    slots: {
      todayAfternoon: string
      todayEvening: string
      tomorrowMorning: string
    }
    paymentMethod: string
    payments: {
      telegramPay: string
      click: string
      payme: string
      cashOnDelivery: string
    }
    orderNotePlaceholder: string
    financialSummary: string
    subtotal: string
    deliveryFee: string
    freeCourier: string
    totalToPay: string
    proceedToCheckout: string
    checkoutSuccessAlert: string
    checkoutSuccessSubtitle: string
    drawerTitle: string
    viewFullBasket: string
  }
  tracking: {
    pageTitle: string
    estimatedDelivery: string
    minsRemaining: string
    orderId: string
    closeTracking: string
    steps: {
      confirmed: StatusStepTranslation
      preparing: StatusStepTranslation
      delivering: StatusStepTranslation
      completed: StatusStepTranslation
    }
    courierNote: string
    courierCall: string
  }
  profile: {
    memberBadge: string
    patronBadge: string
    premiumBadge: string
    ordersStat: string
    savedStat: string
    pointsStat: string
    tabs: {
      orders: string
      seller: string
    }
    languageSectionTitle: string
    languageSectionSubtitle: string
    recentOrders: string
    deliveredStatus: string
    becomeSellerTitle: string
    becomeSellerDesc: string
    openStoreButton: string
    supportTitle: string
    supportDesc: string
    contactSupport: string
    appVersion: string
  }
  telegramButton: {
    viewBasket: string
    addToBasket: string
    proceedToCheckout: string
    checkout: string
  }
}
