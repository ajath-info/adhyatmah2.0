/**
 * vendorSeoContent.js
 *
 * Har pandit ke liye custom SEO content yahan define karo.
 * Key = vendor ka slug (createVendorSlug function se generate hota hai)
 *
 * Example slug for "Pt. Ashutosh Pandey" => "ashutosh-pandey"
 *
 * Naya pandit add karne ke liye:
 *  1. Uska slug find karo (console.log se ya createVendorSlug run karke)
 *  2. Neeche usi slug ka entry add karo
 */

export const VENDOR_SEO_CONTENT = {

    // ─── Pt. Ashutosh Pandey ────────────────────────────────────────────────────
    'ashutosh-pandey': {
  
      // 1. H1 Heading (page ka main heading)
      h1: 'Pt. Ashutosh Pandey | Festival & Devotional Puja Services',
  
      // 2. Intro Section (Services section ke upar)
      intro: {
        heading: 'Traditional Puja Services',
        content: [
          `Pt. Ashutosh Pandey performs festival pujas, Navratri rituals, Ram Navami ceremonies, and other traditional Hindu rituals with proper vidhi and spiritual guidance. Families planning devotional gatherings and `,
          { link: { text: 'home ceremonies', href: 'https://adhyatmah.com/book-pandit-online' } },
          ` can arrange festival pujas, Hanuman rituals, and other important spiritual occasions with proper Vedic practices. He also conducts home pujas focused on devotion, positivity, and spiritual harmony during festivals and family celebrations.`
        ]
      },
  
      // 3. About Section
      about: {
        heading: 'Pandit Ji Overview',
        content: [
          `Pt. Ashutosh Pandey is an experienced Vedic pandit known for conducting festival pujas and traditional Hindu rituals according to proper Vedic customs and devotional practices. He specializes in Navratri puja, Ram Navami rituals, Satyanarayan puja, Hanuman puja, and other spiritual ceremonies performed with sincerity and traditional discipline.\n\n`,
          `Families looking for festival pujas, devotional ceremonies, and `,
          { link: { text: 'home rituals', href: 'https://adhyatmah.com/book-pandit-online' } },
          ` can conduct traditional spiritual occasions with proper guidance and peaceful devotional practices suited for family gatherings and religious celebrations at home.`
        ]
      },
  
      // 4. Additional Details
      details: {
        experience: '10+ Years',
        specialization: 'Festival Puja, Navratri Rituals, Ram Navami Ceremonies, Hindu Rituals',
        services: 'Home Puja & Ritual Services',
        availability: 'Available for Home Services'
      },
  
      // 5. FAQ Section
      faqs: [
        {
          question: 'How can I book a pandit for festival puja?',
          answer: 'You can choose the required festival puja service and continue with the booking process through the platform.'
        },
        {
          question: 'Does Pt. Ashutosh Pandey performs Navratri puja at home?',
          answer: 'Yes, he conducts Navratri puja and other traditional Hindu rituals at home with proper vidhi and guidance.'
        },
        {
          question: 'Can I book a pandit for Ram Navami and other festival pujas together?',
          answer: 'Yes, multiple festival pujas and devotional ceremonies can be arranged together based on your preferred date and ritual requirements.'
        }
      ]
    },
  
    // ─── Pt. Satyam Dwivedi ─────────────────────────────────────────────────────
    'pandit-satyam-dwivedi': {
  
      h1: 'Pt. Satyam Dwivedi | Vedic Rituals & Havan Services',
  
      intro: {
        heading: 'Traditional Puja Services',
        content: [
          `Pt. Satyam Dwivedi performs Hindu Vedic rituals, havan ceremonies, grah shanti puja, and traditional home rituals with proper vidhi and spiritual guidance. Families planning home pujas and spiritual ceremonies can perform havan rituals, Satyanarayan puja, Navratri puja, and other traditional occasions with proper Vedic guidance. He also conducts home ceremonies focused on peace, positivity, and devotional balance for families.`
        ]
      },
  
      about: {
        heading: 'Pandit Ji Overview',
        content: [
          `Pt. Satyam Dwivedi is an experienced Vedic pandit known for conducting Hindu rituals, havan ceremonies, and `,
          { link: { text: 'traditional puja services', href: 'https://adhyatmah.com/book-pandit-online' } },
          ` according to proper Vedic customs and discipline. Every ceremony is performed with sincerity, spiritual guidance, and attention to traditional vidhi to help families perform rituals smoothly and peacefully.\n\n`,
          `Families planning home pujas, griha pravesh rituals, and devotional gatherings can conduct traditional Vedic ceremonies with proper guidance and peaceful spiritual practices.`
        ]
      },
  
      details: {
        experience: '10+ Years',
        specialization: 'Vedic Rituals, Havan Puja, Hindu Ceremonies',
        services: 'Home Puja & Ritual Services',
        availability: 'Available for Home Services'
      },
  
      faqs: [
        {
          question: 'How can I hire a pandit online for Vedic rituals?',
          answer: 'You can choose the required puja or ritual service and continue with the booking process through the platform.'
        },
        {
          question: 'Does Pt. Satyam Dwivedi performs havan at home?',
          answer: 'Yes, he conducts havan ceremonies and other Hindu Vedic rituals at home with proper vidhi and guidance.'
        },
        {
          question: 'Can I book one pandit for multiple Hindu rituals together?',
          answer: 'Yes, multiple puja rituals and havan ceremonies can be arranged together based on your preferred date and ceremony requirements.'
        }
      ]
    },


    // ─── Pt. Anupam Kumar Shukla ────────────────────────────────────────────────────
'pandit-anupam-kumar-shukla': {

    // 1. H1 Heading (page ka main heading)
    h1: 'Pt. Anupam Kumar Shukla | Satyanarayan Katha & Rudrabhishek Services',
  
    // 2. Intro Section (Services section ke upar)
    intro: {
      heading: 'Traditional Puja Services',
      content: [
        `Pt. Anupam Kumar Shukla performs Satyanarayan Puja, Rudrabhishek, Shiv Puja, and traditional Katha rituals with proper vidhi and spiritual guidance. Families planning home pujas and devotional ceremonies can perform Satyanarayan Katha, Rudrabhishek rituals, and other important Hindu ceremonies with proper Vedic guidance. He also conducts home rituals focused on spiritual peace, positivity, and devotional harmony for families.`
      ]
    },
  
    // 3. About Section
    about: {
      heading: 'Pandit Ji Overview',
      content: [
        `Pt. Anupam Kumar Shukla is an experienced Vedic pandit with over 10 years of involvement in `,
        { link: { text: 'Hindu rituals and spiritual ceremonies', href: 'https://adhyatmah.com/book-pandit-online' } },
        `. He specializes in Satyanarayan Puja, Rudrabhishek, Shiv Puja, and Katha Paath performed according to proper Vedic traditions and ritual discipline.\n\n`,
        `Families looking for Satyanarayan Katha, Rudrabhishek rituals, and home puja ceremonies can perform traditional spiritual rituals with proper guidance and peaceful devotional practices for family occasions and religious gatherings at home.`
      ]
    },
  
    // 4. Additional Details
    details: {
      experience: '10+ Years',
      specialization: 'Satyanarayan Puja, Rudrabhishek, Shiv Puja, Katha Paath',
      services: 'Home Puja & Ritual Services',
      availability: 'Available for Home Services'
    },
  
    // 5. FAQ Section
    faqs: [
      {
        question: 'How can I book a pandit for Satyanarayan Puja?',
        answer: 'You can choose the Satyanarayan Puja service and continue with the booking process through the platform.'
      },
      {
        question: 'Does Pt. Anupam Kumar Shukla performs Rudrabhishek at home?',
        answer: 'Yes, he conducts Rudrabhishek, Shiv Puja, and other traditional Hindu rituals at home with proper vidhi and guidance.'
      },
      {
        question: 'Can I book a pandit for Satyanarayan Puja and Rudrabhishek together?',
        answer: 'Yes, both puja rituals can be arranged together based on your preferred date and ceremony requirements.'
      }
    ]
  },

  // ─── Pandit Brijesh Shukla ──────────────────────────────────────────────────────
'pandit-brijesh-shukla': {

    // 1. H1 Heading
    h1: 'Pandit Brijesh Shukla | Grah Shanti & Vedic Ritual Services',
  
    // 2. Intro Section
    intro: {
      heading: 'Traditional Puja Services',
      content: [
        `Pandit Brijesh Shukla performs grah shanti puja, Satyanarayan Katha, havan ceremonies, and other traditional Hindu rituals with proper vidhi and spiritual guidance. Families planning home pujas and religious ceremonies can participate in traditional rituals performed with discipline, sincerity, and Vedic practices suited for important family occasions and spiritual gatherings.`
      ]
    },
  
    // 3. About Section
    about: {
      heading: 'Pandit Ji Overview',
      content: [
        `Pandit Brijesh Shukla is an experienced Vedic pandit with over 25 years of involvement in Hindu rituals and traditional puja ceremonies. He specializes in grah shanti puja, Satyanarayan Katha, griha pravesh rituals, havan ceremonies, and other spiritual practices conducted according to proper Vedic customs and discipline.\n\n`,
        `Families looking for `,
        { link: { text: 'home puja rituals', href: 'https://adhyatmah.com/book-pandit-online' } },
        ` and traditional Hindu ceremonies can conduct spiritual occasions with proper guidance and peaceful ritual practices suited for family gatherings, devotional ceremonies, and religious functions at home.`
      ]
    },
  
    // 4. Additional Details
    details: {
      experience: '25+ Years',
      specialization: 'Grah Shanti Puja, Satyanarayan Katha, Griha Pravesh Rituals, Havan Ceremonies',
      services: 'Multiple Puja & Ritual Services',
      availability: 'Available for Home Services'
    },
  
    // 5. FAQ Section
    faqs: [
      {
        question: 'How can I book a pandit for puja?',
        answer: 'You can choose the required puja service and continue with the booking process through the platform.'
      },
      {
        question: 'What types of puja services are available?',
        answer: 'Services include grah shanti puja, Satyanarayan Katha, griha pravesh rituals, havan ceremonies, and other traditional Hindu rituals.'
      },
      {
        question: 'Can I choose puja based on my requirement?',
        answer: 'Yes, puja rituals and spiritual ceremonies can be selected according to your preferred occasion and family requirements.'
      }
    ]
  },
  
  // ─── Pandit Ashish Shukla ──────────────────────────────────────────────────────
  'pandit-aashish-shukla': {
  
    // 1. H1 Heading    
    h1: 'Pandit Ashish Shukla | Satyanarayan Katha & Home Puja Services',
  
    // 2. Intro Section
    intro: {
      heading: 'Traditional Puja Services',
      content: [
        `Pandit Ashish Shukla performs Satyanarayan Katha, griha pravesh puja, havan ceremonies, and other traditional Hindu rituals with proper vidhi and spiritual guidance. Families planning home pujas and devotional ceremonies can participate in traditional rituals performed with sincerity, discipline, and proper Vedic practices suited for family occasions and spiritual gatherings.`
      ]
    },
  
    // 3. About Section
    about: {
      heading: 'Pandit Ji Overview',
      content: [
        `Pandit Ashish Shukla is an experienced katha pandit known for conducting Satyanarayan Katha and `,
        { link: { text: 'traditional Hindu rituals', href: 'https://adhyatmah.com/book-pandit-online' } },
        ` according to proper Vedic customs and spiritual discipline. He specializes in griha pravesh puja, havan ceremonies, and devotional rituals performed with proper guidance and attention to traditional practices.\n\n`,
        `Families looking for Satyanarayan Katha, home puja rituals, and spiritual ceremonies can participate in traditional devotional occasions with peaceful ritual practices suited for family gatherings and religious functions at home.`
      ]
    },
  
    // 4. Additional Details
    details: {
      experience: '25+ Years',
      specialization: 'Satyanarayan Katha, Griha Pravesh Puja, Havan Ceremonies',
      services: 'Puja Services & Katha Rituals',
      availability: 'Available for Home Services'
    },
  
    // 5. FAQ Section
    faqs: [
      {
        question: 'How can I book a pandit for Satyanarayan Katha?',
        answer: 'You can choose the Satyanarayan Katha service and continue with the booking process through the platform.'
      },
      {
        question: 'What services does Pandit Ashish Shukla provide?',
        answer: 'He performs Satyanarayan Katha, griha pravesh puja, havan ceremonies, and other traditional Hindu rituals at home.'
      },
      {
        question: 'Is home puja service available?',
        answer: 'Yes, puja rituals and spiritual ceremonies are available at home with proper vidhi and traditional guidance.'
      }
    ]
  },

  // ─── Pt. Deepak Panday ──────────────────────────────────────────────────────
'pandit-deepak-panday': {

    h1: 'Pt. Deepak Panday | Dosh Nivaran & Grah Shanti Puja Specialist',
  
    intro: {
      heading: 'Traditional Puja Services',
      content: [
        `Pt. Deepak Panday is known for performing grah shanti puja, vastu shanti rituals, and dosh nivaran ceremonies with proper Vedic vidhi and discipline. Families looking to `,
        { link: { text: 'book pandit for grah shanti puja', href: 'https://adhyatmah.com/book-pandit-online' } },
        ` or home rituals can book traditional puja services performed with care and spiritual guidance. He also conducts havan and other puja ceremonies focused on peace, positivity, and harmony at home.`
      ]
    },
  
    about: {
      heading: 'Pandit Ji Overview',
      content: [
        `Pt. Deepak Panday is an experienced pandit with over 25 years of involvement in Hindu rituals and `,
        { link: { text: 'traditional puja ceremonies', href: 'https://adhyatmah.com/book-pandit-online' } },
        `. He specializes in grah shanti puja, vastu shanti rituals, dosh nivaran puja, and home havan ceremonies performed with proper vidhi and attention to detail.\n\n`,
        `For families seeking guidance for home rituals and spiritual ceremonies, he offers a calm and traditional approach that helps maintain positivity, balance, and peaceful family surroundings. His services are suited for grah shanti rituals, vastu-related ceremonies, and other important puja occasions at home.`
      ]
    },
  
    details: {
      experience: '25+ Years',
      specialization: 'Grah Shanti Puja, Vastu Shanti Rituals, Dosh Nivaran Puja',
      services: 'Home Puja & Havan Rituals',
      availability: 'Available for Home Services'
    },
  
    faqs: [
      {
        question: 'How can I book a pandit for grah shanti puja?',
        answer: 'You can choose the grah shanti puja service and continue with the booking process directly through the platform.'
      },
      {
        question: 'Does Pt. Deepak Panday performs vastu shanti rituals at home?',
        answer: 'Yes, he performs vastu shanti puja, home havan ceremonies, and other traditional rituals with proper guidance and vidhi.'
      },
      {
        question: 'What is included in dosh nivaran puja?',
        answer: 'Dosh nivaran puja includes traditional rituals and havan performed to help reduce negative influences and maintain spiritual peace and harmony at home.'
      }
    ]
  },
  
  // ─── Pt. Sunil Mishra Vyas Ji ────────────────────────────────────────────────
  'pandit-sunil-mishra-vyas-ji': {
  
    h1: 'Pt. Sunil Mishra Vyas Ji | Vastu Shanti & Home Rituals',
  
    intro: {
      heading: 'Traditional Puja Services',
      content: [
        `Pt. Sunil Mishra Vyas Ji performs vastu shanti rituals, grah shanti puja, and other traditional home ceremonies with proper vidhi and guidance. Families planning grah shanti puja or home rituals can perform traditional ceremonies with proper guidance and spiritual discipline. He also conducts dosh nivaran puja and vastu-related ceremonies for important family occasions and home rituals.`
      ]
    },
  
    about: {
      heading: 'Pandit Ji Overview',
      content: [
        `Pt. Sunil Mishra Vyas Ji is known for performing vastu shanti puja and grah shanti rituals with a practical and traditional approach. With years of experience in Hindu rituals and home ceremonies, he ensures every puja is conducted properly while keeping the process simple and comfortable for families.\n\n`,
        `He regularly performs vastu puja, `,
        { link: { text: 'dosh nivaran puja', href: 'https://adhyatmah.com/book-pandit-online' } },
        `, griha pravesh rituals, and home havan ceremonies with proper Vedic practices. Families planning home rituals and spiritual ceremonies can perform traditional pujas in a peaceful and positive environment with proper Vedic guidance.`
      ]
    },
  
    details: {
      experience: '25+ Years',
      specialization: 'Vastu Shanti Puja, Grah Shanti Rituals, Dosh Nivaran Puja',
      services: 'Home Puja & Ritual Services',
      availability: 'Available for Home Services'
    },
  
    faqs: [
      {
        question: 'How can I book a pandit for grah shanti puja?',
        answer: 'You can choose the required puja service and continue with the booking process through the platform.'
      },
      {
        question: 'What puja services are available?',
        answer: 'Vastu shanti puja, grah shanti rituals, dosh nivaran puja, griha pravesh ceremonies, and other home rituals are available.'
      },
      {
        question: 'Is home service available?',
        answer: 'Yes, puja rituals and home ceremonies are conducted at home with proper vidhi and traditional practices.'
      }
    ]
  },
  
  // ─── Dr. Agnivesh Mishra ─────────────────────────────────────────────────────
  'dr-agniwesh-mishra-mishra': {
  
    h1: 'Dr. Agnivesh Mishra | Vedic Rituals & Home Puja Services',
  
    intro: {
      heading: 'Traditional Puja Services',
      content: [
        `Dr. Agnivesh Mishra performs traditional Vedic rituals, havan ceremonies, Rudrabhishek, Satyanarayan Puja, and other Hindu rituals with proper vidhi and spiritual guidance. Families planning home pujas and `,
        { link: { text: 'spiritual ceremonies', href: 'https://adhyatmah.com/book-pandit-online' } },
        ` can participate in traditional rituals guided by proper Vedic practices suited for devotional gatherings and important family occasions.`
      ]
    },
  
    about: {
      heading: 'Pandit Ji Overview',
      content: [
        `Dr. Agnivesh Mishra is an experienced Vedic pandit known for conducting Hindu rituals and spiritual ceremonies according to proper Vedic customs and traditional discipline. He specializes in Rudrabhishek, Satyanarayan Puja, grah shanti rituals, havan ceremonies, and other devotional practices performed with proper guidance and attention to traditional vidhi.\n\n`,
        `Families looking for home puja ceremonies, Vedic rituals, and spiritual practices can participate in traditional devotional occasions with peaceful ritual guidance suited for family gatherings, religious functions, and home ceremonies.`
      ]
    },
  
    details: {
      experience: '10+ Years',
      specialization: 'Vedic Rituals, Rudrabhishek, Satyanarayan Puja, Havan Ceremonies',
      services: 'Home Puja & Spiritual Ritual Services',
      availability: 'Available for Home Services'
    },
  
    faqs: [
      {
        question: 'How can I book a pandit for Vedic rituals?',
        answer: 'You can choose the required puja or ritual service and continue with the booking process through the platform.'
      },
      {
        question: 'What types of puja services are available?',
        answer: 'Services include Rudrabhishek, Satyanarayan Puja, grah shanti rituals, havan ceremonies, and other traditional Hindu rituals.'
      },
      {
        question: 'Are home puja services available?',
        answer: 'Yes, Vedic rituals and spiritual ceremonies are performed at home with proper vidhi and traditional guidance.'
      }
    ]
  },
  
  // ─── Pt. Satyam Mishra ───────────────────────────────────────────────────────
  'pandit-satyam-mishra': {
  
    h1: 'Pt. Satyam Mishra | Grah Shanti & Vastu Puja Rituals',
  
    intro: {
      heading: 'Traditional Puja Services',
      content: [
        `Pt. Satyam Mishra performs grah shanti puja, vastu rituals, and dosh nivaran ceremonies with proper vidhi and traditional Vedic practices. Families planning home rituals and spiritual ceremonies can perform grah shanti puja and other traditional Hindu rituals with proper guidance and discipline. He also conducts home pujas focused on peace, positivity, spiritual balance, and harmonious family surroundings.`
      ]
    },
  
    about: {
      heading: 'Pandit Ji Overview',
      content: [
        `Pt. Satyam Mishra is an experienced Vedic pandit known for conducting grah shanti puja, vastu puja, and dosh nivaran rituals according to traditional Hindu practices. Every ceremony is performed with sincerity, proper guidance, and attention to traditional vidhi to help families maintain spiritual balance and positive energy at home.\n\n`,
        `Families looking for `,
        { link: { text: 'grah shanti rituals', href: 'https://adhyatmah.com/book-pandit-online' } },
        `, vastu-related ceremonies, and home puja services can arrange traditional pujas and havan ceremonies with proper Vedic guidance for family occasions and spiritual practices.`
      ]
    },
  
    details: {
      experience: '10+ Years',
      specialization: 'Grah Shanti Puja, Vastu Rituals, Dosh Nivaran Ceremonies',
      services: 'Home Puja & Ritual Services',
      availability: 'Available for Home Services'
    },
  
    faqs: [
      {
        question: 'How can I book a pandit for Grah Shanti puja?',
        answer: 'You can choose the grah shanti puja service and continue with the booking process through the platform.'
      },
      {
        question: 'Does Pt. Satyam Mishra performs vastu rituals at home?',
        answer: 'Yes, he performs vastu puja, dosh nivaran ceremonies, and other traditional Hindu rituals at home with proper guidance and vidhi.'
      },
      {
        question: 'Can I book Grah Shanti and Dosh Nivaran rituals together?',
        answer: 'Yes, multiple puja rituals and home ceremonies can be arranged together based on your preferred date and ritual requirements.'
      }
    ]
  },
  
  // ─── Pt. Shivam Tiwari ───────────────────────────────────────────────────────
  'pandit-shivam-tiwari': {
  
    h1: 'Pt. Shivam Tiwari | Pitru Dosh & Shradh Ritual Services',
  
    intro: {
      heading: 'Traditional Puja Services',
      content: [
        `Pt. Shivam Tiwari performs pitru dosh puja, Narayan Bali rituals, Tripindi Shradh ceremonies, and other traditional ancestral rituals with proper vidhi and spiritual guidance. Families planning shradh rituals and `,
        { link: { text: 'spiritual ceremonies', href: 'https://adhyatmah.com/book-pandit-online' } },
        ` can participate in traditional pujas performed according to proper Vedic practices for ancestral peace and important family observances.`
      ]
    },
  
    about: {
      heading: 'Pandit Ji Overview',
      content: [
        `Pt. Shivam Tiwari is an experienced Vedic pandit known for conducting pitru dosh nivaran rituals and traditional shradh ceremonies according to proper Vedic customs and ritual discipline. He specializes in Narayan Bali puja, Tripindi Shradh, pind daan rituals, and pitru shanti ceremonies performed with sincerity, spiritual guidance, and attention to traditional practices.\n\n`,
        `Families looking for ancestral rituals, shradh ceremonies, and spiritual puja services can participate in traditional devotional occasions with peaceful ritual guidance suited for family traditions and religious observances at home.`
      ]
    },
  
    details: {
      experience: '10+ Years',
      specialization: 'Pitru Dosh Puja, Narayan Bali Rituals, Tripindi Shradh, Pind Daan Ceremonies',
      services: 'Shradh Rituals & Spiritual Puja Services',
      availability: 'Available for Home Services'
    },
  
    faqs: [
      {
        question: 'How can I book a pandit for pitru dosh puja?',
        answer: 'You can choose the required puja or shradh ritual service and continue with the booking process through the platform.'
      },
      {
        question: 'What rituals does Pt. Shivam Tiwari perform?',
        answer: 'He performs pitru dosh puja, Narayan Bali rituals, Tripindi Shradh ceremonies, pind daan rituals, and other traditional ancestral pujas.'
      },
      {
        question: 'Are shradh rituals and pind daan services available at home?',
        answer: 'Yes, shradh rituals, pind daan ceremonies, and spiritual puja services are performed with proper vidhi and traditional guidance according to family requirements.'
      }
    ]
  },
  
  // ─── Pt. Uday Kumar Dwivedi ──────────────────────────────────────────────────
  'uday-kumar-dwivedi': {
  
    h1: 'Pt. Uday Kumar Dwivedi | Griha Pravesh & Vastu Ritual Services',
  
    intro: {
      heading: 'Traditional Puja Services',
      content: [
        `Pt. Uday Kumar Dwivedi performs griha pravesh puja, vastu shanti rituals, grah shanti ceremonies, and other traditional Hindu rituals with proper vidhi and spiritual guidance. Families planning `,
        { link: { text: 'home ceremonies and spiritual occasions', href: 'https://adhyatmah.com/book-pandit-online' } },
        ` can participate in traditional pujas conducted with proper Vedic practices for peace, positivity, and harmonious home environments.`
      ]
    },
  
    about: {
      heading: 'Pandit Ji Overview',
      content: [
        `Pt. Uday Kumar Dwivedi is an experienced Vedic pandit known for conducting griha pravesh puja and vastu-related rituals according to proper Vedic customs and traditional discipline. He specializes in vastu shanti ceremonies, grah shanti rituals, home pujas, and spiritual practices performed with sincerity, proper guidance, and attention to traditional vidhi.\n\n`,
        `Families looking for griha pravesh ceremonies, vastu rituals, and home puja services can participate in traditional devotional occasions with peaceful ritual practices suited for family gatherings, spiritual observances, and positive beginnings at home.`
      ]
    },
  
    details: {
      experience: '10+ Years',
      specialization: 'Griha Pravesh Puja, Vastu Shanti Rituals, Grah Shanti Ceremonies',
      services: 'Home Puja & Spiritual Ritual Services',
      availability: 'Available for Home Services'
    },
  
    faqs: [
      {
        question: 'How can I book a pandit for griha pravesh puja?',
        answer: 'You can choose the required puja or ritual service and continue with the booking process through the platform.'
      },
      {
        question: 'What rituals does Pt. Uday Kumar Dwivedi perform?',
        answer: 'He performs griha pravesh puja, vastu shanti rituals, grah shanti ceremonies, and other traditional Hindu rituals for home occasions.'
      },
      {
        question: 'Are vastu shanti and grah shanti rituals available at home?',
        answer: 'Yes, vastu-related rituals and spiritual ceremonies are performed at home with proper vidhi and traditional guidance according to family requirements.'
      }
    ]
  },

  'pandit-karan-pandey': {

  h1: 'Pt. Karan Pandey | Vivah Sanskar & Family Ritual Services',

  intro: {
    heading: 'Traditional Puja Services',
    content: [
      `Pt. Karan Pandey performs vivah sanskar rituals, mundan ceremonies, marriage pujas, and other traditional Hindu family rituals with proper vidhi and spiritual guidance. Families planning `,
      { link: { text: 'wedding ceremonies and cultural occasions', href: 'https://adhyatmah.com/book-pandit-online' } },
      ` can participate in traditional pujas conducted according to proper Vedic practices for joyful celebrations, family traditions, and meaningful spiritual gatherings.`
    ]
  },

  about: {
    heading: 'Pandit Ji Overview',
    content: [
      `Pt. Karan Pandey is an experienced Vedic pandit known for conducting vivah sanskar rituals and traditional Hindu ceremonies according to proper Vedic customs and cultural practices. He specializes in marriage rituals, mundan ceremonies, family sanskar pujas, and devotional occasions performed with sincerity, proper guidance, and attention to traditional vidhi.\n\n`,
      `Families looking for wedding ceremonies, sanskar rituals, and home puja services can participate in traditional family occasions with peaceful ritual practices suited for cultural gatherings and important life events at home.`
    ]
  },

  details: {
    experience: '10+ Years',
    specialization: 'Vivah Sanskar Rituals, Marriage Ceremonies, Mundan Puja, Family Rituals',
    services: 'Family Puja & Sanskar Ritual Services',
    availability: 'Available for Home Services'
  },

  faqs: [
    {
      question: 'How can I book a pandit for vivah sanskar rituals?',
      answer: 'You can choose the required puja or sanskar ceremony and continue with the booking process through the platform.'
    },
    {
      question: 'What rituals does Pt. Karan Pandey perform?',
      answer: 'He performs vivah sanskar rituals, marriage ceremonies, mundan puja, and other traditional Hindu family rituals.'
    },
    {
      question: 'Are marriage and sanskar ceremonies available at home?',
      answer: 'Yes, wedding rituals, sanskar ceremonies, and family puja services are performed at home with proper vidhi and traditional guidance according to family requirements.'
    }
  ]
},

'pandit-anand-dev-pandey': {

  h1: 'Pandit Anand Dev Pandey | Planetary Dosh & Shani Puja Services',

  intro: {
    heading: 'Traditional Puja Services',
    content: [
      `Pandit Anand Dev Pandey performs planetary dosh pujas, Shani rituals, Brihaspati ceremonies, and other traditional Vedic rituals with proper vidhi and spiritual guidance. Families planning `,
      { link: { text: 'spiritual ceremonies and devotional occasions', href: 'https://adhyatmah.com/book-pandit-online' } },
      ` can participate in traditional pujas performed with proper Vedic guidance for peace, family wellbeing, and positive spiritual balance.`
    ]
  },

  about: {
    heading: 'Pandit Ji Overview',
    content: [
      `Pandit Anand Dev Pandey is an experienced Vedic pandit known for conducting planetary dosh rituals and traditional Hindu ceremonies according to proper Vedic customs and spiritual discipline. He specializes in Shani puja, Brihaspati rituals, graha dosh ceremonies, and spiritual practices performed with sincerity, proper guidance, and attention to traditional vidhi.\n\n`,
      `Families looking for graha dosh rituals, spiritual ceremonies, and home puja services can participate in traditional spiritual practices with peaceful ritual guidance suited for family observances, spiritual gatherings, and important personal occasions.`
    ]
  },

  details: {
    experience: '10+ Years',
    specialization: 'Planetary Dosh Puja, Shani Rituals, Brihaspati Ceremonies, Graha Shanti Practices',
    services: 'Spiritual Puja & Ritual Services',
    availability: 'Available for Home Services'
  },

  faqs: [
    {
      question: 'How can I book a pandit for planetary dosh puja?',
      answer: 'You can choose the required puja or spiritual ritual service and continue with the booking process through the platform.'
    },
    {
      question: 'What rituals does Pandit Anand Dev Pandey perform?',
      answer: 'He performs Shani puja, Brihaspati rituals, graha dosh ceremonies, and other traditional Vedic rituals for spiritual occasions.'
    },
    {
      question: 'Are Shani and graha dosh rituals available at home?',
      answer: 'Yes, spiritual rituals and planetary dosh ceremonies are performed at home with proper vidhi and traditional guidance according to family requirements.'
    }
  ]
},
  

'ambuj-tiwari': {

  h1: 'Pt. Ambuj Tiwari | Devotional Puja & Bhakti Ritual Services',

  intro: {
    heading: 'Traditional Puja Services',
    content: [
      `Pt. Ambuj Tiwari performs Hanuman puja, Sundarkand Path, Navratri rituals, and other devotional Hindu ceremonies with proper vidhi and spiritual guidance. Families planning `,
      { link: { text: 'devotional gatherings and spiritual occasions', href: 'https://adhyatmah.com/book-pandit-online' } },
      ` can participate in traditional pujas guided by proper Vedic practices for devotion, positivity, and meaningful family celebrations.`
    ]
  },

  about: {
    heading: 'Pandit Ji Overview',
    content: [
      `Pt. Ambuj Tiwari is an experienced Vedic pandit known for conducting devotional rituals and traditional Hindu ceremonies according to proper Vedic customs and spiritual discipline. He specializes in Hanuman puja, Sundarkand Path, Ram Navami ceremonies, Navratri rituals, and other devotional practices performed with sincerity, proper guidance, and attention to traditional vidhi.\n\n`,
      `Families looking for devotional ceremonies, bhakti rituals, and spiritual home pujas can participate in traditional spiritual practices with peaceful ritual guidance suited for family gatherings, devotional observances, and religious occasions at home.`
    ]
  },

  details: {
    experience: '10+ Years',
    specialization: 'Hanuman Puja, Sundarkand Path, Navratri Rituals, Devotional Ceremonies',
    services: 'Devotional Puja & Spiritual Ritual Services',
    availability: 'Available for Home Services'
  },

  faqs: [
    {
      question: 'How can I book a pandit for devotional puja services?',
      answer: 'You can choose the required puja or devotional ritual service and continue with the booking process through the platform.'
    },
    {
      question: 'What rituals does Pt. Ambuj Tiwari perform?',
      answer: 'He performs Hanuman puja, Sundarkand Path, Navratri rituals, Ram Navami ceremonies, and other devotional Hindu rituals.'
    },
    {
      question: 'Are devotional puja ceremonies available at home?',
      answer: 'Yes, devotional rituals and spiritual ceremonies are performed at home with proper vidhi and traditional guidance according to family requirements.'
    }
  ]
},
    // ─── Add more pandits below ─────────────────────────────────────────────────
    // 'vendor-slug-here': {
    //   h1: '...',
    //   intro: { heading: '...', content: [...] },
    //   about: { heading: '...', content: [...] },
    //   details: { experience: '...', specialization: '...', services: '...', availability: '...' },
    //   faqs: [{ question: '...', answer: '...' }]
    // }
  
  };