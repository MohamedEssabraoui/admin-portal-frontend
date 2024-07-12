import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import './header.css';


const useStyles = makeStyles({
  logoimg : {
    margin:0,
    padding:0,
    height:50
  },
  name :{
    margin : 20,
    color:'#07cfda'
  },
  logout_btn : {
    marginRight : '80%'
  },
  inlineblock : {
    display : 'contents'
  }
  ,
  inlineblockspace : {
    display : 'flex',
    justifyContent: 'space-between'
  }
})

const theme = createTheme({
  palette:{
    primary:{
      main:'#00000077'
    }
  }
})



export const HomepageHeader = (props)=>{
  const classes = useStyles();

  const handleLogout = () => {
    localStorage.removeItem('Token');
    window.location.reload();
  };
  let x;
  if(props.logout){
    x = <div className={classes.name} >
                  <button onClick={handleLogout} className={classes.logout_btn} >Logout</button>
        </div>;
  }
    return (
    <ThemeProvider theme={theme}>
      <AppBar>
        <Toolbar className={classes.inlineblockspace}>
              <div className={classes.inlineblock}>
                  <img src={props.img} alt="Logo" className={classes.logoimg}/>
                  <div className={classes.name} >
                    {/* {props.title} */}
                  </div>
              </div>
              {x}
        </Toolbar>

      </AppBar>
    </ThemeProvider>
      
  );
  
  
}