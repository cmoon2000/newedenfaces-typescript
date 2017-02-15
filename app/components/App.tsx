import * as React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

class App extends React.Component<any, any> {
	render() {
		return (
			<div>
				<Navbar history={this.props.router}/>
				{this.props.children}
				<Footer />
			</div>
		);
	}
}

export default App;