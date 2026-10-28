import { Locale } from './types'
import { Category, Product } from '../types'

export interface LocalizedProductFields {
  title: string
  description: string
  unit?: string
  prepTime?: string
  badge?: string
  ingredients?: string[]
}

export const PRODUCT_TRANSLATIONS: Record<string, Record<Locale, LocalizedProductFields>> = {
  'prod-1': {
    'uz-Latn': {
      title: 'Zarrin tandir somsa (Mol go‘shti & Ko‘katlar)',
      description: 'An’anaviy loy tandir devorida pishirilgan qarsildoq qatlama somsa. Shirali maydalangan mol go‘shti, shirin piyoz, zira va yangi tuyilgan qora murch bilan to‘ldirilgan.',
      unit: 'porsiya (2 dona)',
      prepTime: 'Har kuni 10:00 va 16:00 da yangi uziladi',
      badge: 'Xit savdo',
      ingredients: ['Sarxil mol go‘shti', 'Qatlama xamir', 'Shirin piyoz', 'Tog‘ zirasi', 'Kunjut'],
    },
    'uz-Cyrl': {
      title: 'Заррин тандир сомса (Мол гўшти & Кўкатлар)',
      description: 'Анъанавий лой тандир деворида пиширилган қарсилдоқ қатлама сомса. Ширали майдаланган мол гўшти, ширин пиёз, зира ва янги туйилган қора мурч билан тўлдирилган.',
      unit: 'порция (2 дона)',
      prepTime: 'Ҳар куни 10:00 ва 16:00 да янги узилади',
      badge: 'Хит савдо',
      ingredients: ['Сархил мол гўшти', 'Қатлама хамир', 'Ширин пиёз', 'Тоғ зираси', 'Кунжут'],
    },
    ru: {
      title: 'Золотистая тандырная самса (Говядина & Травы)',
      description: 'Хрустящая слоёная самса, запечённая на стенках традиционного глиняного тандыра. Начинка из сочной рубленой говядины, сладкого лука, горной зиры и свежемолотого перца.',
      unit: 'порция (2 шт)',
      prepTime: 'Выпекается каждый день в 10:00 и 16:00',
      badge: 'Хит продаж',
      ingredients: ['Отборная говядина', 'Слоёное тесто', 'Сладкий лук', 'Горная зира', 'Кунжут'],
    },
    en: {
      title: 'Golden Tandoor Samsa (Beef & Herbs)',
      description: 'Crispy, multi-layered puff pastry baked on the ceramic walls of a traditional clay tandoor. Filled with tender minced beef, sweet diced onions, cumin, and freshly crushed black pepper.',
      unit: 'portion (2 pcs)',
      prepTime: 'Fresh daily at 10:00 & 16:00',
      badge: 'Bestseller',
      ingredients: ['Tender beef', 'Flaky pastry', 'Sweet onions', 'Mountain cumin', 'Sesame seeds'],
    },
  },
  'prod-2': {
    'uz-Latn': {
      title: 'Mayin asal torti (An’anaviy Medovik)',
      description: 'Sakkiz qavatli yupqa karamellangan tog‘ asali korjlari, smetana va mayin qaymoqli krem bilan tun bo‘yi shimdirilgan. Og‘izda eriydi.',
      unit: 'bo‘lak (320g)',
      prepTime: '1 soat oldin buyurtma',
      badge: 'Yangi pishgan',
      ingredients: ['Zomin tog‘ asali', 'Oliy navli un', 'Tabiiy smetana', 'Madagaskar vanili'],
    },
    'uz-Cyrl': {
      title: 'Майин асал торти (Анъанавий Медовик)',
      description: 'Саккиз қаватли юпқа карамелланган тоғ асали коржлари, сметана ва майин қаймоқли крем билан тун бўйи шимдирилган. Оғизда эрийди.',
      unit: 'бўлак (320г)',
      prepTime: '1 соат олдин буюртма',
      badge: 'Янги пишган',
      ingredients: ['Зомин тоғ асали', 'Олий навли ун', 'Табиий сметана', 'Мадагаскар ванили'],
    },
    ru: {
      title: 'Нежный медовый торт (Традиционный Медовик)',
      description: 'Восемь тончайших коржей с карамелизированным горным мёдом, пропитанных за ночь нежным кремом из фермерской сметаны и сливок.',
      unit: 'кусочек (320г)',
      prepTime: 'Заказ за 1 час',
      badge: 'Свежая партия',
      ingredients: ['Горный мёд Заамина', 'Органическая мука', 'Фермерская сметана', 'Мадагаскарская ваниль'],
    },
    en: {
      title: 'Velvet Honey Cake (Traditional Medovik)',
      description: 'Eight ultra-thin caramelized wildflower honey cake layers, steeped overnight in delicate sour cream and whipped dairy frosting. Melts on the tongue with subtle honey notes.',
      unit: 'slice (320g)',
      prepTime: '1 hour notice',
      badge: 'Fresh Batch',
      ingredients: ['Zaamin mountain honey', 'Organic flour', 'Fresh farm sour cream', 'Madagascar vanilla'],
    },
  },
  'prod-3': {
    'uz-Latn': {
      title: 'Adras Ikat dasturxoni (Qo‘lda to‘qilgan)',
      description: 'Marg‘ilon to‘quvchilik ustaxonalarida anor po‘sti va yong‘oq qobig‘i tabiiy bo‘yoqlari bilan bo‘yalgan, 100% qo‘l mehnati shoyi va paxta adrasi.',
      unit: 'dona (160 x 45 sm)',
      prepTime: 'Yetkazishga tayyor',
      badge: 'Qo‘l mehnati',
    },
    'uz-Cyrl': {
      title: 'Адрас Икат дастурхони (Қўлда тўқилган)',
      description: 'Марғилон тўқувчилик устахоналарида анор пўсти ва ёнғоқ қобиғи табиий бўёқлари билан бўялган, 100% қўл меҳнати шойи ва пахта адраси.',
      unit: 'дона (160 x 45 см)',
      prepTime: 'Етказишга тайёр',
      badge: 'Қўл меҳнати',
    },
    ru: {
      title: 'Дорожка на стол из абрасового адраса (Ручное ткачество)',
      description: 'Натуральный шёлк и хлопок, сотканные вручную в Маргилане. Окрашено природными пигментами из корки граната и скорлупы грецкого ореха.',
      unit: 'шт (160 x 45 см)',
      prepTime: 'Готово к отправке',
      badge: 'Ручная работа',
    },
    en: {
      title: 'Adras Ikat Table Runner (Handwoven)',
      description: 'Authentic 100% hand-loomed silk and cotton ikat table runner dyed with natural pomegranate peel and walnut husk pigments in Margilan workshops.',
      unit: 'piece (160 x 45 cm)',
      prepTime: 'Ready to ship',
      badge: 'Handmade',
    },
  },
  'prod-4': {
    'uz-Latn': {
      title: 'Issiq achitqisiz non (Sedana va kunjutli)',
      description: '36 soat davomida tabiiy achitqida yetilgan tandir non. Naqshdor chekich bosilgan, qovurilgan sedana va tillarang kunjut bilan qoplangan.',
      unit: '1 dona (450g)',
      prepTime: 'Har 2 soatda issiq non uziladi',
      badge: 'Issiq non',
      ingredients: ['Tegirmon bug‘doy uni', 'Suv', 'Tabiiy xamirturush', 'Dengiz tuzi', 'Sedana'],
    },
    'uz-Cyrl': {
      title: 'Иссиқ ачитқисиз нон (Седана ва кунжутли)',
      description: '36 соат давомида табиий ачитқида етилган тандир нон. Нақшдор чекич босилган, қовурилган седана ва тилларанг кунжут билан қопланган.',
      unit: '1 дона (450г)',
      prepTime: 'Ҳар 2 соатда иссиқ нон узилади',
      badge: 'Иссиқ нон',
      ingredients: ['Тегирмон буғдой уни', 'Сув', 'Табиий хамиртуруш', 'Денгиз тузи', 'Седана'],
    },
    ru: {
      title: 'Теплый ремесленный тандыр-нон на закваске с седаной',
      description: 'Лепёшка длительной 36-часовой ферментации, украшенная традиционным узором чекича, обжаренным чёрным тмином (седаной) и кунжутом.',
      unit: '1 лепешка (450г)',
      prepTime: 'Горячая выпечка каждые 2 часа',
      badge: 'С пылу с жару',
      ingredients: ['Цельнозерновая мука', 'Вода', 'Дикая закваска', 'Морская соль', 'Чёрный тмин'],
    },
    en: {
      title: 'Warm Sourdough Non with Black Nigella',
      description: 'Slow-fermented 36-hour sourdough flatbread, stamped with ornate traditional chekich patterns and baked with roasted black nigella and golden sesame.',
      unit: '1 loaf (450g)',
      prepTime: 'Hot loaves every 2 hours',
      badge: 'Hot Now',
      ingredients: ['Stoneground wheat flour', 'Water', 'Wild sourdough starter', 'Sea salt', 'Black nigella'],
    },
  },
  'prod-5': {
    'uz-Latn': {
      title: 'Chotqol tog‘ gul asali (Farg‘ona vodiysi)',
      description: 'Chotqol tizmasining 2400 metr balandligidagi yovvoyi tog‘ gullaridan olingan toza xom asal. Pasterizatsiya qilinmagan, gulchangi va propolisi saqlangan.',
      unit: 'banka (500g)',
      prepTime: 'Yetkazishga tayyor',
      badge: 'Toza hosil',
    },
    'uz-Cyrl': {
      title: 'Чотқол тоғ гул асали (Фарғона водийси)',
      description: 'Чотқол тизмасининг 2400 метр баландлигидаги ёввойи тоғ гулларидан олинган тоза хом асал. Пастеризация қилинмаган, гулчанги ва прополиси сақланган.',
      unit: 'банка (500г)',
      prepTime: 'Етказишга тайёр',
      badge: 'Тоза ҳосил',
    },
    ru: {
      title: 'Горный цветочный мёд из Чаткальских хребтов',
      description: 'Натуральный сырой мёд холодного отжима, собранный на высоте 2400 метров в Чаткальском заповеднике. Без нагревания и фильтрации.',
      unit: 'банка (500г)',
      prepTime: 'Готово к отправке',
      badge: 'Чистый сбор',
    },
    en: {
      title: 'Fergana Valley Mountain Wildflower Honey',
      description: 'Cold-extracted raw mountain honey collected by nomadic beekeepers at 2,400m altitude in Chatkal ranges. Unpasteurized with pollen and propolis intact.',
      unit: 'jar (500g)',
      prepTime: 'Ready to ship',
      badge: 'Pure Harvest',
    },
  },
  'prod-6': {
    'uz-Latn': {
      title: 'Buxorocha qovoq va qo‘zi go‘shtli somsa',
      description: 'Yupqa qatlama xamir ichiga shirin qishki qovoq pyuresi, yumshoq qo‘zi go‘shti bo‘laklari va xushbo‘y kashnich urug‘lari solingan somsa.',
      unit: 'porsiya (2 dona)',
      prepTime: '30 daqiqada tayyorlanadi',
      badge: 'Mavsumiy',
    },
    'uz-Cyrl': {
      title: 'Бухороча қовоқ ва қўзи гўштли сомса',
      description: 'Юпқа қатлама хамир ичига ширин қишки қовоқ пюреси, юмшоқ қўзи гўшти бўлаклари ва хушбўй кашнич уруғлари солинган сомса.',
      unit: 'порция (2 дона)',
      prepTime: '30 дақиқада тайёрланади',
      badge: 'Мавсумий',
    },
    ru: {
      title: 'Бухарская самса с тыквой и молодой бараниной',
      description: 'Нежнейшее тесто с сочной начинкой из сладкой печеной тыквы, отборных кусочков баранины и семян кинзы.',
      unit: 'порция (2 шт)',
      prepTime: '30 минут на выпечку',
      badge: 'Сезонное',
    },
    en: {
      title: 'Bukhara Style Pumpkin & Lamb Samsa',
      description: 'Delicate paper-thin dough rolled with sweet winter pumpkin puree, small morsels of tender lamb, and aromatic coriander seeds.',
      unit: 'portion (2 pcs)',
      prepTime: '30 min preparation',
      badge: 'Seasonal',
    },
  },
  'prod-7': {
    'uz-Latn': {
      title: 'Dudlangan suluguni va tog‘ ko‘katli xachapuri',
      description: 'Yangi pishirilgan qayiqcha xamir, cho‘ziluvchan dudlangan suluguni pishlog‘i, qishloq tuxumi sarig‘i va tog‘ tarxun moyi bilan.',
      unit: '1 dona (400g)',
      prepTime: '25 daqiqada pishiriladi',
      badge: 'Yuqori reyting',
    },
    'uz-Cyrl': {
      title: 'Дудланган сулугуни ва тоғ кўкатли хачапури',
      description: 'Янги пиширилган қайиқча хамир, чўзилувчан дудланган сулугуни пишлоғи, қишлоқ тухуми сариғи ва тоғ тархун мойи билан.',
      unit: '1 дона (400г)',
      prepTime: '25 дақиқада пиширилади',
      badge: 'Юқори рейтинг',
    },
    ru: {
      title: 'Хачапури с копчёным сулугуни и горными травами',
      description: 'Свежеиспечённая лодочка с тягучим сыром сулугуни, желтком фермерского яйца и ароматным маслом с горным тархуном.',
      unit: '1 пирог (400г)',
      prepTime: '25 минут выпекание',
      badge: 'Высокий рейтинг',
    },
    en: {
      title: 'Smoked Sulguni & Fresh Herbs Khachapuri',
      description: 'Freshly baked boat-shaped pastry stuffed with stretchy smoked sulguni cheese, organic farm egg yolk, and fragrant mountain tarragon butter.',
      unit: '1 pie (400g)',
      prepTime: '25 min baking',
      badge: 'Top Rated',
    },
  },
  'prod-8': {
    'uz-Latn': {
      title: 'Yong‘oq daraxtidan choy patnisi va piyolalar',
      description: 'Farg‘ona yong‘og‘idan o‘yib yasalgan yog‘och patnis va zangori Rishton kosa-piyolalari to‘plami (4 dona piyola + patnis).',
      unit: 'to‘plam (5 buyum)',
      prepTime: 'Bugun jo‘natiladi',
      badge: 'Yog‘och o‘ymakorlik',
    },
    'uz-Cyrl': {
      title: 'Ёнғоқ дарахтидан чой патниси ва пиёлалар',
      description: 'Фарғона ёнғоғидан ўйиб ясалган ёғоч патнис ва зангори Риштон коса-пиёлалари тўплами (4 дона пиёла + патнис).',
      unit: 'тўплам (5 буюм)',
      prepTime: 'Бугун жўнатилади',
      badge: 'Ёғоч ўймакорлик',
    },
    ru: {
      title: 'Чайный поднос из грецкого ореха и риштанские пиалы',
      description: 'Сервировочный поднос из массива ферганского ореха и набор из 4 керамических пиал с кобальтовой бирюзовой глазурью Риштана.',
      unit: 'набор (5 предметов)',
      prepTime: 'Отправка сегодня',
      badge: 'Ручная резьба',
    },
    en: {
      title: 'Hand-Carved Walnut Tea Tray & Pialas',
      description: 'Set of 4 hand-thrown ceramic pialas glazed in turquoise Rishtan cobalt with a solid Fergana walnut serving platter.',
      unit: 'complete set (5 pcs)',
      prepTime: 'Ships today',
      badge: 'Solid Wood',
    },
  },
}

export function localizeProduct(product: Product, locale: Locale): Product {
  const trans = PRODUCT_TRANSLATIONS[product.id]?.[locale]
  if (!trans) return product

  return {
    ...product,
    title: trans.title || product.title,
    description: trans.description || product.description,
    unit: trans.unit || product.unit,
    prepTime: trans.prepTime || product.prepTime,
    badge: trans.badge || product.badge,
    ingredients: trans.ingredients || product.ingredients,
  }
}

export function localizeCategoryName(categoryId: string, locale: Locale, fallbackName: string): string {
  const map: Record<string, Record<Locale, string>> = {
    all: {
      'uz-Latn': 'Barchasi',
      'uz-Cyrl': 'Барчаси',
      ru: 'Все товары',
      en: 'All Local',
    },
    bakery: {
      'uz-Latn': 'Tandir & Pishiriqlar',
      'uz-Cyrl': 'Тандир & Пишириқлар',
      ru: 'Пекарня & Тандыр',
      en: 'Artisan Bakery',
    },
    national: {
      'uz-Latn': 'Milliy taomlar',
      'uz-Cyrl': 'Миллий таомлар',
      ru: 'Национальные блюда',
      en: 'National Dishes',
    },
    sweets: {
      'uz-Latn': 'Asal & Shirinliklar',
      'uz-Cyrl': 'Асал & Ширинликлар',
      ru: 'Мёд & Сладости',
      en: 'Honey & Sweets',
    },
    crafts: {
      'uz-Latn': 'Qo‘l mehnati',
      'uz-Cyrl': 'Қўл меҳнати',
      ru: 'Ремесленные изделия',
      en: 'Handmade Crafts',
    },
    dairy: {
      'uz-Latn': 'Fermer suti & qatiq',
      'uz-Cyrl': 'Фермер сути & қатиқ',
      ru: 'Фермерские молочные',
      en: 'Farm Dairy',
    },
  }

  return map[categoryId]?.[locale] || fallbackName
}
