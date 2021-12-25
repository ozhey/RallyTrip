const links = [
    {
        path: '/products/roadbooks', name: 'סיפורי דרך', routes : []
    },
    {
        path: '/products/roadbook-holders', name: 'ספרי דרך', routes: [
            { path: '/products/roadbook-holders/accessories', name: 'אביזרים נלווים' },
            { path: '/products/roadbook-holders/mounts', name: 'תושבות' },
            { path: '/products/roadbook-holders/holders', name: 'ספרים' },
        ]
    },
    {
        path: '/products/icos', name: 'מדי מרחק', routes : []
    },
    {
        path: '/products/garmin', name: 'גרמין', routes: [
            { path: '/products/garmin/watches', name: 'שעונים' },
            { path: '/products/garmin/devices', name: 'מכשירים' },
            { path: '/products/garmin/garmin-mounts', name: 'תושבות' }
        ]
    },
    {
        path: '/products/communicators', name: 'דיבוריות', routes : []
    },
    // {
    //     path: '/products/towers', name: 'מגדלי ניווט', routes : []
    // },
    {
        path: '/products/wheels', name: 'גלגלים', routes : []
    },
    {
        path: '/products/grips', name: 'גריפים', routes : []
    },
    {
        path: '/products/gopro', name: 'GoPro', routes : []
    }
]

export { links };