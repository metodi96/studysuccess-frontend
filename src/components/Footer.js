import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import CopyrightIcon from '@material-ui/icons/Copyright';

const useStylesFooter = makeStyles(() => ({
    root: {
        maxHeight: '35px',
        marginTop: 'calc(5% + 60px)',
        fontFamily: '"Titillium Web", sans-serif',
        marginLeft: '-7px',
        "& .MuiBottomNavigation-root": {
            height: '33px',
            justifyContent: 'left',
            backgroundColor: "rgba(152, 158, 157, 0.438)",
            position: 'absolute',
            width: '1518px'
        },
        "& .MuiBottomNavigationAction-label": {
            width: 'max-content'
        },
        "& .MuiBottomNavigationAction-root": {
            flex: '0'
        },
        bottom: '0%'
    }
}))

function Footer() {
    const classesFooter = useStylesFooter();

    return (
        <div className={classesFooter.root}>
            <BottomNavigation showLabels>

                <BottomNavigationAction disabled icon={<CopyrightIcon style={{ marginTop: '2px', marginLeft: '8px' }}></CopyrightIcon>} />
                <BottomNavigationAction disabled label={<span style={{ marginTop: '3px', marginLeft: '110px' }}>2020 StudySuccess. All rights reserved.</span>} />


            </BottomNavigation>
        </div>
    )

}

export default Footer

/*const FooterContainer = styled.div`
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100% !important;
  height: 100px !important ;
  background: #6cf;
  //
  max-height: 35px;
    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
    background: white;
    > p {
        text-align: center;
        margin-top: 4px;
`;  */