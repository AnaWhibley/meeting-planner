import {createMuiTheme} from '@material-ui/core/styles';

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#6C63FF',
        },
        secondary: {
            main: '#FF6684',
        },
    },
    typography: {
        fontFamily: [
            'Nunito',
            'cursive',
        ].join(','),
        h1: {
            //bold
            fontWeight: 700,
            fontSize:  58,
        },
        h2: {
            //semibold
            fontWeight: 600,
            fontSize:  18,
        },
        h3: {
            //regular
            fontWeight: 400,
            fontSize: 18
        },
        h4: {
            //light
            fontWeight: 300,
        },
        subtitle1: {
            fontWeight: 300,
            fontSize: 16,
            color: "#B8B6B6"
        },
        subtitle2: {
            fontWeight: 300,
            fontSize: 14,
            color: "#B8B6B6"
        },
        body1: {
            fontWeight: 400,
            color: '#636262'
        },
        body2: {
            fontWeight: 600,
            fontSize: 14
        },
        button: {
            fontWeight: 600,
        },
        caption: {
            fontWeight: 600,
            fontSize: 16
        }
    },
});

export enum Color {
    PRIMARY = "primary",
    SECONDARY = "secondary",
}

//https://css-tricks.com/snippets/javascript/lighten-darken-color/
export function LightenDarkenColor(col: string, amt: number) {

    let usePound = false;

    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }

    let num = parseInt(col,16);

    let r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if  (r < 0) r = 0;

    let b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if  (b < 0) b = 0;

    let g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

export const colors = [
    '#9fd7b3',
    '#F2A49D',
    '#B8AFE7',
    '#86B8D4',
    '#DFE597',
    '#FFDAB7',
    '#FBC0CB',
    '#F69090',
    '#C8B4DD',
    '#B4EBE7'
];