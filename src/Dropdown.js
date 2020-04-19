import React, { Component } from 'react';

class Dropdown extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      showMenu: false,
      statistic: "",
    };
    
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    //this.showTotalDeaths = this.showTotalDeaths.bind(this);
    this.refs = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    
  }
  
  showMenu(event) {
    event.preventDefault();
    
    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }
  
  closeMenu(event) {
    
    if (!this.dropdownMenu.contains(event.target)) {
      
      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });  
      
    }
  }


handleChange = e => {
  
    var url = "http://localhost:3001/data?type="
    var new_stat = url.concat(e.target.value)

    console.log(new_stat)
    this.setState({ statistic: new_stat }, () => {
      if (this.props.onChange) {
        //console.log(e.target.value);
        this.props.onChange(this.state);
      }
    })
  };



  render() {
    return (

      <div>

        <button onClick={this.showMenu}>
          Data Type
        </button>
        
        {
          this.state.showMenu
            ? (

              <div

                className="menu"
                ref={(element) => {
                  this.dropdownMenu = element;
                }}
              >
                <button value="total_deaths" onClick = {this.handleChange}> 
                Total Deaths 
                </button>
                {
                  this.state.showTotalDeaths
                  
                }
                <button value="total_cases" onClick = {this.handleChange}> 
                Total Cases 
                </button>

                <button value="new_deaths" onClick = {this.handleChange}> 
                New Deaths
                </button>

                <button value="new_cases" onClick = {this.handleChange}> 
                New Cases
                </button>


              </div>
            )
            : (
              null
            )
        }



      </div>
    );
  }
}
export default Dropdown;