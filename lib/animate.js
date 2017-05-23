'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp, _initialiseProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ChildrenUtils = require('./ChildrenUtils');

var _AnimateChild = require('./AnimateChild');

var _AnimateChild2 = _interopRequireDefault(_AnimateChild);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultKey = 'rc_animate_' + Date.now();


function getChildrenFromProps(props) {
  var children = props.children;
  if (_react2.default.isValidElement(children)) {
    if (!children.key) {
      return _react2.default.cloneElement(children, {
        key: defaultKey
      });
    }
  }
  return children;
}

function noop() {}

var Animate = (_temp = _class = function (_Component) {
  _inherits(Animate, _Component);

  function Animate(props) {
    _classCallCheck(this, Animate);

    var _this = _possibleConstructorReturn(this, (Animate.__proto__ || Object.getPrototypeOf(Animate)).call(this, props));

    _initialiseProps.call(_this);

    _this.currentlyAnimatingKeys = {};
    _this.keysToEnter = [];
    _this.keysToLeave = [];
    _this.state = {
      children: (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(_this.props))
    };
    return _this;
  }

  _createClass(Animate, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var showProp = this.props.showProp;
      var children = this.state.children;
      if (showProp) {
        children = children.filter(function (child) {
          return !!child.props[showProp];
        });
      }
      children.forEach(function (child) {
        if (child) {
          _this2.performAppear(child.key);
        }
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      this.nextProps = nextProps;
      var nextChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(nextProps));
      var props = this.props;
      // exclusive needs immediate response

      if (props.exclusive) {
        Object.keys(this.currentlyAnimatingKeys).forEach(function (key) {
          _this3.stop(key);
        });
      }
      var showProp = props.showProp;
      var currentlyAnimatingKeys = this.currentlyAnimatingKeys;
      // last props children if exclusive
      var currentChildren = props.exclusive ? (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(props)) : this.state.children;
      // in case destroy in showProp mode
      var newChildren = [];
      if (showProp) {
        currentChildren.forEach(function (currentChild) {
          var nextChild = currentChild && (0, _ChildrenUtils.findChildInChildrenByKey)(nextChildren, currentChild.key);
          var newChild = void 0;
          if ((!nextChild || !nextChild.props[showProp]) && currentChild.props[showProp]) {
            newChild = _react2.default.cloneElement(nextChild || currentChild, _defineProperty({}, showProp, true));
          } else {
            newChild = nextChild;
          }
          if (newChild) {
            newChildren.push(newChild);
          }
        });
        nextChildren.forEach(function (nextChild) {
          if (!nextChild || !(0, _ChildrenUtils.findChildInChildrenByKey)(currentChildren, nextChild.key)) {
            newChildren.push(nextChild);
          }
        });
      } else {
        newChildren = (0, _ChildrenUtils.mergeChildren)(currentChildren, nextChildren);
      }

      // need render to avoid update
      this.setState({
        children: newChildren
      });

      nextChildren.forEach(function (child) {
        var key = child && child.key;
        if (child && currentlyAnimatingKeys[key]) {
          return;
        }
        var hasPrev = child && (0, _ChildrenUtils.findChildInChildrenByKey)(currentChildren, key);
        if (showProp) {
          var showInNext = child.props[showProp];
          if (hasPrev) {
            var showInNow = (0, _ChildrenUtils.findShownChildInChildrenByKey)(currentChildren, key, showProp);
            if (!showInNow && showInNext) {
              _this3.keysToEnter.push(key);
            }
          } else if (showInNext) {
            _this3.keysToEnter.push(key);
          }
        } else if (!hasPrev) {
          _this3.keysToEnter.push(key);
        }
      });

      currentChildren.forEach(function (child) {
        var key = child && child.key;
        if (child && currentlyAnimatingKeys[key]) {
          return;
        }
        var hasNext = child && (0, _ChildrenUtils.findChildInChildrenByKey)(nextChildren, key);
        if (showProp) {
          var showInNow = child.props[showProp];
          if (hasNext) {
            var showInNext = (0, _ChildrenUtils.findShownChildInChildrenByKey)(nextChildren, key, showProp);
            if (!showInNext && showInNow) {
              _this3.keysToLeave.push(key);
            }
          } else if (showInNow) {
            _this3.keysToLeave.push(key);
          }
        } else if (!hasNext) {
          _this3.keysToLeave.push(key);
        }
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var keysToEnter = this.keysToEnter;
      this.keysToEnter = [];
      keysToEnter.forEach(this.performEnter);
      var keysToLeave = this.keysToLeave;
      this.keysToLeave = [];
      keysToLeave.forEach(this.performLeave);
    }
  }, {
    key: 'isValidChildByKey',
    value: function isValidChildByKey(currentChildren, key) {
      var showProp = this.props.showProp;
      if (showProp) {
        return (0, _ChildrenUtils.findShownChildInChildrenByKey)(currentChildren, key, showProp);
      }
      return (0, _ChildrenUtils.findChildInChildrenByKey)(currentChildren, key);
    }
  }, {
    key: 'stop',
    value: function stop(key) {
      delete this.currentlyAnimatingKeys[key];
      var component = this.refs[key];
      if (component) {
        component.stop();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      this.nextProps = props;
      var stateChildren = this.state.children;
      var children = null;
      if (stateChildren) {
        children = stateChildren.map(function (child) {
          if (child === null || child === undefined) {
            return child;
          }
          if (!child.key) {
            throw new Error('must set key for <rc-animate> children');
          }
          return _react2.default.createElement(
            _AnimateChild2.default,
            {
              key: child.key,
              ref: child.key,
              animation: props.animation,
              transitionName: props.transitionName,
              transitionEnter: props.transitionEnter,
              transitionAppear: props.transitionAppear,
              transitionLeave: props.transitionLeave
            },
            child
          );
        });
      }
      var Component = props.component;
      if (Component) {
        var passedProps = props;
        if (typeof Component === 'string') {
          passedProps = {
            className: props.className,
            style: props.style
          };
        }
        return _react2.default.createElement(
          Component,
          passedProps,
          children
        );
      }
      return children[0] || null;
    }
  }]);

  return Animate;
}(_react.Component), _class.propTypes = {
  component: _propTypes2.default.any,
  animation: _propTypes2.default.object,
  transitionName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
  transitionEnter: _propTypes2.default.bool,
  transitionAppear: _propTypes2.default.bool,
  exclusive: _propTypes2.default.bool,
  transitionLeave: _propTypes2.default.bool,
  onEnd: _propTypes2.default.func,
  showProp: _propTypes2.default.string
}, _class.defaultProps = {
  animation: {},
  component: 'span',
  transitionEnter: true,
  transitionLeave: true,
  transitionAppear: false,
  onEnd: noop
}, _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.performEnter = function (key) {
    // may already remove by exclusive
    if (_this4.refs[key]) {
      _this4.currentlyAnimatingKeys[key] = true;
      _this4.refs[key].componentWillEnter(_this4.handleDoneAdding.bind(_this4, key, 'enter'));
    }
  };

  this.performAppear = function (key) {
    if (_this4.refs[key]) {
      _this4.currentlyAnimatingKeys[key] = true;
      _this4.refs[key].componentWillAppear(_this4.handleDoneAdding.bind(_this4, key, 'appear'));
    }
  };

  this.handleDoneAdding = function (key, type) {
    var props = _this4.props;
    delete _this4.currentlyAnimatingKeys[key];
    // if update on exclusive mode, skip check

    if (props.exclusive && props !== _this4.nextProps) {
      return;
    }
    var currentChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(props));
    if (!_this4.isValidChildByKey(currentChildren, key)) {
      // exclusive will not need this
      _this4.performLeave(key);
    } else {
      if (type === 'appear') {
        if (_util2.default.allowAppearCallback(props)) {
          props.onEnd(key, true);
        }
      } else {
        if (_util2.default.allowEnterCallback(props)) {
          props.onEnd(key, true);
        }
      }
    }
  };

  this.performLeave = function (key) {
    // may already remove by exclusive
    if (_this4.refs[key]) {
      _this4.currentlyAnimatingKeys[key] = true;
      _this4.refs[key].componentWillLeave(_this4.handleDoneLeaving.bind(_this4, key));
    }
  };

  this.handleDoneLeaving = function (key) {
    var props = _this4.props;
    delete _this4.currentlyAnimatingKeys[key];
    // if update on exclusive mode, skip check
    if (props.exclusive && props !== _this4.nextProps) {
      return;
    }
    var currentChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(props));
    // in case state change is too fast
    if (_this4.isValidChildByKey(currentChildren, key)) {
      _this4.performEnter(key);
    } else {
      var end = function end() {
        if (_util2.default.allowLeaveCallback(props)) {
          props.onEnd(key, false);
        }
      };
      if (!(0, _ChildrenUtils.isSameChildren)(_this4.state.children, currentChildren, props.showProp)) {
        _this4.setState({
          children: currentChildren
        }, end);
      } else {
        end();
      }
    }
  };
}, _temp);
exports.default = Animate;