if (typeof requestAnimationFrame === 'undefined') {
	window.requestAnimationFrame = fn => setTimeout(fn, 100 / 6)
	window.cancelAnimationFrame = id => clearTimeout(id)
}

if (typeof console === 'undefined') {
	console = { log() {}, time() {}, timeEnd() {} }
}

const Counter = React.createClass({
	getInitialState() {
		return {
			text: '123123123'
		}
	},
	componentWillMount() {
		console.time('Counter mount')
	},
	componentDidMount() {
		console.timeEnd('Counter mount')
	},
	toNum(num, callback) {
		cancelAnimationFrame(this.rid)
		let { COUNT } = this.props
		let counting = () => {
			let { count } = this.props
			switch (true) {
				case count > num:
					COUNT('DECREMENT')
					break
				case count < num:
					COUNT('INCREMENT')
					break
				case count === num:
					return callback && callback()
			}
			this.rid = requestAnimationFrame(counting)
		}
		counting()
	},
	componentWillUpdate() {
		// debugger
		console.log('willUpdate', 'Counter')
		if (this.state.text === '123123123') {
			this.setState({
				text: '[text set by willUpdate]'
			})
		}
		console.log(this.state.text, 'WillUpdate')
		
	},
	componentDidUpdate() {
		console.log(this.state.text, 'DidUpdate')
		this;
		//debugger
		console.log('DidUpdate', 'Counter')
	},
	componentWillReceiveProps(nextProps) {
		let state = this.state
		console.log('Counter: receiveProps:setState', state === this.state)
	},
	shouldComponentUpdate(nextProps, nextState) {
		console.log('Counter: shouldComponentUpdate')
		return true
	},
	componentWillUnmount() {
		console.log('unmount', 'Counter')
	},
	getNum(e) {
		let num = parseInt(this.input.value, 10)
		if (typeof num === 'number') {
			this.toNum(num)
		}
	},
	getInput(input) {
		this.input = input
	},
	handleChange(e) {
		let text = e.target.value.replace(/[^\d]+/, '')
		this.setState({ text })
	},
	render() {
		let { props } = this
		let { COUNT } = props
		var img = <img
					src="http://ww3.sinaimg.cn/bmiddle/887790fagw1ezs0ci6qjxj20c10go0uf.jpg"
					ref="img"
					onLoad={()=>{
						if (this.refs == null) {
							debugger
						}
			          console.log('onload this.refs', this.refs)
			        }}
			        onError={()=>{
			          console.log('onerror this.refs', this.refs)
			        }}
		 />
		return (
			<div id="abc">
				<span ref={Math.random() > 0.5 ? '' : 'test-ref'} data-test="abaasdf">count: { props.count }</span>
				{' '}
				<button onClick={ () => COUNT('INCREMENT') }>+</button>
				{' '}
				<button onClick={ () => COUNT('DECREMENT') }>-</button>
				{' '}
				<button onClick={ () => COUNT('INCREMENT_IF_ODD') }>incrementIfOdd</button>
				{' '}
				<label htmlFor="myinput">input number:
					<input 
						type="text" 
						value={this.state.text}
						onChange={this.handleChange}
						ref={ this.getInput } 
						id="myinput" 
						name="myinput" />
				</label>
				<button onClick={ this.getNum }>run</button>
				<a href="adbadfasdf">test link</a>
				<p dangerouslySetInnerHTML={{ __html: 'test dangerouslySetInnerHTML: ' + Math.random().toString(36).substr(2)}}></p>
				{ Math.random() > 0.5 && img }
			</div>
		)
	}
})

var Example = React.createClass({
  getInitialState() {
    return {
      val: 0,
      test: 0
    };
  },

  componentDidMount() {
    this.setState({val: this.state.val + 1, test1: 1})
    console.log('didMount', this.state);    // log 1
    this.setState({val: this.state.val + 1, test2: 2});
    console.log('didMount', this.state);    // log 2

    setTimeout(() => {
      this.setState({val: this.state.val + 1});
      console.log('setTimeout:', this.state);  // log 3
      this.setState({val: this.state.val + 1});
      console.log('setTimeout:', this.state);  // log 4
    }, 4);
  },

  render() {
    return <p>{this.state.val}</p>;
  }
});

const Wrap = React.createClass({
	getInitialState() {
		return { count: 0 }
	},
	COUNT(type) {
		let { count } = this.state
		switch(type) {
			case 'INCREMENT':
			count += 1
			break
			case 'DECREMENT':
			count -= 1
			break
			case 'INCREMENT_IF_ODD':
			if (count % 2 === 0) {
				return
			}
			count += 1
			break
		}
		this.setState({ count })

	},
	componentWillMount() {
		console.time('Wrap mount')
		// let state = this.state
		// this.setState({
		// 	count: this.props.count
		// })
		// console.log('componentWillMount:setState', state === this.state)
	},
	componentDidMount() {
		console.timeEnd('Wrap mount')
		let state = this.state
		this.setState({
			count: this.props.count * 2
		})
		console.log('componentDidMount:setState', state === this.state)
	},
	componentWillUpdate() {
		// debugger
		console.log('willUpdate', 'Wrap')
	},
	componentDidUpdate() {
		//debugger
		console.log('DidUpdate', 'Wrap')
	},
	componentWillReceiveProps(props) {
		this.setState({
			count: props.count
		})
		console.log('Wrap:receiveProps')
	},
	shouldComponentUpdate() {
		console.log('Wrap: shouldComponentUpdate')
		return true
	},
	componentWillUnmount() {
		console.log('unmount', 'wrap')
	},
	render() {
		// let count = Math.random() > 0.5
		// ? <Counter ref="counter" count={ this.state.count } COUNT={ this.COUNT } />
		// : null
		return <div>
				<Counter ref="counter" count={ this.state.count } COUNT={ this.COUNT } />
				<Example />
			</div>
	}
})

let Stateless = function() {
	return <div>stateless</div>
}

React.render(<Stateless />, document.getElementById('container'))

let update = count => {
	return React.render(
		<Wrap count={ count } />,
		document.getElementById('container')
	)
}

let num = 10
console.log(update(num))
// setInterval(() => {
// 	update(num++)
// }, 1000)

// setTimeout(() => {
// 	React.unmountComponentAtNode(document.getElementById('container'))
// }, 1000)