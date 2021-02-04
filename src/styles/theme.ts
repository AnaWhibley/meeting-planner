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
