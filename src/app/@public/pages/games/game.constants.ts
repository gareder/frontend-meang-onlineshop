export const GAMES_PAGES_INFO = {
    'platforms/sony': {
        title: 'Sony Games',
        description: `Here we'll find games for the Sony platforms such as Playstation 4, PSP,...`,
        platformsIds: ['19', '17', '18', '16', '15', '27'],
        topPrice: -1,
        stock: -1
    },
    'platforms/microsoft': {
        title: 'Microsoft Games',
        description: `Here we'll find games for the Microsoft platforms such as PC, Xbox,...`,
        platformsIds: ['1', '4', '14', '80'],
        topPrice: -1,
        stock: -1
    },
    'platforms/nintendo': {
        title: 'Nintendo Games',
        description: `Here we'll find games for the Nintendo platforms such as Nintendo 64, NintendoDS, Wii,...`,
        platformsIds: ['7', '8', '9', '13', '10', '105', '43', '49', '79', '26', '11'],
        topPrice: -1,
        stock: -1
    },
    'promotions/last-units': {
        title: 'Games about to run out of stock',
        description: `Here we'll find games which are about to run out of stock `,
        platformsIds: [],
        topPrice: -1,
        stock: 30
    },
    'promotions/offers': {
        title: 'Games with the last units and on sale',
        description: `Games with the last units and on sale. Don't miss the chance`,
        platformsIds: [],
        topPrice: 45,
        stock: 40
    },
};

export enum TYPE_OPERATION {
    PLATFORMS = 'platforms',
    PROMOTION = 'promotion'
}
