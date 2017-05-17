/* eslint no-console:0, react/no-multi-comp:0 */

import './../assets/index.less';
import Animate from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

class Demo extends React.Component {
  state = {
    enter: true
  }

  toggleAnimate = () => {
    this.setState({
      enter: !this.state.enter
    });
  }

  render() {
    const style = {
      marginTop: '20px',
      width: '200px',
      height: '200px',
      backgroundColor: 'red',
    };
    return (
      <div>
        <button onClick={this.toggleAnimate}>toggle</button>
        <Animate
          component=""
          transitionName="fade" transitionAppear={true}
        >
          {this.state.enter ? <div key="1" style={style}/> : null}
        </Animate>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('content'));
