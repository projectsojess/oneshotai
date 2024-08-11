export const appData = {
    appName: 'OneStopAi',
    maxFreeCredits: 100,
    verificationFromEmail: 'OneStopAi <onboarding@resend.dev>',
    resetFromEmail: 'OneStopAi <reset@resend.dev>',
    emailLogoUrl: 'https://codefast.in/logo-dark.png',
    emailLogoWidth: 300,
    emailLogoHeight:150,
    companyAddress: '',
    otpExpirationTime: 15,
    paypalClientId: 'AVqh29YMXPXMwd5Ew6Tj4WNLd9zvWzltxbXh7pJ_3Nj6zjhRvE3yfrayM_sdakpxi79gu4IsCx7_VwNi',
    plans:[
        {
            productId: 'PROD-9HD24180TD358921D',
            name: 'PRO',
            planId: 'P-9K65315108152841HM24IHWI',
            features:[
                "2100 Credits for media generation",
                "Buy more credits if needed",
                "Generate images from chat",
                "Generate audios from chat",
                "Save media files",
                "10 GB Storage included",
                "Buy extra storage if needed",
            ],
            price:20,
            currency:'USD',
            buttonText: "Subscribe Now",
            isSubscription: true,
            isPopular: false,
            popularText: 'Popular',
            recuring: "month"
        },
        {
            productId: 'PROD-3H23769918028521G',
            name: 'PREMIUM',
            planId: 'P-5LK77977P3958123BM233E5Q',
            features:[
                "5000 Credits for media generation",
                "Buy more credits if needed",
                "Generate images from chat",
                "Generate audios from chat",
                "Pin generated content to chats & projects",
                "Save media files",
                "50 GB Storage included",
                "Buy extra storage if needed",

            ],
            price:45,
            currency:'USD',
            buttonText: "Subscribe Now",
            isSubscription: true,
            isPopular: true,
            popularText: 'Popular',
            recuring: "month"
        },
        {
            productId: 'PROD-3H23769918028521G',
            name: 'ULTIMATE',
            planId: 'P-5LK77977P3958123BM233E5Q',
            features:[
                "Unlimitted media generation",
                "Generate images from chat",
                "Generate audios from chat",
                "Pin generated content to chats & projects",
                "Save media files",
                "Unlimitted Storage Storage included",
                "Buy extra storage if needed",
                "Early access to new features",
                "Early access to new models"

            ],
            price:100,
            currency:'USD',
            buttonText: "Buy Now",
            isSubscription: false,
            isPopular: false,
            popularText: 'Popular',
            recuring: "one-time"
        }
    ]
}