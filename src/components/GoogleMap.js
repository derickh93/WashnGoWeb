import React, { Component } from "react";
import { GoogleApiWrapper } from "google-maps-react";
import "../App.css";

import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // for google map places autocomplete
      address: "",

      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},

      mapCenter: {
        lat: 49.2827291,
        lng: -123.1207375,
      },
    };
  }

  handleChange = (address) => {
    this.setState({ address });
  };

  handleSelect = (address) => {
    this.setState({ address });
    geocodeByAddress(address)
      .then((results) => {
        this.onTrigger(
          results[0].formatted_address,
          results[0].address_components
        );

        return results[0].formatted_address;
        //getLatLng(results[0]);
      })
      .then((fullAddr) => {
        // update center state
        this.setState({ mapCenter: fullAddr });
      })
      .catch((error) => console.error("Error"));
  };

  onTrigger = (addr, comps) => {
    //////////////////////////////////
    var zoneCheck;
    if (
      //comps[4].long_name === "Nassau County" ||
      //comps[5].long_name === "Nassau County" ||
      comps[4].long_name === "Queens County" ||
      comps[5].long_name === "Queens County"
    ) {
      zoneCheck = "In";
    } else {
      zoneCheck = "Out";
    }

    const results = { address: addr, zone: zoneCheck };
    //////////////////////////////////
    this.props.parentCallback(results);
    this.setState({ address: addr });
  };

  render() {
    return (
      <div id="googleMaps" style={{ padding: "10px" }}>
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div className="autocomplete_input">
              <input
                {...getInputProps({
                  placeholder: "Enter Address",
                  className: "location-search-input",
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const className = suggestion.active
                    ? "suggestion-item--active"
                    : "suggestion-item";
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: "#fafafa", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBF8DyH9rlRyQ_3rWiOJ6NdkR7D79D6S6A",
})(MapContainer);
