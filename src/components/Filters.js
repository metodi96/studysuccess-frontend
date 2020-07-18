import React, { useState, useContext, useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined';
import WbCloudyOutlinedIcon from '@material-ui/icons/WbCloudyOutlined';
import NightsStayOutlinedIcon from '@material-ui/icons/NightsStayOutlined';
import WeekendOutlinedIcon from '@material-ui/icons/WeekendOutlined';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { TutorsContext } from './TutorsContext';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: 'large'
  },
  buttons: {
    fontSize: 'small',
    display: 'inline-grid',
    textAlign: '-webkit-center',
    paddingRight: 7,
    alignContent: 'center'
  },
  languages: {
    width: 250,
    marginBottom: 20
  },
  actionButtons: {
    display: 'flex'
  },
  markedButton: {
    fontSize: 'small',
    display: 'inline-grid',
    textAlign: '-webkit-center',
    paddingRight: 7
  },
  wrapperBox: {
    backgroundColor: 'white',
    marginRight: '3%',
    borderRadius: '4px',
    minWidth: '26%',
    maxWidth: '26%',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    marginLeft: '1%'
    //marginLeft: '1%'
    //width: '100%',
    //maxWidth: 360,
    //backgroundColor: theme.palette.background.paper,
    //borderRadius: '20px'
  },
  insideBox: {

  }
}));

const useStylesIcon = makeStyles(() => ({
  clickedIcon: {
    color: 'goldenrod',
  }
}));
//const boxProperties = 
function valueLabelFormat(value) {
  return value + ' €';
}
function Filters(props) {
  const [dayTime, setDayTime] = useState(0);
  const [language, setLanguage] = useState('');
  const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
  const [languages, setLanguages] = useState([]);
  const { tutorsForSubject, setTutorsForSubject } = useContext(TutorsContext);
  const [maxTutorPriceVisible, setMaxTutorPriceVisible] = useState(0);
  const [marks, setMarks] = useState([]);
  const classesIcon = useStylesIcon();
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (maxTutorPriceVisible == 0 && tutorsForSubject.length > 0) {
      console.log("I am in isMounted");
      var maxPriceVisible = tutorsForSubject.map(tutor => tutor.pricePerHour).sort((a, b) => { return b - a })[0];
      if (maxPriceVisible !== undefined) {
        setMaxTutorPriceVisible(maxPriceVisible);
      } else {
        maxPriceVisible = 40;
        setMaxTutorPriceVisible(maxPriceVisible);
      }
      setMarks([{ value: 0, label: '0 €' }, { value: maxPriceVisible, label: maxPriceVisible + ' €' }]);
      setLanguages(() => {
        return tutorsForSubject.map(tutor => tutor.languages).flat().filter((v, i, a) => a.indexOf(v) === i);
      });
      console.log(tutorsForSubject);
    }
  });
  useEffect(() => {
    console.log(props.subjectId);
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
    else {
      window.location.reload();
    }
  }, [props.subjectId]);
  const [maxTutorPrice, setMaxTutorPrice] = useState(0);
  const submit = () => {
    setToken(window.localStorage.getItem('jwtToken'));
    //if(token != null) {
    let filtersObject = {};
    if (dayTime > 0) {
      filtersObject.dayTime = dayTime;
    }
    if (language !== '') {
      filtersObject.language = language;
    }
    if (maxTutorPrice > 0) {
      filtersObject.pricePerHour = maxTutorPrice;
    }
    axios.post(`http://localhost:5000/tutors/${props.subjectId}/filtered`, filtersObject)
      .then(result => {
        setTutorsForSubject(result.data);
        var maxPriceVisible = result.data.map(tutor => tutor.pricePerHour).sort((a, b) => { return b - a })[0];
        if (maxPriceVisible !== undefined) {
          setMaxTutorPriceVisible(maxPriceVisible);
        } else {
          maxPriceVisible = 40;
          setMaxTutorPriceVisible(maxPriceVisible);
        }

        setMarks([{ value: 0, label: '0 €' }, { value: maxPriceVisible, label: maxPriceVisible + ' €' }]);
        setLanguages(() => {
          return result.data.map(tutor => tutor.languages)[0];
        });
        console.log(result.data);
      })
      .catch(err => {
        console.log(`Something went wrong ${err}`);
      })
    //}
  }
  const clearFilters = () => {
    setDayTime(0);
    setLanguage('');
    setMaxTutorPrice(0);
  }

  const classes = useStyles();
  return (
      <Box className={classes.wrapperBox} width="90%" height="80%" bgcolor="white" py={2} pl={3} mr={3}>
        <Box fontSize='h5.fontSize' fontWeight='fontWeightMedium' textAlign='-webkit-center'>
          Filters
        </Box>
        <Box border={1} width='90%' mt={2} mb={3} textAlign='-webkit-center'>
          <Typography id="select-language-label" gutterBottom>
            Your availability
              </Typography>
          <IconButton onClick={() => { setDayTime(1) }}>
            <div className={dayTime == 1 ? classes.markedButton : classes.buttons}>
              <WbSunnyOutlinedIcon className={dayTime == 1 ? classesIcon.clickedIcon : ''}></WbSunnyOutlinedIcon>
                  8 AM - 2 PM
                </div>
          </IconButton>
          <IconButton onClick={() => { setDayTime(2) }}>
            <div className={dayTime == 2 ? classes.markedButton : classes.buttons}>
              <WbCloudyOutlinedIcon className={dayTime == 2 ? classesIcon.clickedIcon : ''}></WbCloudyOutlinedIcon>
                  2-8 PM
                </div>
          </IconButton>
          <IconButton onClick={() => { setDayTime(3) }}>
            <div className={dayTime == 3 ? classes.markedButton : classes.buttons}>
              <NightsStayOutlinedIcon className={dayTime == 3 ? classesIcon.clickedIcon : ''}></NightsStayOutlinedIcon>
                  8-11 PM
                </div>
          </IconButton>
          <IconButton onClick={() => { setDayTime(4) }}>
            <div style={{ textAlign: '-webkit-center' }} className={dayTime == 4 ? classes.markedButton : classes.buttons}>
              <WeekendOutlinedIcon className={dayTime == 4 ? classesIcon.clickedIcon : ''}></WeekendOutlinedIcon>
                  Weekends
                </div>
          </IconButton>
        </Box>
        <Box mb={3}>
          <FormControl>
            <InputLabel id="select-language-label">Tutor speaks</InputLabel>
            <Select
              labelId="select-language-label"
              id="select-language"
              value={language}
              onChange={event => { setLanguage(event.target.value) }}
              className={classes.languages}
            >
              {
                languages?.map((filterLanguage, index) => {
                  return <MenuItem key={index} value={filterLanguage}> {filterLanguage} </MenuItem>
                })
              }
            </Select>
          </FormControl>
        </Box>
        <Box mb={5}>
          <Typography id="price-slider" gutterBottom>
            Price per hour:
            </Typography>
          <Grid container spacing={7}>
            <Grid item xs={8}>
              <Slider value={maxTutorPrice} min={0} max={maxTutorPriceVisible} valueLabelDisplay="auto"
                marks={marks} step={1} onChange={(event, newValue) => { setMaxTutorPrice(newValue) }} aria-labelledby="price-slider"
                valueLabelFormat={valueLabelFormat} />

            </Grid>
          </Grid>
        </Box>
        <Box mb={2} ml="15%" className={classes.actionButtons}>
          <Box mr="28%">
            <Button variant="outlined" onClick={clearFilters}>Clear</Button>
          </Box>
          <Box>
            <Button variant="outlined" onClick={submit}>Apply</Button>
          </Box>
        </Box>
      </Box>
  )
}

export default Filters;