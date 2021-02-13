import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { browserHistory } from 'react-router';
import HomePage from './HomePage';
import Opening from './Opening.jsx';
import { motion, AnimateSharedLayout } from "framer-motion";

const screens = [
  {
    title: "About",
    color: "#ff0055",
    path: "about",
  },
  {
    title: "Projects",
    color: "#ffaa00",
    path: "project",
  },
  {
    title: "Life",
    color: "#22cc88",
    path: "life",
  },
  {
    title: "Contact",
    color: "#0099ff",
    path: "contact",
  }
];

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      selected: -1
    }
    this.setSelected = this.setSelected.bind(this)
    this.onExplore = this.onExplore.bind(this)
  }

  setSelected(selected){
    this.setState({selected})
  } 

  onExplore(){
    console.log('click')
    this.setState({selected: 0})
  }

  render() {
    // console.log('render')
    return (
      <Router>
        <header> 
        <div style={{position: 'fixed'}}>
        <AnimateSharedLayout>
          <ol style={{ transform: "translateZ(0)" }}>
            {screens.map(({ title, color }, i) => (
              <motion.li
                animate
                key={i}
                className={`title ${i === this.state.selected && "selected"}`}
                style={{ color: i === this.state.selected ? color : "#dcd9d5" }}
                onClick={() => this.setSelected(i)}
              >
                {i === this.state.selected && (
                  <motion.div
                    layoutId="underline"
                    className="underline"
                    style={{ backgroundColor: color }}
                  />
                )}
                {title}
              </motion.li>
            ))}
          </ol>
        </AnimateSharedLayout>
      </div>
        </header>
         
        <Opening onExplore={this.onExplore}/>
        <Menu å/>
        {/* <div>
          
          <Route name="home" exact path="/" component={HomePage} />
        </div> */}
      </Router>
    )
  }
}
export default App;