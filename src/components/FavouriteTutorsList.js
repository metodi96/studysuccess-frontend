import React from 'react';
import FavouriteTutor from './FavouriteTutor';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

const useStylesFavourites = makeStyles(() => ({
    container: {
        minWidth: '700px',
        maxWidth: '800px',
        margin: 'auto',
        padding: '1rem'
    },
    containerTwo: {
        minWidth: '700px',
        maxWidth: '800px',
        margin: 'auto',
        paddingTop: '1rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
    },
    headline: {
        backgroundColor: 'white',
        padding: '0.5em',
        textAlign: 'center'
    }
}));

function FavouriteTutorsList({ profile }) {
    const classesFavourites = useStylesFavourites();
    return (
        <div className={classesFavourites.container}>
            <div className={classesFavourites.containerTwo}>
                <div className={classesFavourites.headline}>
                    <Typography style={{color: 'slategray', fontSize: '1.5em'}} component="h2">
                        <b>Your favourite tutors</b>
                    </Typography>
                </div>
            </div>
            {
                profile.favouriteTutors?.map(favouriteTutor => (
                    <FavouriteTutor key={favouriteTutor._id} tutor={favouriteTutor} />
                ))
            }
        </div>
    )
}

export default FavouriteTutorsList
