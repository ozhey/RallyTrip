const PRODUCTS_ROOT = "/products/"
const links = [
    {
        path: PRODUCTS_ROOT + 'roadbooks', name: 'סיפורי דרך', routes : []
    },
    {
        path: PRODUCTS_ROOT + 'roadbook-holders', name: 'ספרי דרך', routes: [
            { path: PRODUCTS_ROOT + 'roadbook-holders/accessories', name: 'אביזרים נלווים' },
            { path: PRODUCTS_ROOT + 'roadbook-holders/mounts', name: 'תושבות' },
            { path: PRODUCTS_ROOT + 'roadbook-holders/holders', name: 'ספרים' },
        ]
    },
    {
        path: PRODUCTS_ROOT + 'icos', name: 'מדי מרחק', routes : []
    },
    {
        path: PRODUCTS_ROOT + 'garmin', name: 'גרמין', routes: [
            { path: PRODUCTS_ROOT + 'garmin/watches', name: 'שעונים' },
            { path: PRODUCTS_ROOT + 'garmin/devices', name: 'מכשירים' },
            { path: PRODUCTS_ROOT + 'garmin/garmin-mounts', name: 'תושבות' }
        ]
    },
    {
        path: PRODUCTS_ROOT + 'communicators', name: 'דיבוריות', routes : []
    },
    // {
    //     path: PRODUCTS_ROOT + 'towers', name: 'מגדלי ניווט', routes : []
    // },
    {
        path: PRODUCTS_ROOT + 'wheels', name: 'גלגלים', routes : []
    },
    {
        path: PRODUCTS_ROOT + 'grips', name: 'גריפים', routes : []
    },
    {
        path: PRODUCTS_ROOT + 'gopro', name: 'GoPro', routes : []
    },
    {
        path: PRODUCTS_ROOT + 'airbag-vests', name: 'אפוד מתנפח', routes : []
    }
]

export { links };