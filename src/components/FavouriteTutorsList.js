import React from 'react';
import FavouriteTutor from './FavouriteTutor';
import { makeStyles } from '@material-ui/styles';

const useStylesFavourites = makeStyles(() => ({
    container: {
        minWidth: '700px',
        maxWidth: '800px',
        margin: 'auto'
    }
}));

function FavouriteTutorsList({ profile }) {
    const classesFavourites = useStylesFavourites();
    return (
        <div className={classesFavourites.container}>
            {
                profile.favouriteTutors?.map(favouriteTutor => (
                    <FavouriteTutor key={favouriteTutor._id} tutor={favouriteTutor} />
                ))
            }
        </div>
    )
}

export default FavouriteTutorsList
