import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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

class NavBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      selected: this.props.selected
    }
    this.setSelected = this.setSelected.bind(this)
  }

  setSelected(selected){
    this.setState({selected})
  }

  render() {
    return (
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
    )
  }
}
export default NavBar;