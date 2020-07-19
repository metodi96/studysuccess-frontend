import React from 'react';
import FavouriteTutor from './FavouriteTutor';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

const useStylesFavourites = makeStyles(() => ({
    container: {
        minWidth: '700px',
        maxWidth: '800px',
        margin: 'auto',
        padding: '1rem',
        borderRadius: '4px'
    },
    containerTwo: {
        minWidth: '700px',
        maxWidth: '800px',
        margin: 'auto',
        paddingTop: '1rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        borderRadius: '4px'
    },
    headline: {
        backgroundColor: 'white',
        padding: '0.5em',
        textAlign: 'center',
        borderRadius: '4px',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
    }
}));

const useStylesTutor = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        padding: '1em',
        borderRadius: '4px',
    },
    content: {
        backgroundColor: 'white',
        padding: '0.5em',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        borderRadius: '4px'
    },
    grid: {
        flexGrow: '1'
    },
    rating: {
        display: 'flex'
    },
    test: {
        fontWeight: 'bold'
    }
}));

function FavouriteTutorsList({ profile }) {
    const classesFavourites = useStylesFavourites();
    const classesTutor = useStylesTutor();
    return (
        <div className={classesFavourites.container}>
            {
                profile.favouriteTutors !== undefined && profile.favouriteTutors.length > 0 ?
                    <div>
                        <div className={classesFavourites.containerTwo}>
                            <div className={classesFavourites.headline}>
                                <Typography style={{ color: 'slategray', fontSize: '1.5em' }} component="h2">
                                    <b>Your favourite tutors</b>
                                </Typography>
                            </div>
                        </div>
                        {
                            profile.favouriteTutors?.map(favouriteTutor => (
                                <FavouriteTutor key={favouriteTutor._id} tutor={favouriteTutor} classesTutor={classesTutor} />
                            ))
                        }
                    </div>
                    :
                    <div>
                        <div className={classesFavourites.containerTwo}>
                            <div className={classesFavourites.headline}>
                                <Typography style={{ color: 'slategray', fontSize: '1.5em' }} component="h2">
                                    <b>Your favourite tutors</b>
                                </Typography>
                            </div>
                        </div>
                        <div className={classesTutor.container}>
                            <div className={classesTutor.content} style={{textAlign: 'center'}}>
                                <Typography component="h3">
                                    You currently don't have any favourite tutors.
                                </Typography>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default FavouriteTutorsList
