import React, { Component, PropTypes } from 'react'

class Demo extends Component{
  render(){
     return (
       <div>
         <button
          onMouseDown={this.handleMouseDown}
          onTouchStart={this.handleTouchStart}>
          Toggle
         </button>
       </div>
     )
  }
}

export default Demo