import React, { Component } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

const textContainer = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
 
const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

// function shuffle(a) {
//     var j, x, i;
//     for (i = a.length - 1; i > 0; i--) {
//         j = Math.floor(Math.random() * (i + 1));
//         x = a[i];
//         a[i] = a[j];
//         a[j] = x;
//     }
//     return a;
// }


const texts = ["Hi there :) ", "I am Jiaxin, a first yr master student @Umich"]
class Opening extends Component{
    constructor(props){
        super(props)
        this.state = {
            display: 1
        }
    }
    render(){
        return (
        <div className="opening">
            <motion.img
              className="openingPhoto"
              initial={{ scale: 0 }}
              animate={{ rotate: 180, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              src="./react-client/dist/img/Snapseed.jpg"
            />
            <div className="openingTextWrapper">
                <motion.div
                className="openingTextContainer"
                variants={textContainer}
                initial="hidden"
                animate="visible"
                >
                    {texts.map((value, index) => (
                    <motion.div key={index} className="openingText" variants={item}><span className="openingText">{value}</span></motion.div> 
                    ))}
                </motion.div>

                <motion.div
                className="openingButtonContainer"
                variants={textContainer}
                initial="hidden"
                animate="visible"
                >
                    <motion.button className="glow-on-hover">Explore</motion.button>
                </motion.div>
            
            </div>
            
        </div>
        )
    }

}

export default Opening;