import React, { Component } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

const textContainer = {
    hidden: { 
        opacity: 1,
        scale: 0 ,
        transition: {
            delay: 0.3,
            when: "beforeChildren",
            staggerChildren: 0.1
        }
        },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delay: 0.3,
            type: "spring",
            stiffness: 400,
            damping: 40
        }
    }
  };

const photoContainer = {
    hidden: { 
        scale: 0 ,
        transition: {
            delay: 0.3,
            type: "spring",
            stiffness: 260,
            damping: 20
        }
        },
    visible: {
        rotate: 180,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
        }
    }
}
const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};




const texts = ["Hi there :) ", "I am Jiaxin, a first yr master student @Umich"]
class Opening extends Component{
    constructor(props){
        super(props)
        this.state = {
            visibility: 1,
            display: 'flex'
        }
        this.clickExplore = this.clickExplore.bind(this)
    }
    clickExplore(e){
        e.preventDefault();
        this.setState({visibility: 0, display: 'none'})
        this.props.onExplore()
    }
    render(){
        return (
            // style={{visibility: this.state.visibility?'visible':'hidden' }} 
        <div className="opening" style={{display: this.state.display}}>
            <motion.img
              className="openingPhoto"
              variants={photoContainer}
              initial="hidden"
              animate={this.state.visibility?'visible':'hidden' }
              src="./react-client/dist/img/Snapseed.jpg"
            />
            <div className="openingTextWrapper">
                <motion.div
                className="openingTextContainer"
                variants={textContainer}
                initial="hidden"
                animate={this.state.visibility?'visible':'hidden' }
                >
                    
                <motion.div className="openingTextFirst" variants={item}><span className="openingTextFirst">{texts[0]}</span></motion.div> 
                <motion.div className="openingText" variants={item}><span className="openingText">{texts[1]}</span></motion.div>     
                </motion.div>

                <motion.div
                className="openingButtonContainer"
                variants={textContainer}
                initial="hidden"
                animate={this.state.visibility?'visible':'hidden' }
                >
                    <motion.button className="glow-on-hover" onClick={this.clickExplore}>
                        Explore
                    </motion.button>
                </motion.div>
            
            </div>
            
        </div>
        )
    }

}

export default Opening;