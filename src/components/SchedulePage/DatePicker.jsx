import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import "./App.css";

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
    };
  }
  onTrigger = (date) => {
    this.props.parentCallback(date);
  };

  render() {
    return (
      <div className="App">
        <SingleDatePicker
          placeholder="Pickup Date"
          numberOfMonths={1}
          date={this.state.date} // momentPropTypes.momentObj or null
          onDateChange={(date) => {
            this.setState({ date });
            this.onTrigger(date);
          }} // PropTypes.func.isRequired
          focused={this.state.focused} // PropTypes.bool
          onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
          id="your_unique_id" // PropTypes.string.isRequired,
        />
      </div>
    );
  }
}

export default DatePicker;
