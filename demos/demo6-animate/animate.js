/* eslint no-console:0, react/no-multi-comp:0 */
import Animate from '../../src/index'
import React, { Component,PropTypes } from 'react'
import ReactDOM from 'react-dom'

class Demo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: 0,
            x: 0,
            flag: true
        }
    }

    btClick(){
        let { width, flag, x } = this.state
        if(flag){
            width += 50
        }else{
            width -= 50
        }

        if(width === 0 || width === 100){
            flag = !flag
        }

        x += 20
        this.setState({width:width,flag:flag,x:x})
    }

    render() {
        let { width , x } = this.state

        return(
        <div>
            <button onClick={this.btClick.bind(this)}>start</button>
            <Animate
            component="div">
                <div className='translate' key='circle' style={{transform: `translate3d(${x}px, 0, 0)`}}></div>
                <div className='animate-prop' key='hello' style={{width:`${width}px`}}>hello</div>

            </Animate>
        </div>
        )
    }
}

ReactDOM.render(<Demo />, document.getElementById('content'))
