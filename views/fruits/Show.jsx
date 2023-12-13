const React = require('react');
class Show extends React.Component {
    render () {
        const fruit = this.props.fruit;

        return (
            <div>
                <h1>Show Page</h1>
                <p>The {fruit.name} is {fruit.color}</p>
                {fruit.readyToEat ? 'It is ready to eat' : "NOT READY!"}
                <br/>
                <br/>
                <br/>
                <br/>
                <a href={`/fruits`}> Go Back To Fruits</a>
            </div>

        )
    }
}

module.exports = Show;