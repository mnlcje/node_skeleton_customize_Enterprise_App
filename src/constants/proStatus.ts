export const PROStatus = {
    DEM: { start: 1, end: 5 },
    CNF: { start: 6, end: 6 },
    PCNF: { start: 1, end: 1 },
    REL: { start: 2, end: 2 },
    CRTD: { start: 3, end: 5 },
    MSPT: { start: 3, end: 3, in: '7,9,10' },
    MSPTRescheduled: { start: 3, end: 3, in: '1,2' },
    MSPTCreatedSub: { start: 3, end: 3, in: '3,8' },
    MSPTRMReview: { start: 3, end: 3, in: '4' },
    MSPTMTBA: { start: 3, end: 3, in: '5,6' },
    MANC: { start: 5, end: 5 },
    MTA: { start: 3, end: 4, in: '7,9,10' },
    MACM: { start: 4, end: 4 },
    MTASub: { start: 3, end: 3, in: '10' },
    MTARM: { start: 3, end: 3, in: '9' },
    MTABlend: { start: 3, end: 3, in: '7' }
}
