import React from 'react'

function CurrentBooking({booking}) {
    return (
        <div>
            <p>{booking.timeslotStart}</p>
            <p>{booking.timeslotEnd}</p>
            <p>{booking.participantNumber}</p>
            <p>{booking.tutor.firstname}</p>
            <p>{booking.subject.name}</p>
        </div>
    )
}

export default CurrentBooking
