import './App.css';
import React from 'react';

class App extends React.Component{
  state = {
    sessionLength: 25,
    breakLength: 5,
    timeLeft: 25*60,
    pauseClicked:false,
    buttonText:'Start',
    countdown:0,
    timerLabel:'Session'
  }  
  
  convertToTime = (seconds) => {
    const { timeLeft } = this.state;
    const mins = Math.floor(seconds/60);
    const secondsLeft = seconds%60;
    const display = `${mins < 10 ? '0' : ''}${mins}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
    return display
  }
  
  startCounting = () => {
    const { timeLeft, pauseClicked, buttonText } = this.state;
    const now = Date.now();
    const then = now + timeLeft*1000;
    
    this.setState({
      countdown:setInterval(() => {
        const { timeLeft, pauseClicked, countdown, buttonText, breakLength, sessionLength, timerLabel } = this.state;
        const audio = document.getElementById('beep');
        const secondsLeft = Math.round((then - Date.now())/1000);
        
        if(secondsLeft === 0){
          audio.play();
        }

      if(secondsLeft < 0) {
        this.setState({            
            timerLabel: timerLabel === 'Session' ? 'Break' : 'Session',
            timeLeft: timerLabel === 'Session' ? breakLength*60 : sessionLength*60,
            
          });
        
        this.stopCounting();
        this.startCounting();
        
        return;
        }
        
        this.setState({
        timeLeft:secondsLeft
       })
    
    },1000),
      pauseClicked: true,
      buttonText:'Pause'
    })
}
  
  stopCounting = () => {
    const { pauseClicked, countdown, buttonText } = this.state;
  
  this.setState({ 
    pauseClicked: false,
    buttonText: 'Resume',
    countdown:clearInterval(countdown)
  })
}
  
  changePause = () => {
  if(this.state.pauseClicked){
    this.stopCounting()
  } else {
    this.startCounting()
  }
}
  
 
  handleSettings = (e) => {
    const {sessionLength, breakLength, timerLabel, timeLeft, pauseClicked, buttonText} = this.state;
    
    switch (e.target.id) {      
      case 'session-decrement':{
         this.setState({
          sessionLength: sessionLength <= 1 ? 1 : sessionLength - 1,
           timeLeft:(sessionLength <= 1 ? 1 : sessionLength - 1)*60,
           timerLabel:'Session'
        });
        break;
      }
        
      case 'session-increment':{
        this.setState({
          sessionLength:sessionLength >= 60 ? 60 : sessionLength + 1,
          timeLeft:(sessionLength >= 60 ? 60 : sessionLength + 1)*60,
          timerLabel:'Session'
        });
        break;
      } 
        
      case 'break-decrement':{
         this.setState({
          breakLength: breakLength <= 1 ? 1 : breakLength - 1,
          timeLeft: (breakLength <= 1 ? 1 : breakLength - 1)*60,
           timerLabel:'Break'
        });
        break;
      }
      
      case 'break-increment':{
        this.setState({
          breakLength: breakLength >= 60 ? 60 : breakLength + 1,
          timeLeft: (breakLength >= 60 ? 60 : breakLength + 1)*60,
          timerLabel:'Break'
        });
        break;
      } 
       
      default:{
        this.stopCounting();
        const audio = document.getElementById('beep');
        audio.pause();
        audio.currentTime = 0;
        this.setState({
          sessionLength: 25,
          breakLength: 5,
          timeLeft:25*60,
          pauseClicked:false,
          buttonText:'Start',
          timerLabel:'Session'
        });
        
      }     
    }

  }
  
  render(){
    const { sessionLength, breakLength, timeLeft, buttonText, timerLabel } = this.state;
    
    return (
      <div className="container">
        <h1>Pomodoro Clock</h1>
        
        <div id="pomodoro">
          <img className="tomato" src="https://pngimg.com/uploads/tomato/tomato_PNG12599.png"/>
          <div id="timer-label">{timerLabel}</div>
          <div id="time-left">{this.convertToTime(timeLeft)}</div>
          <button id="start_stop" className="btn" onClick={this.changePause}>{ buttonText === 'Pause' ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i> } {buttonText}</button>        
        </div>
        
        <div className="settings">
         
          <div className="session">
            <p id="session-label">Session Length</p>
            <div className="btn-wrapper">
              <button id="session-decrement" className="btn" onClick={this.handleSettings}>-</button>
              <div id="session-length">{sessionLength}</div>
              <button id="session-increment" className="btn" onClick={this.handleSettings}>+</button>
            
            </div>
            
          </div>
          
          <button id="reset" className="btn" onClick={this.reset} onClick={this.handleSettings}><i className="fas fa-redo"></i></button>
        
          <div className="break">
            <p id="break-label">Break Length</p>
            <div className="btn-wrapper">
              <button id="break-decrement" className="btn" onClick={this.handleSettings}>-</button>              
              <div id="break-length">{breakLength}</div>
              <button id="break-increment" className="btn" onClick={this.handleSettings}>+</button>
              
            </div>
          </div>
        </div>
       
        <audio
          id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"/>
      </div>
    )
  }
}


export default App;
