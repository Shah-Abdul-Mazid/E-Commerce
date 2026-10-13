export type Language = 'en' | 'bn' | 'hi' | 'de' | 'fi' | 'fr' | 'ar' | 'es'

export interface LanguageOption {
  code: Language
  name: string
  nativeName: string
  flag: string
  dir: 'ltr' | 'rtl'
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'bn', name: 'Bangla', nativeName: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
]

export interface Translations {
  topBar: {
    helpline: string
    portal: string
    announcement: string
    explore4Years: string
    currency: string
    location: string
  }
  nav: {
    academicHub: string
    specialEdition: string
    dedication: string
    cseCourses: string
    aiBundles: string
    singleTools: string
    billMemo: string
    dashboard: string
    admin: string
    searchPlaceholder: string
    account: string
    studentUser: string
    logout: string
    cart: string
  }
  hero: {
    badge: string
    headline: string
    subtext: string
    exploreBtn: string
    billMemoBtn: string
    academicOverview: string
    creditsTotal: string
    curriculumLabel: string
    curriculumValue: string
    autoVerifyLabel: string
    autoVerifyValue: string
    onlineGatewayLabel: string
    onlineGatewayValue: string
  }
  categories: {
    browseHeading: string
    education: string
    educationSub: string
    all: string
    allSub: string
    aiBundles: string
    aiBundlesSub: string
    singleTools: string
    singleToolsSub: string
    writingSeo: string
    writingSeoSub: string
  }
  yearNav: {
    selectYear: string
    programDesc: string
    allYears: string
    yr1: string
    yr1Desc: string
    yr2: string
    yr2Desc: string
    yr3: string
    yr3Desc: string
    yr4: string
    yr4Desc: string
    allInOne: string
    allInOneDesc: string
  }
  filters: {
    priceLowToHigh: string
    priceHighToLow: string
    topRated: string
    sortBy: string
    featured: string
    viewAccordion: string
    viewGrid: string
    coreCoursesCount: string
  }
  accordion: {
    headerTag: string
    courseTitle: string
    courseCode: string
    credits: string
    prerequisite: string
    syllabus: string
    premiumResources: string
    subscribeCourse: string
    none: string
    included: string
  }
  cards: {
    addToCart: string
    buyNow: string
    instantActivation: string
    creditsLabel: string
    prereqLabel: string
    featuresTitle: string
  }
  cartDrawer: {
    title: string
    itemsSelected: string
    emptyTitle: string
    emptyDesc: string
    subtotal: string
    fee: string
    free: string
    total: string
    payBtn: string
    securityNote: string
  }
  memoModal: {
    billerTitle: string
    subtitle: string
    billPaymentTab: string
    fundTransferTab: string
    trxIdLabel: string
    amountLabel: string
    billerLabel: string
    studentIdLabel: string
    generateBtn: string
  }
  footer: {
    title: string
    dedication: string
    address: string
    dbblAccount: string
    support: string
    copyright: string
  }
}

export const translations: Record<Language, Translations> = {
  // ==========================================
  // ENGLISH
  // ==========================================
  en: {
    topBar: {
      helpline: '+880 1711-198425 (Student Support Helpline)',
      portal: 'Official DBBL NexusPay & SSLCommerz Portal',
      announcement: '🎓 B.Sc. CSE Undergraduate Course Subscriptions Open |',
      explore4Years: 'Explore All 4 Years',
      currency: 'BDT (৳)',
      location: 'Dhaka, BD',
    },
    nav: {
      academicHub: 'ACADEMIC & CSE HUB',
      specialEdition: 'MAZID & POPY • SPECIAL EDITION',
      dedication: 'Dedicated with warmth to Jannat Farhana Popy • Curated by Shah Abdul Mazid',
      cseCourses: 'B.Sc. CSE Courses',
      aiBundles: 'AI Bundles',
      singleTools: 'Single Tools',
      billMemo: 'NexusPay Bill Memo',
      dashboard: 'Dashboard',
      admin: 'Admin',
      searchPlaceholder: 'Search CSE103, CSE246, Algorithms, Calculus, AI...',
      account: 'Account',
      studentUser: 'Student / User',
      logout: 'Logout',
      cart: 'Cart',
    },
    hero: {
      badge: 'Official Academic Hub • All 4 Years Curriculum',
      headline: 'B.Sc. Computer Science & Engineering + AI Suite',
      subtext: 'Comprehensive study packages across all 4 years: verified lecture slides, lab codes, solved exam questions, and premium AI research suites with automated sandbox activation.',
      exploreBtn: 'Explore Courses',
      billMemoBtn: 'Tuition Bill Memo',
      academicOverview: 'Academic Overview',
      creditsTotal: '140 Credits Total',
      curriculumLabel: '1st to 4th Year Curriculum',
      curriculumValue: '35 Cr / Year',
      autoVerifyLabel: 'Automated Verification',
      autoVerifyValue: 'NexusPay / DBBL',
      onlineGatewayLabel: 'Online Gateway',
      onlineGatewayValue: 'SSLCommerz Sandbox',
    },
    categories: {
      browseHeading: 'Browse Departments & Tools',
      education: 'Education',
      educationSub: 'B.Sc. CSE (1st - 4th Yr)',
      all: 'All',
      allSub: 'Products',
      aiBundles: 'AI Bundles',
      aiBundlesSub: 'Power Suites',
      singleTools: 'Single Tools',
      singleToolsSub: 'Individual Licenses',
      writingSeo: 'Writing & SEO',
      writingSeoSub: 'Academic Paraphrasers',
    },
    yearNav: {
      selectYear: 'Computer Science & Engineering • Select Academic Year',
      programDesc: 'Total 140 Credits Program • Semester Curriculum',
      allYears: 'All 4 Years (35+ Courses)',
      yr1: '1st Year',
      yr1Desc: '10 Courses • 35 Cr',
      yr2: '2nd Year',
      yr2Desc: '11 Courses • 35 Cr',
      yr3: '3rd Year',
      yr3Desc: '9 Courses • 35 Cr',
      yr4: '4th Year',
      yr4Desc: 'Capstone & 35 Cr',
      allInOne: 'Year All-in-One Passes',
      allInOneDesc: '4 Bundles',
    },
    filters: {
      priceLowToHigh: 'Price: Low to High',
      priceHighToLow: 'Price: High to Low',
      topRated: 'Top Rated',
      sortBy: 'Sort by:',
      featured: 'Featured / Best Match',
      viewAccordion: '📋 Course Profiles Accordion (Official)',
      viewGrid: '🎴 Product Cards Grid',
      coreCoursesCount: '21 Core Courses Included',
    },
    accordion: {
      headerTag: 'COURSE PROFILES OF CSE CORE COURSES',
      courseTitle: 'Course Title',
      courseCode: 'Course Code',
      credits: 'Credit Hours',
      prerequisite: 'Pre-requisite',
      syllabus: 'Curriculum & Laboratory Outline',
      premiumResources: 'Included Academic Bundle',
      subscribeCourse: 'Enroll / Access Course',
      none: 'None',
      included: 'Included',
    },
    cards: {
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      instantActivation: 'Instant Activation',
      creditsLabel: 'Credits',
      prereqLabel: 'Prerequisite',
      featuresTitle: 'Package Highlights',
    },
    cartDrawer: {
      title: 'Your Study Cart',
      itemsSelected: 'item(s) selected',
      emptyTitle: 'Your cart is empty',
      emptyDesc: 'Select any of the CSE courses or AI bundles to add to your cart.',
      subtotal: 'Subtotal',
      fee: 'Gateway Processing Fee',
      free: 'FREE (৳ 0.00)',
      total: 'Total Amount',
      payBtn: 'Pay with SSLCommerz (Sandbox)',
      securityNote: '🔒 Instant Activation with DBBL NexusPay & SSLCommerz Sandbox',
    },
    memoModal: {
      billerTitle: 'Academic Tuition & Institutional Bill Payment Generator',
      subtitle: 'Generate authentic DBBL Bill Payment receipts for university tuition fees or Fund Transfer memos.',
      billPaymentTab: 'University Bill Payment (Tuition)',
      fundTransferTab: 'Fund Transfer Memo',
      trxIdLabel: 'Transaction ID (LID / TrxID)',
      amountLabel: 'Amount in BDT (৳)',
      billerLabel: 'Biller / Institution Name',
      studentIdLabel: 'Student ID / Reference',
      generateBtn: 'Generate Official Memo',
    },
    footer: {
      title: 'Shopcart • SAMJAP Mart & Academic Hub',
      dedication: 'Dedicated with affection to Jannat Farhana Popy by Shah Abdul Mazid • B.Sc. Computer Science & Engineering',
      address: 'Dhaka, Bangladesh',
      dbblAccount: 'DBBL A/C: 107.110.198425',
      support: 'Support: support@samjap.mart',
      copyright: '© 2026 SAMJAP Mart. A Mazid & Popy Initiative. All rights reserved.',
    },
  },

  // ==========================================
  // BANGLA (বাংলা)
  // ==========================================
  bn: {
    topBar: {
      helpline: '+৮৮০ ১৭১১-১৯৮৪২৫ (শিক্ষার্থী সহায়তা হেল্পলাইন)',
      portal: 'অফিসিয়াল ডিবিবিএল নেক্সাসপে ও এসএসএলকমার্স পোর্টাল',
      announcement: '🎓 বি.এসসি. সিএসই স্নাতক কোর্স সাবস্ক্রিপশন চালু |',
      explore4Years: '৪ বছরের সকল কোর্স দেখুন',
      currency: 'টাকা (৳)',
      location: 'ঢাকা, বাংলাদেশ',
    },
    nav: {
      academicHub: 'একাডেমিক ও সিএসই হাব',
      specialEdition: 'মাজিদ ও পপি • বিশেষ সংস্করণ',
      dedication: 'জান্নাত ফারহানা পপি-র প্রতি সশ্রদ্ধ নিবেদন • কিউরেটেড বাই শাহ আব্দুল মাজিদ',
      cseCourses: 'বি.এসসি. সিএসই কোর্সসমূহ',
      aiBundles: 'এআই বান্ডেল',
      singleTools: 'একক টুলস',
      billMemo: 'নেক্সাসপে বিল মেমো',
      dashboard: 'ড্যাশবোর্ড',
      admin: 'অ্যাডমিন',
      searchPlaceholder: 'CSE103, অ্যালগরিদম, ক্যালকুলাস, এআই সার্চ করুন...',
      account: 'অ্যাকাউন্ট',
      studentUser: 'শিক্ষার্থী / ব্যবহারকারী',
      logout: 'লগআউট',
      cart: 'কার্ট',
    },
    hero: {
      badge: 'অফিসিয়াল একাডেমিক হাব • পূর্ণ ৪ বছরের পাঠ্যক্রম',
      headline: 'বি.এসসি. কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং + এআই স্যুট',
      subtext: '৪ বছরের পূর্ণাঙ্গ অ্যাকাডেমিক স্টাডি প্যাকেজ: ভেরিফাইড লেকচার স্লাইডস, ল্যাব কোড, বিগত পরীক্ষার সমাধান এবং স্বয়ংক্রিয় স্যান্ডবক্স অ্যাক্টিভেশনসহ প্রিমিয়াম এআই রিসার্চ টুলস।',
      exploreBtn: 'কোর্সসমূহ দেখুন',
      billMemoBtn: 'টিউশন ফি বিল মেমো',
      academicOverview: 'একাডেমিক সংক্ষিপ্ত রূপরেখা',
      creditsTotal: 'মোট ১৪০ ক্রেডিট',
      curriculumLabel: '১ম থেকে ৪র্থ বর্ষের পাঠ্যক্রম',
      curriculumValue: '৩৫ ক্রেডিট / বছর',
      autoVerifyLabel: 'স্বয়ংক্রিয় যাচাইকরণ',
      autoVerifyValue: 'নেক্সাসপে / ডিবিবিএল',
      onlineGatewayLabel: 'অনলাইন পেমেন্ট গেটওয়ে',
      onlineGatewayValue: 'এসএসএলকমার্স স্যান্ডবক্স',
    },
    categories: {
      browseHeading: 'বিভাগ এবং টুলসমূহ ব্রাউজ করুন',
      education: 'শিক্ষা (CSE)',
      educationSub: 'বি.এসসি. সিএসই (১ম - ৪র্থ বর্ষ)',
      all: 'সকল',
      allSub: 'পণ্যসমূহ',
      aiBundles: 'এআই বান্ডেল',
      aiBundlesSub: 'পাওয়ার স্যুট',
      singleTools: 'একক টুলস',
      singleToolsSub: 'ব্যক্তিগত লাইসেন্স',
      writingSeo: 'রাইটিং ও এসইও',
      writingSeoSub: 'অ্যাকাডেমিক প্যারাফ্রেজার',
    },
    yearNav: {
      selectYear: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং • শিক্ষাবর্ষ নির্বাচন করুন',
      programDesc: 'সর্বমোট ১৪০ ক্রেডিট প্রোগ্রাম • ট্রাইমেস্টার/সেমিস্টার পাঠ্যক্রম',
      allYears: 'সকল ৪ বছর (৩৫+ কোর্স)',
      yr1: '১ম বর্ষ',
      yr1Desc: '১০টি কোর্স • ৩৫ ক্রেডিট',
      yr2: '২য় বর্ষ',
      yr2Desc: '১১টি কোর্স • ৩৫ ক্রেডিট',
      yr3: '৩য় বর্ষ',
      yr3Desc: '৯টি কোর্স • ৩৫ ক্রেডিট',
      yr4: '৪র্থ বর্ষ',
      yr4Desc: 'ক্যাপস্টোন ও ৩৫ ক্রেডিট',
      allInOne: 'বার্ষিক অল-ইন-ওয়ান পাস',
      allInOneDesc: '৪টি বান্ডেল',
    },
    filters: {
      priceLowToHigh: 'মূল্য: কম থেকে বেশি',
      priceHighToLow: 'মূল্য: বেশি থেকে কম',
      topRated: 'সর্বোচ্চ রেটেড',
      sortBy: 'সাজান:',
      featured: 'ফিচার্ড / সেরা মিল',
      viewAccordion: '📋 কোর্স প্রোফাইল অ্যাকর্ডিয়ন (অফিসিয়াল)',
      viewGrid: '🎴 প্রোডাক্ট কার্ড গ্রিড',
      coreCoursesCount: '২১টি কোর কোর্স অন্তর্ভুক্ত',
    },
    accordion: {
      headerTag: 'সিএসই কোর কোর্সের বিস্তারিত প্রোফাইল',
      courseTitle: 'কোর্সের নাম',
      courseCode: 'কোর্স কোড',
      credits: 'ক্রেডিট আওয়ার',
      prerequisite: 'পূর্বশর্ত (Pre-requisite)',
      syllabus: 'কারিকুলাম ও ল্যাবরেটরি রূপরেখা',
      premiumResources: 'অন্তর্ভুক্ত অ্যাকাডেমিক বান্ডেল',
      subscribeCourse: 'এনরোল / অ্যাক্সেস নিন',
      none: 'নেই',
      included: 'অন্তর্ভুক্ত',
    },
    cards: {
      addToCart: 'কার্টে যোগ করুন',
      buyNow: 'এখনই কিনুন',
      instantActivation: 'তাৎক্ষণিক অ্যাক্টিভেশন',
      creditsLabel: 'ক্রেডিট',
      prereqLabel: 'পূর্বশর্ত',
      featuresTitle: 'প্যাকেজের প্রধান বৈশিষ্ট্য',
    },
    cartDrawer: {
      title: 'আপনার স্টাডি কার্ট',
      itemsSelected: 'টি আইটেম নির্বাচিত',
      emptyTitle: 'আপনার কার্ট খালি',
      emptyDesc: 'কার্টে যোগ করতে যেকোনো সিএসই কোর্স বা এআই বান্ডেল বেছে নিন।',
      subtotal: 'সাবটোটাল',
      fee: 'গেটওয়ে প্রসেসিং ফি',
      free: 'ফ্রি (৳ ০.০০)',
      total: 'মোট প্রদেয়',
      payBtn: 'এসএসএলকমার্সে পরিশোধ করুন (স্যান্ডবক্স)',
      securityNote: '🔒 ডিবিবিএল নেক্সাসপে এবং এসএসএলকমার্স স্যান্ডবক্স তাৎক্ষণিক অ্যাক্টিভেশন',
    },
    memoModal: {
      billerTitle: 'অ্যাকাডেমিক টিউশন ফি ও প্রতিষ্ঠান বিল পেমেন্ট জেনারেটর',
      subtitle: 'বিশ্ববিদ্যালয় টিউশন ফি বা ফান্ড ট্রান্সফারের জন্য ডিবিবিএল অফিসিয়াল রসিদ তৈরি করুন।',
      billPaymentTab: 'বিশ্ববিদ্যালয় বিল পেমেন্ট (টিউশন)',
      fundTransferTab: 'ফান্ড ট্রান্সফার মেমো',
      trxIdLabel: 'ট্রানজ্যাকশন আইডি (LID / TrxID)',
      amountLabel: 'পরিমাণ (৳)',
      billerLabel: 'বিলারের নাম / প্রতিষ্ঠান',
      studentIdLabel: 'স্টুডেন্ট আইডি / রেফারেন্স',
      generateBtn: 'অফিসিয়াল মেমো তৈরি করুন',
    },
    footer: {
      title: 'Shopcart • স্যামজাপ মার্ট ও অ্যাকাডেমিক হাব',
      dedication: 'জান্নাত ফারহানা পপি-র প্রতি সস্নেহ নিবেদনে শাহ আব্দুল মাজিদ • বি.এসসি. কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং',
      address: 'ঢাকা, বাংলাদেশ',
      dbblAccount: 'ডিবিবিএল হিসাব: 107.110.198425',
      support: 'সহায়তা: support@samjap.mart',
      copyright: '© ২০২৬ SAMJAP Mart. মাজিদ ও পপি উদ্যোগ। সর্বস্বত্ব সংরক্ষিত।',
    },
  },

  // ==========================================
  // HINDI (हिन्दी)
  // ==========================================
  hi: {
    topBar: {
      helpline: '+880 1711-198425 (छात्र सहायता हेल्पलाइन)',
      portal: 'आधिकारिक DBBL नेक्ससपे और SSLCommerz पोर्टल',
      announcement: '🎓 B.Sc. CSE स्नातक पाठ्यक्रम सदस्यता शुरू |',
      explore4Years: 'सभी 4 वर्षों के कोर्स देखें',
      currency: 'BDT (৳)',
      location: 'ढाका, बीडी',
    },
    nav: {
      academicHub: 'शैक्षणिक और सीएसई हब',
      specialEdition: 'माजिद और पोपी • विशेष संस्करण',
      dedication: 'जन्नत फरहाना पोपी को सादर समर्पित • शाह अब्दुल माजिद द्वारा क्यूरेटेड',
      cseCourses: 'B.Sc. CSE कोर्सेज',
      aiBundles: 'एआई बंडल्स',
      singleTools: 'एकल उपकरण',
      billMemo: 'नेक्ससपे बिल मेमो',
      dashboard: 'डैशबोर्ड',
      admin: 'एडमिन',
      searchPlaceholder: 'CSE103, एल्गोरिदम, कैलकुलस, AI खोजें...',
      account: 'खाता',
      studentUser: 'छात्र / उपयोगकर्ता',
      logout: 'लॉगआउट',
      cart: 'कार्ट',
    },
    hero: {
      badge: 'आधिकारिक शैक्षणिक हब • सभी 4 वर्षों का पाठ्यक्रम',
      headline: 'B.Sc. कंप्यूटर साइंस एंड इंजीनियरिंग + एआई सूट',
      subtext: 'सभी 4 वर्षों के लिए व्यापक अध्ययन पैकेज: सत्यापित व्याख्यान नोट्स, लैब कोड, हल किए गए प्रश्न पत्र और स्वचालित सैंडबॉक्स सक्रियण के साथ प्रीमियम एआई अनुसंधान उपकरण।',
      exploreBtn: 'कोर्स देखें',
      billMemoBtn: 'ट्यूशन बिल मेमो',
      academicOverview: 'शैक्षणिक अवलोकन',
      creditsTotal: 'कुल 140 क्रेडिट',
      curriculumLabel: '1 से 4 वर्ष का पाठ्यक्रम',
      curriculumValue: '35 क्रेडिट / वर्ष',
      autoVerifyLabel: 'स्वचालित सत्यापन',
      autoVerifyValue: 'नेक्ससपे / DBBL',
      onlineGatewayLabel: 'ऑनलाइन गेटवे',
      onlineGatewayValue: 'SSLCommerz सैंडबॉक्स',
    },
    categories: {
      browseHeading: 'विभाग और टूल्स ब्राउज़ करें',
      education: 'शिक्षा (CSE)',
      educationSub: 'B.Sc. CSE (1 से 4 वर्ष)',
      all: 'सभी',
      allSub: 'उत्पाद',
      aiBundles: 'एआई बंडल',
      aiBundlesSub: 'पावर सूट',
      singleTools: 'एकल उपकरण',
      singleToolsSub: 'व्यक्तिगत लाइसेंस',
      writingSeo: 'लेखन और एसईओ',
      writingSeoSub: 'एकेडमिक पैराफ़्रेज़र',
    },
    yearNav: {
      selectYear: 'कंप्यूटर साइंस एंड इंजीनियरिंग • शैक्षणिक वर्ष चुनें',
      programDesc: 'कुल 140 क्रेडिट कार्यक्रम • सेमेस्टर पाठ्यक्रम',
      allYears: 'सभी 4 वर्ष (35+ कोर्सेज)',
      yr1: 'प्रथम वर्ष',
      yr1Desc: '10 कोर्स • 35 क्रेडिट',
      yr2: 'द्वितीय वर्ष',
      yr2Desc: '11 कोर्स • 35 क्रेडिट',
      yr3: 'तृतीय वर्ष',
      yr3Desc: '9 कोर्स • 35 क्रेडिट',
      yr4: 'चतुर्थ वर्ष',
      yr4Desc: 'कैपस्टोन और 35 क्रेडिट',
      allInOne: 'वार्षिक ऑल-इन-वन पास',
      allInOneDesc: '4 बंडल',
    },
    filters: {
      priceLowToHigh: 'मूल्य: कम से अधिक',
      priceHighToLow: 'मूल्य: अधिक से कम',
      topRated: 'शीर्ष मूल्यांकित',
      sortBy: 'क्रमबद्ध करें:',
      featured: 'विशेष रुप से प्रदर्शित',
      viewAccordion: '📋 कोर्स प्रोफाइल अकॉर्डियन (आधिकारिक)',
      viewGrid: '🎴 उत्पाद कार्ड ग्रिड',
      coreCoursesCount: '21 कोर कोर्स शामिल',
    },
    accordion: {
      headerTag: 'सीएसई कोर पाठ्यक्रमों की रूपरेखा',
      courseTitle: 'कोर्स का शीर्षक',
      courseCode: 'कोर्स कोड',
      credits: 'क्रेडिट घंटे',
      prerequisite: 'पूर्व-आवश्यकता',
      syllabus: 'पाठ्यक्रम और प्रयोगशाला रूपरेखा',
      premiumResources: 'शामिल शैक्षणिक बंडल',
      subscribeCourse: 'नामांकन / प्रवेश प्राप्त करें',
      none: 'कोई नहीं',
      included: 'शामिल',
    },
    cards: {
      addToCart: 'कार्ट में जोड़ें',
      buyNow: 'अभी खरीदें',
      instantActivation: 'तत्काल सक्रियता',
      creditsLabel: 'क्रेडिट्स',
      prereqLabel: 'पूर्व-आवश्यकता',
      featuresTitle: 'पैकेज की मुख्य विशेषताएं',
    },
    cartDrawer: {
      title: 'आपकी अध्ययन कार्ट',
      itemsSelected: 'वस्तुएं चुनी गईं',
      emptyTitle: 'आपकी कार्ट खाली है',
      emptyDesc: 'कार्ट में जोड़ने के लिए किसी भी सीएसई कोर्स या एआई बंडल का चयन करें।',
      subtotal: 'उप-योग',
      fee: 'गेटवे प्रोसेसिंग शुल्क',
      free: 'मुफ़्त (৳ 0.00)',
      total: 'कुल राशि',
      payBtn: 'SSLCommerz से भुगतान करें (सैंडबॉक्स)',
      securityNote: '🔒 DBBL नेक्ससपे और SSLCommerz सैंडबॉक्स त्वरित सक्रियण',
    },
    memoModal: {
      billerTitle: 'विश्वविद्यालय ट्यूशन शुल्क और बिल भुगतान जनरेटर',
      subtitle: 'विश्वविद्यालय शुल्क या फंड ट्रांसफर के लिए आधिकारिक DBBL रसीद बनाएं।',
      billPaymentTab: 'विश्वविद्यालय बिल भुगतान (ट्यूशन)',
      fundTransferTab: 'फंड ट्रांसफर मेमो',
      trxIdLabel: 'लेनदेन आईडी (LID / TrxID)',
      amountLabel: 'राशि BDT (৳)',
      billerLabel: 'संस्थान / बिलर का नाम',
      studentIdLabel: 'छात्र आईडी / संदर्भ',
      generateBtn: 'आधिकारिक मेमो जनरेट करें',
    },
    footer: {
      title: 'Shopcart • SAMJAP मार्ट और एकेडमिक हब',
      dedication: 'जन्नत फरहाना पोपी को सप्रेम समर्पित, शाह अब्दुल माजिद द्वारा • B.Sc. कंप्यूटर साइंस',
      address: 'ढाका, बांग्लादेश',
      dbblAccount: 'DBBL खाता: 107.110.198425',
      support: 'सहायता: support@samjap.mart',
      copyright: '© 2026 SAMJAP Mart. माजिद और पोपी पहल। सर्वाधिकार सुरक्षित।',
    },
  },

  // ==========================================
  // GERMAN (Deutsch)
  // ==========================================
  de: {
    topBar: {
      helpline: '+880 1711-198425 (Studienberatung Hotline)',
      portal: 'Offizielles DBBL NexusPay & SSLCommerz Portal',
      announcement: '🎓 B.Sc. Informatik Studienabonnements geöffnet |',
      explore4Years: 'Alle 4 Studienjahre entdecken',
      currency: 'BDT (৳)',
      location: 'Dhaka, BD',
    },
    nav: {
      academicHub: 'AKADEMIE & INFORMATIK HUB',
      specialEdition: 'MAZID & POPY • SONDEREDITION',
      dedication: 'Herzlich gewidmet Jannat Farhana Popy • Kuratiert von Shah Abdul Mazid',
      cseCourses: 'B.Sc. Informatik Kurse',
      aiBundles: 'KI-Pakete',
      singleTools: 'Einzelwerkzeuge',
      billMemo: 'NexusPay Rechnungsbeleg',
      dashboard: 'Dashboard',
      admin: 'Admin',
      searchPlaceholder: 'Suche nach CSE103, Algorithmen, Analysis, KI...',
      account: 'Konto',
      studentUser: 'Student / Benutzer',
      logout: 'Abmelden',
      cart: 'Warenkorb',
    },
    hero: {
      badge: 'Offizieller akademischer Hub • Vollständiges 4-Jahres-Curriculum',
      headline: 'B.Sc. Informatik & Ingenieurwesen + KI-Suite',
      subtext: 'Umfassende Studienpakete für alle 4 Jahre: verifizierte Vorlesungsfolien, Laborcodes, gelöste Prüfungsaufgaben und Premium-KI-Tools mit automatischer Sandbox-Aktivierung.',
      exploreBtn: 'Kurse erkunden',
      billMemoBtn: 'Studiengebühren-Beleg',
      academicOverview: 'Akademische Übersicht',
      creditsTotal: '140 Leistungspunkte (Credits)',
      curriculumLabel: 'Lehrplan 1. bis 4. Studienjahr',
      curriculumValue: '35 Cr / Jahr',
      autoVerifyLabel: 'Automatische Verifizierung',
      autoVerifyValue: 'NexusPay / DBBL',
      onlineGatewayLabel: 'Online-Zahlungsgateway',
      onlineGatewayValue: 'SSLCommerz Sandbox',
    },
    categories: {
      browseHeading: 'Fachbereiche & Tools durchsuchen',
      education: 'Informatik & Studium',
      educationSub: 'B.Sc. CSE (1. - 4. Jahr)',
      all: 'Alle',
      allSub: 'Produkte',
      aiBundles: 'KI-Pakete',
      aiBundlesSub: 'Komplettpakete',
      singleTools: 'Einzelwerkzeuge',
      singleToolsSub: 'Individuelle Lizenzen',
      writingSeo: 'Text & SEO',
      writingSeoSub: 'Akademische Paraphrasierer',
    },
    yearNav: {
      selectYear: 'Informatik & Ingenieurwesen • Studienjahr wählen',
      programDesc: 'Gesamt 140 Leistungspunkte • Semester-Curriculum',
      allYears: 'Alle 4 Jahre (35+ Kurse)',
      yr1: '1. Studienjahr',
      yr1Desc: '10 Kurse • 35 Cr',
      yr2: '2. Studienjahr',
      yr2Desc: '11 Kurse • 35 Cr',
      yr3: '3. Studienjahr',
      yr3Desc: '9 Kurse • 35 Cr',
      yr4: '4. Studienjahr',
      yr4Desc: 'Abschlussprojekt & 35 Cr',
      allInOne: 'Jahres-All-in-One-Pässe',
      allInOneDesc: '4 Pakete',
    },
    filters: {
      priceLowToHigh: 'Preis: Aufsteigend',
      priceHighToLow: 'Preis: Absteigend',
      topRated: 'Top-Bewertet',
      sortBy: 'Sortieren nach:',
      featured: 'Hervorgehoben / Beste Treffer',
      viewAccordion: '📋 Kurs-Akkordeon (Offiziell)',
      viewGrid: '🎴 Produktkarten-Raster',
      coreCoursesCount: '21 Kernkurse enthalten',
    },
    accordion: {
      headerTag: 'KURSPROFILE DER INFORMATIK-KERNFÄCHER',
      courseTitle: 'Kurstitel',
      courseCode: 'Kurs-Code',
      credits: 'Leistungspunkte (Credits)',
      prerequisite: 'Voraussetzung',
      syllabus: 'Lehrplan & Laborübersicht',
      premiumResources: 'Enthaltenes Studienpaket',
      subscribeCourse: 'Kurs freischalten / belegen',
      none: 'Keine',
      included: 'Enthalten',
    },
    cards: {
      addToCart: 'In den Warenkorb',
      buyNow: 'Jetzt kaufen',
      instantActivation: 'Sofortige Aktivierung',
      creditsLabel: 'Credits',
      prereqLabel: 'Voraussetzung',
      featuresTitle: 'Paket-Highlights',
    },
    cartDrawer: {
      title: 'Ihr Studien-Warenkorb',
      itemsSelected: 'Artikel ausgewählt',
      emptyTitle: 'Ihr Warenkorb ist leer',
      emptyDesc: 'Wählen Sie einen Informatik-Kurs oder ein KI-Paket aus, um es hinzuzufügen.',
      subtotal: 'Zwischensumme',
      fee: 'Zahlungsgebühr',
      free: 'KOSTENLOS (৳ 0,00)',
      total: 'Gesamtbetrag',
      payBtn: 'Mit SSLCommerz bezahlen (Sandbox)',
      securityNote: '🔒 Sofortige Aktivierung mit DBBL NexusPay & SSLCommerz Sandbox',
    },
    memoModal: {
      billerTitle: 'Generator für Studiengebühren & Rechnungsbelege',
      subtitle: 'Erstellen Sie authentische DBBL-Zahlungsbelege für Universitätsgebühren oder Überweisungen.',
      billPaymentTab: 'Studiengebühren-Rechnung',
      fundTransferTab: 'Überweisungs-Memo',
      trxIdLabel: 'Transaktions-ID (LID / TrxID)',
      amountLabel: 'Betrag in BDT (৳)',
      billerLabel: 'Name der Hochschule / Institution',
      studentIdLabel: 'Matrikelnummer / Referenz',
      generateBtn: 'Offiziellen Beleg generieren',
    },
    footer: {
      title: 'Shopcart • SAMJAP Mart & Akademie-Hub',
      dedication: 'In herzlicher Zuneigung Jannat Farhana Popy gewidmet von Shah Abdul Mazid • B.Sc. Informatik',
      address: 'Dhaka, Bangladesch',
      dbblAccount: 'DBBL Kto: 107.110.198425',
      support: 'Support: support@samjap.mart',
      copyright: '© 2026 SAMJAP Mart. Eine Mazid & Popy Initiative. Alle Rechte vorbehalten.',
    },
  },

  // ==========================================
  // FINNISH (Suomi)
  // ==========================================
  fi: {
    topBar: {
      helpline: '+880 1711-198425 (Opiskelijoiden tukilinja)',
      portal: 'Virallinen DBBL NexusPay & SSLCommerz -portaali',
      announcement: '🎓 Tietotekniikan (B.Sc. CSE) kurssitilaukset avattu |',
      explore4Years: 'Selaa kaikkia 4 vuotta',
      currency: 'BDT (৳)',
      location: 'Dhaka, BD',
    },
    nav: {
      academicHub: 'AKATEEMINEN JA CSE-KESKUS',
      specialEdition: 'MAZID & POPY • ERIKOISPAINOS',
      dedication: 'Lämpimästi omistettu Jannat Farhana Popylle • Kuratoinut Shah Abdul Mazid',
      cseCourses: 'B.Sc. CSE -kurssit',
      aiBundles: 'Tekoälypaketit',
      singleTools: 'Yksittäiset työkalut',
      billMemo: 'NexusPay-maksukuitti',
      dashboard: 'Kojelauta',
      admin: 'Ylläpito',
      searchPlaceholder: 'Hae kursseja: CSE103, algoritmit, matematiikka, tekoäly...',
      account: 'Tili',
      studentUser: 'Opiskelija / Käyttäjä',
      logout: 'Kirjaudu ulos',
      cart: 'Ostoskori',
    },
    hero: {
      badge: 'Virallinen akateeminen keskus • Koko 4 vuoden opintosuunnitelma',
      headline: 'B.Sc. Tietotekniikka ja ohjelmistotekniikka + Tekoäly',
      subtext: 'Kattavat opintopaketit kaikille 4 vuodelle: vahvistetut luentomateriaalit, laboratorion koodit, ratkaistut koetehtävät ja laadukkaat tekoälytyökalut välittömällä aktivoinnilla.',
      exploreBtn: 'Tutustu kursseihin',
      billMemoBtn: 'Lukukausimaksukuitti',
      academicOverview: 'Akateeminen katsaus',
      creditsTotal: 'Yhteensä 140 opintopistettä',
      curriculumLabel: '1.–4. vuoden opintosuunnitelma',
      curriculumValue: '35 op / vuosi',
      autoVerifyLabel: 'Automaattinen vahvistus',
      autoVerifyValue: 'NexusPay / DBBL',
      onlineGatewayLabel: 'Verkkomaksupalvelu',
      onlineGatewayValue: 'SSLCommerz Sandbox',
    },
    categories: {
      browseHeading: 'Selaa osastoja ja työkaluja',
      education: 'Koulutus (CSE)',
      educationSub: 'B.Sc. CSE (1.–4. vuosi)',
      all: 'Kaikki',
      allSub: 'Tuotteet',
      aiBundles: 'Tekoälypaketit',
      aiBundlesSub: 'Tehopaketit',
      singleTools: 'Yksittäiset työkalut',
      singleToolsSub: 'Yksityislisenssit',
      writingSeo: 'Kirjoitus & SEO',
      writingSeoSub: 'Akateemiset parafraasityökalut',
    },
    yearNav: {
      selectYear: 'Tietotekniikka • Valitse lukuvuosi',
      programDesc: 'Koko 140 opintopisteen tutkinto-ohjelma • Lukukausijako',
      allYears: 'Kaikki 4 vuotta (35+ kurssia)',
      yr1: '1. vuosi',
      yr1Desc: '10 kurssia • 35 op',
      yr2: '2. vuosi',
      yr2Desc: '11 kurssia • 35 op',
      yr3: '3. vuosi',
      yr3Desc: '9 kurssia • 35 op',
      yr4: '4. vuosi',
      yr4Desc: 'Lopputyö & 35 op',
      allInOne: 'Vuoden All-in-One -passit',
      allInOneDesc: '4 pakettia',
    },
    filters: {
      priceLowToHigh: 'Hinta: Pienin ensin',
      priceHighToLow: 'Hinta: Suurin ensin',
      topRated: 'Huippuarvostellut',
      sortBy: 'Järjestys:',
      featured: 'Suositellut / Parhaat osumat',
      viewAccordion: '📋 Kurssiprofiilit (Virallinen haitari)',
      viewGrid: '🎴 Tuotekorttiristikko',
      coreCoursesCount: '21 ydinkurssia mukana',
    },
    accordion: {
      headerTag: 'TIETOTEKNIIKAN YDINKURSSIEN PROFIILIT',
      courseTitle: 'Kurssin nimi',
      courseCode: 'Kurssikoodi',
      credits: 'Opintopisteet (Credits)',
      prerequisite: 'Esitietovaatimus',
      syllabus: 'Opetussuunnitelma ja laboratoriotyöt',
      premiumResources: 'Sisältyvä opintopaketti',
      subscribeCourse: 'Ilmoittaudu / Avaa kurssi',
      none: 'Ei vaatimusta',
      included: 'Sisältyy',
    },
    cards: {
      addToCart: 'Lisää koriin',
      buyNow: 'Osta heti',
      instantActivation: 'Välitön aktivointi',
      creditsLabel: 'Opintopisteet',
      prereqLabel: 'Esitieto',
      featuresTitle: 'Paketin kohokohdat',
    },
    cartDrawer: {
      title: 'Opintokorisi',
      itemsSelected: 'tuote(tta) valittu',
      emptyTitle: 'Ostoskorisi on tyhjä',
      emptyDesc: 'Valitse mikä tahansa CSE-kurssi tai tekoälypaketti lisätäksesi koriin.',
      subtotal: 'Välisumma',
      fee: 'Maksupalvelumaksu',
      free: 'ILMAINEN (৳ 0.00)',
      total: 'Kokonaissumma',
      payBtn: 'Maksa SSLCommerzilla (Sandbox)',
      securityNote: '🔒 Välitön aktivointi DBBL NexusPayn & SSLCommerzin kautta',
    },
    memoModal: {
      billerTitle: 'Lukukausimaksujen ja laskujen kuittigeneraattori',
      subtitle: 'Luo aitoja DBBL-maksukuitteja yliopiston lukukausimaksuille tai tilisiirroille.',
      billPaymentTab: 'Yliopiston lukukausimaksu',
      fundTransferTab: 'Tilisiirtokuitti',
      trxIdLabel: 'Tapahtumatunnus (LID / TrxID)',
      amountLabel: 'Summa BDT (৳)',
      billerLabel: 'Oppilaitoksen nimi',
      studentIdLabel: 'Opiskelijatunnus / Viite',
      generateBtn: 'Luo virallinen kuitti',
    },
    footer: {
      title: 'Shopcart • SAMJAP Mart & Akateeminen Hub',
      dedication: 'Lämpimällä kiintymyksellä omistettu Jannat Farhana Popylle Shah Abdul Mazidin toimesta • B.Sc. Tietotekniikka',
      address: 'Dhaka, Bangladesh',
      dbblAccount: 'DBBL-tili: 107.110.198425',
      support: 'Tuki: support@samjap.mart',
      copyright: '© 2026 SAMJAP Mart. Mazid & Popy -aloite. Kaikki oikeudet pidätetään.',
    },
  },

  // ==========================================
  // FRENCH (Français)
  // ==========================================
  fr: {
    topBar: {
      helpline: '+880 1711-198425 (Assistance aux étudiants)',
      portal: 'Portail officiel DBBL NexusPay & SSLCommerz',
      announcement: '🎓 Abonnements aux cours de Licence en Informatique ouverts |',
      explore4Years: 'Découvrir les 4 années',
      currency: 'BDT (৳)',
      location: 'Dhaka, BD',
    },
    nav: {
      academicHub: 'PÔLE ACADÉMIQUE & INFORMATIQUE',
      specialEdition: 'MAZID & POPY • ÉDITION SPÉCIALE',
      dedication: 'Dédié chaleureusement à Jannat Farhana Popy • Organisé par Shah Abdul Mazid',
      cseCourses: 'Cours Licence Informatique',
      aiBundles: 'Packs IA',
      singleTools: 'Outils individuels',
      billMemo: 'Reçu NexusPay',
      dashboard: 'Tableau de bord',
      admin: 'Admin',
      searchPlaceholder: 'Rechercher CSE103, algorithmes, calcul, IA...',
      account: 'Compte',
      studentUser: 'Étudiant / Utilisateur',
      logout: 'Déconnexion',
      cart: 'Panier',
    },
    hero: {
      badge: 'Pôle académique officiel • Programme complet des 4 années',
      headline: 'B.Sc. Informatique & Ingénierie + Suite IA',
      subtext: 'Packs d’études complets pour les 4 années : diapositives vérifiées, codes de TP, annales corrigées et outils de recherche IA avec activation automatique.',
      exploreBtn: 'Explorer les cours',
      billMemoBtn: 'Reçu de scolarité',
      academicOverview: 'Aperçu académique',
      creditsTotal: '140 crédits au total',
      curriculumLabel: 'Programme de la 1re à la 4e année',
      curriculumValue: '35 crédits / an',
      autoVerifyLabel: 'Vérification automatisée',
      autoVerifyValue: 'NexusPay / DBBL',
      onlineGatewayLabel: 'Passerelle en ligne',
      onlineGatewayValue: 'SSLCommerz Sandbox',
    },
    categories: {
      browseHeading: 'Parcourir les filières & outils',
      education: 'Informatique (CSE)',
      educationSub: 'B.Sc. CSE (1re - 4e année)',
      all: 'Tous',
      allSub: 'Produits',
      aiBundles: 'Packs IA',
      aiBundlesSub: 'Suites complètes',
      singleTools: 'Outils individuels',
      singleToolsSub: 'Licences unitaires',
      writingSeo: 'Rédaction & SEO',
      writingSeoSub: 'Paraphraseurs académiques',
    },
    yearNav: {
      selectYear: 'Informatique & Ingénierie • Sélectionner l’année',
      programDesc: 'Programme de 140 crédits au total • Cursus semestriel',
      allYears: 'Toutes les 4 années (35+ cours)',
      yr1: '1re Année',
      yr1Desc: '10 cours • 35 crédits',
      yr2: '2e Année',
      yr2Desc: '11 cours • 35 crédits',
      yr3: '3e Année',
      yr3Desc: '9 cours • 35 crédits',
      yr4: '4e Année',
      yr4Desc: 'Projet de fin d’études & 35 cr',
      allInOne: 'Pass Annuels Tout-en-Un',
      allInOneDesc: '4 packs',
    },
    filters: {
      priceLowToHigh: 'Prix : Croissant',
      priceHighToLow: 'Prix : Décroissant',
      topRated: 'Mieux notés',
      sortBy: 'Trier par :',
      featured: 'Recommandés / Pertinence',
      viewAccordion: '📋 Accordéon officiel des cours',
      viewGrid: '🎴 Grille de cartes produits',
      coreCoursesCount: '21 cours fondamentaux inclus',
    },
    accordion: {
      headerTag: 'PROFILS DES COURS FONDAMENTAUX D’INFORMATIQUE',
      courseTitle: 'Titre du cours',
      courseCode: 'Code du cours',
      credits: 'Crédits horaires',
      prerequisite: 'Prérequis',
      syllabus: 'Programme & travaux pratiques',
      premiumResources: 'Pack académique inclus',
      subscribeCourse: 'S’inscrire / Débloquer le cours',
      none: 'Aucun',
      included: 'Inclus',
    },
    cards: {
      addToCart: 'Ajouter au panier',
      buyNow: 'Acheter maintenant',
      instantActivation: 'Activation instantanée',
      creditsLabel: 'Crédits',
      prereqLabel: 'Prérequis',
      featuresTitle: 'Points forts du pack',
    },
    cartDrawer: {
      title: 'Votre panier d’études',
      itemsSelected: 'article(s) sélectionné(s)',
      emptyTitle: 'Votre panier est vide',
      emptyDesc: 'Sélectionnez un cours d’informatique ou un pack IA pour l’ajouter à votre panier.',
      subtotal: 'Sous-total',
      fee: 'Frais de traitement',
      free: 'GRATUIT (৳ 0,00)',
      total: 'Montant total',
      payBtn: 'Payer avec SSLCommerz (Sandbox)',
      securityNote: '🔒 Activation immédiate avec DBBL NexusPay & SSLCommerz Sandbox',
    },
    memoModal: {
      billerTitle: 'Générateur de reçus de scolarité universitaire',
      subtitle: 'Générez des reçus de paiement DBBL officiels pour les frais universitaires ou les virements.',
      billPaymentTab: 'Paiement de scolarité universitaire',
      fundTransferTab: 'Reçu de virement de fonds',
      trxIdLabel: 'Identifiant de transaction (LID / TrxID)',
      amountLabel: 'Montant en BDT (৳)',
      billerLabel: 'Nom de l’établissement',
      studentIdLabel: 'Numéro d’étudiant / Référence',
      generateBtn: 'Générer le reçu officiel',
    },
    footer: {
      title: 'Shopcart • SAMJAP Mart & Pôle Académique',
      dedication: 'Dédié affectueusement à Jannat Farhana Popy par Shah Abdul Mazid • Licence en Informatique',
      address: 'Dhaka, Bangladesh',
      dbblAccount: 'Compte DBBL : 107.110.198425',
      support: 'Support : support@samjap.mart',
      copyright: '© 2026 SAMJAP Mart. Initiative Mazid & Popy. Tous droits réservés.',
    },
  },

  // ==========================================
  // ARABIC (العربية)
  // ==========================================
  ar: {
    topBar: {
      helpline: '+880 1711-198425 (خط مساعدة الطلاب)',
      portal: 'بوابة DBBL NexusPay و SSLCommerz الرسمية',
      announcement: '🎓 فتح باب الاشتراك في مقررات بكالوريوس علوم الحاسوب |',
      explore4Years: 'استكشف كافة السنوات الأربع',
      currency: 'تاكا (৳)',
      location: 'دكا، بنغلاديش',
    },
    nav: {
      academicHub: 'المركز الأكاديمي وعلوم الحاسوب',
      specialEdition: 'مزيد وبوبي • إصدار خاص',
      dedication: 'إهداء بكل مودة إلى جنات فرحانة بوبي • إشراف شاه عبد المزيد',
      cseCourses: 'مقررات بكالوريوس الحاسوب',
      aiBundles: 'باقات الذكاء الاصطناعي',
      singleTools: 'أدوات فردية',
      billMemo: 'إشعار دفع NexusPay',
      dashboard: 'لوحة التحكم',
      admin: 'الإدارة',
      searchPlaceholder: 'ابحث عن CSE103، الخوارزميات، التفاضل، الذكاء الاصطناعي...',
      account: 'الحساب',
      studentUser: 'طالب / مستخدم',
      logout: 'تسجيل خروج',
      cart: 'السلة',
    },
    hero: {
      badge: 'المركز الأكاديمي الرسمي • منهاج السنوات الأربع الكامل',
      headline: 'بكالوريوس علوم الحاسوب والهندسة + حزمة الذكاء الاصطناعي',
      subtext: 'باقات دراسية شاملة لكافة السنوات الأربع: شرائح محاضرات معتمدة، أكواد المختبرات، امتحانات محلولة، وأدوات بحثية مدعومة بالذكاء الاصطناعي مع تفعيل فوري.',
      exploreBtn: 'استكشف المقررات',
      billMemoBtn: 'إشعار الرسوم الدراسية',
      academicOverview: 'نظرة أكاديمية عامة',
      creditsTotal: '140 ساعة معتمدة إجمالاً',
      curriculumLabel: 'منهج السنوات من الأولى إلى الرابعة',
      curriculumValue: '35 ساعة / سنة',
      autoVerifyLabel: 'تحقق تلقائي فوري',
      autoVerifyValue: 'NexusPay / DBBL',
      onlineGatewayLabel: 'بوابة الدفع الإلكتروني',
      onlineGatewayValue: 'SSLCommerz Sandbox',
    },
    categories: {
      browseHeading: 'تصفح الأقسام والأدوات',
      education: 'التعليم (CSE)',
      educationSub: 'بكالوريوس الحاسوب (1 - 4)',
      all: 'الكل',
      allSub: 'المنتجات',
      aiBundles: 'باقات الذكاء الاصطناعي',
      aiBundlesSub: 'حزم متكاملة',
      singleTools: 'أدوات فردية',
      singleToolsSub: 'تراخيص شخصية',
      writingSeo: 'الكتابة والتحسين',
      writingSeoSub: 'إعادة الصياغة الأكاديمية',
    },
    yearNav: {
      selectYear: 'علوم الحاسوب والهندسة • اختر السنة الدراسية',
      programDesc: 'برنامج 140 ساعة معتمدة • المنهج الفصلي',
      allYears: 'كافة السنوات الأربع (35+ مقرر)',
      yr1: 'السنة الأولى',
      yr1Desc: '10 مقررات • 35 ساعة',
      yr2: 'السنة الثانية',
      yr2Desc: '11 مقرراً • 35 ساعة',
      yr3: 'السنة الثالثة',
      yr3Desc: '9 مقررات • 35 ساعة',
      yr4: 'السنة الرابعة',
      yr4Desc: 'مشروع التخرج و 35 ساعة',
      allInOne: 'اشتراكات سنوية شاملة',
      allInOneDesc: '4 باقات',
    },
    filters: {
      priceLowToHigh: 'السعر: من الأقل للأعلى',
      priceHighToLow: 'السعر: من الأعلى للأقل',
      topRated: 'الأعلى تقييماً',
      sortBy: 'ترتيب حسب:',
      featured: 'المميزة / الأنسب',
      viewAccordion: '📋 عرض المقررات الأكاديمية (الرسمي)',
      viewGrid: '🎴 شبكة بطاقات المنتجات',
      coreCoursesCount: '21 مقرراً أساسياً متضمناً',
    },
    accordion: {
      headerTag: 'ملفات مقررات علوم الحاسوب الأساسية',
      courseTitle: 'اسم المقرر',
      courseCode: 'رمز المقرر',
      credits: 'الساعات المعتمدة',
      prerequisite: 'المتطلب السابق',
      syllabus: 'المنهج والتمارين العملية',
      premiumResources: 'الحزمة الأكاديمية المتضمنة',
      subscribeCourse: 'التسجيل / فتح المقرر',
      none: 'لا يوجد',
      included: 'متضمن',
    },
    cards: {
      addToCart: 'أضف إلى السلة',
      buyNow: 'شراء الآن',
      instantActivation: 'تفعيل فوري',
      creditsLabel: 'الساعات',
      prereqLabel: 'المتطلب السابق',
      featuresTitle: 'أبرز مميزات الباقة',
    },
    cartDrawer: {
      title: 'سلة الدراسة الخاصة بك',
      itemsSelected: 'عنصر/عناصر مختارة',
      emptyTitle: 'سلتك فارغة',
      emptyDesc: 'اختر أي مقرر دراسي أو حزمة ذكاء اصطناعي لإضافتها إلى السلة.',
      subtotal: 'المجموع الفرعي',
      fee: 'رسوم معالجة الدفع',
      free: 'مجاناً (৳ 0.00)',
      total: 'المبلغ الإجمالي',
      payBtn: 'الدفع عبر SSLCommerz (ساندبوكس)',
      securityNote: '🔒 تفعيل فوري وآمن عبر DBBL NexusPay و SSLCommerz',
    },
    memoModal: {
      billerTitle: 'منشئ إيصالات الرسوم الدراسية والفواتير الجامعية',
      subtitle: 'إنشاء إيصالات رسمية من DBBL لدفع الرسوم الجامعية أو التحويلات المالية.',
      billPaymentTab: 'دفع الرسوم الجامعية (أقساط)',
      fundTransferTab: 'إشعار تحويل أموال',
      trxIdLabel: 'رقم المعاملة (LID / TrxID)',
      amountLabel: 'المبلغ بالتاكا (৳)',
      billerLabel: 'اسم المؤسسة / الجامعة',
      studentIdLabel: 'الرقم الجامعي / المرجع',
      generateBtn: 'إنشاء الإشعار الرسمي',
    },
    footer: {
      title: 'Shopcart • سامجاب مارت والمركز الأكاديمي',
      dedication: 'إهداء بكل مودة إلى جنات فرحانة بوبي من شاه عبد المزيد • بكالوريوس علوم الحاسوب',
      address: 'دكا، بنغلاديش',
      dbblAccount: 'حساب DBBL: 107.110.198425',
      support: 'الدعم: support@samjap.mart',
      copyright: '© 2026 SAMJAP Mart. مبادرة مزيد وبوبي. جميع الحقوق محفوظة.',
    },
  },

  // ==========================================
  // SPANISH (Español)
  // ==========================================
  es: {
    topBar: {
      helpline: '+880 1711-198425 (Línea de soporte estudiantil)',
      portal: 'Portal oficial DBBL NexusPay & SSLCommerz',
      announcement: '🎓 Suscripciones abiertas para B.Sc. en Ingeniería Informática |',
      explore4Years: 'Explorar los 4 años',
      currency: 'BDT (৳)',
      location: 'Daca, BD',
    },
    nav: {
      academicHub: 'CENTRO ACADÉMICO Y DE COMPUTACIÓN',
      specialEdition: 'MAZID & POPY • EDICIÓN ESPECIAL',
      dedication: 'Dedicado con calidez a Jannat Farhana Popy • Creado por Shah Abdul Mazid',
      cseCourses: 'Cursos B.Sc. CSE',
      aiBundles: 'Paquetes de IA',
      singleTools: 'Herramientas individuales',
      billMemo: 'Recibo NexusPay',
      dashboard: 'Panel de control',
      admin: 'Admin',
      searchPlaceholder: 'Buscar CSE103, algoritmos, cálculo, IA...',
      account: 'Cuenta',
      studentUser: 'Estudiante / Usuario',
      logout: 'Cerrar sesión',
      cart: 'Carrito',
    },
    hero: {
      badge: 'Centro académico oficial • Plan de estudios completo de 4 años',
      headline: 'B.Sc. Ciencias de la Computación e Ingeniería + Suite de IA',
      subtext: 'Paquetes de estudio completos para los 4 años: diapositivas verificadas, códigos de laboratorio, exámenes resueltos y herramientas de IA con activación automática.',
      exploreBtn: 'Explorar cursos',
      billMemoBtn: 'Recibo de matrícula',
      academicOverview: 'Resumen académico',
      creditsTotal: '140 créditos en total',
      curriculumLabel: 'Plan de estudios de 1.º a 4.º año',
      curriculumValue: '35 créditos / año',
      autoVerifyLabel: 'Verificación automatizada',
      autoVerifyValue: 'NexusPay / DBBL',
      onlineGatewayLabel: 'Pasarela de pago',
      onlineGatewayValue: 'SSLCommerz Sandbox',
    },
    categories: {
      browseHeading: 'Explorar departamentos y herramientas',
      education: 'Educación (CSE)',
      educationSub: 'B.Sc. CSE (1.º - 4.º año)',
      all: 'Todos',
      allSub: 'Productos',
      aiBundles: 'Paquetes de IA',
      aiBundlesSub: 'Suites completas',
      singleTools: 'Herramientas individuales',
      singleToolsSub: 'Licencias unitarias',
      writingSeo: 'Redacción y SEO',
      writingSeoSub: 'Parafraseadores académicos',
    },
    yearNav: {
      selectYear: 'Ingeniería Informática • Seleccionar año académico',
      programDesc: 'Programa total de 140 créditos • Plan semestral',
      allYears: 'Los 4 años (35+ cursos)',
      yr1: '1.er Año',
      yr1Desc: '10 cursos • 35 créditos',
      yr2: '2.º Año',
      yr2Desc: '11 cursos • 35 créditos',
      yr3: '3.er Año',
      yr3Desc: '9 cursos • 35 créditos',
      yr4: '4.º Año',
      yr4Desc: 'Proyecto final y 35 créditos',
      allInOne: 'Pases Anuales Todo en Uno',
      allInOneDesc: '4 paquetes',
    },
    filters: {
      priceLowToHigh: 'Precio: Menor a Mayor',
      priceHighToLow: 'Precio: Mayor a Menor',
      topRated: 'Mejor calificados',
      sortBy: 'Ordenar por:',
      featured: 'Destacados / Mejor coincidencia',
      viewAccordion: '📋 Acordeón oficial de cursos',
      viewGrid: '🎴 Cuadrícula de tarjetas',
      coreCoursesCount: '21 cursos fundamentales incluidos',
    },
    accordion: {
      headerTag: 'PERFILES DE CURSOS FUNDAMENTALES DE COMPUTACIÓN',
      courseTitle: 'Título del curso',
      courseCode: 'Código del curso',
      credits: 'Horas de crédito',
      prerequisite: 'Prerrequisito',
      syllabus: 'Plan de estudios y laboratorio',
      premiumResources: 'Paquete académico incluido',
      subscribeCourse: 'Inscribirse / Acceder al curso',
      none: 'Ninguno',
      included: 'Incluido',
    },
    cards: {
      addToCart: 'Añadir al carrito',
      buyNow: 'Comprar ahora',
      instantActivation: 'Activación instantánea',
      creditsLabel: 'Créditos',
      prereqLabel: 'Prerrequisito',
      featuresTitle: 'Puntos destacados',
    },
    cartDrawer: {
      title: 'Tu carrito de estudio',
      itemsSelected: 'artículo(s) seleccionado(s)',
      emptyTitle: 'Tu carrito está vacío',
      emptyDesc: 'Selecciona cualquier curso de CSE o paquete de IA para añadirlo al carrito.',
      subtotal: 'Subtotal',
      fee: 'Tarifa de procesamiento',
      free: 'GRATIS (৳ 0.00)',
      total: 'Importe total',
      payBtn: 'Pagar con SSLCommerz (Sandbox)',
      securityNote: '🔒 Activación instantánea con DBBL NexusPay y SSLCommerz Sandbox',
    },
    memoModal: {
      billerTitle: 'Generador de recibos de matrícula y pagos institucionales',
      subtitle: 'Genera recibos oficiales de DBBL para el pago de matrículas universitarias o transferencias.',
      billPaymentTab: 'Pago de matrícula universitaria',
      fundTransferTab: 'Recibo de transferencia',
      trxIdLabel: 'ID de transacción (LID / TrxID)',
      amountLabel: 'Monto en BDT (৳)',
      billerLabel: 'Nombre de la institución',
      studentIdLabel: 'ID de estudiante / Referencia',
      generateBtn: 'Generar recibo oficial',
    },
    footer: {
      title: 'Shopcart • SAMJAP Mart & Hub Académico',
      dedication: 'Dedicado con afecto a Jannat Farhana Popy por Shah Abdul Mazid • B.Sc. en Computación',
      address: 'Daca, Bangladés',
      dbblAccount: 'Cuenta DBBL: 107.110.198425',
      support: 'Soporte: support@samjap.mart',
      copyright: '© 2026 SAMJAP Mart. Una iniciativa de Mazid y Popy. Todos los derechos reservados.',
    },
  },
}
