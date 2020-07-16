import React from 'react';
import FavouriteTutor from './FavouriteTutor';

function FavouriteTutorsList({ profile }) {
    return (
        <div>
            {
                profile.favouriteTutors?.map(favouriteTutor => (
                    <FavouriteTutor key={favouriteTutor._id} tutor={favouriteTutor} />
                ))
            }
        </div>
    )
}

export default FavouriteTutorsList
