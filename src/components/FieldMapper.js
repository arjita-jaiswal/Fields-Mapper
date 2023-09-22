import React, { Component } from 'react';
import './FieldMapper.css';
import MappedFieldsTable from './MappedFieldsTable';

class FieldMapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      leftFields: ['Field 1', 'Field 2', 'Field 3'], // Replace with your Salesforce fields
      rightFields: ['Field A', 'Field B', 'Field C'], // Initialize with an empty array for CallHub fields
      mappings: [{}], // Initialize with an empty mapping array
      addedInputs: [], // This array is being used for disabling the used fields
      selectedInput1: {}, // this array is being used for storing left data points 
      selectedInput2: {},// this array is being used for storing right data points
    };
  }

  handleMappingChange = (index, side, value) => {
    // Insert data in a new object based on index and right and left
    if(side == 'left') {
      if(this.state.selectedInput1[index] == undefined) {
        this.state.selectedInput1[index] = value;
      } else {
        this.state.selectedInput1[index] = value;
      }
    }
    if(side == 'right') {
        if(this.state.selectedInput2[index] == undefined) {
          this.state.selectedInput2[index] = value;
        }else {
          this.state.selectedInput2[index] = value;
        }
      }
  };

  handleMappingDelete = (index) => {
    // Clone the current mappings array
    const mappings = [...this.state.mappings];

    // Add Back removed data in left and right fields
    this.state.addedInputs.filter((item) => item !== mappings[index].left);
    this.state.addedInputs.filter((item) => item !== mappings[index].right);

    // Remove the mapping at the specified index
    mappings.splice(index, 1);
  

    // Update the state
    this.setState({ mappings });
  };

  handleAddMapping = () => {
    // Clone the current mappings array and add an empty mapping
    const mappings = [...this.state.mappings, {}];
    
    // Update the state
    this.setState({ mappings });
  };

  handleSubmit = () => {
    let obj1len = Object.keys(this.state.selectedInput1).length;
    let obj2len = Object.keys(this.state.selectedInput2).length;
    if(obj1len == obj2len) {
      this.state.mappings = [];
      for(let iterator=0; iterator < obj1len; iterator++) {
          let selected1 = this.state.selectedInput1[iterator];
          let selected2 = this.state.selectedInput2[iterator];
          if(selected1 != '' && selected2 != '' && this.state.selectedInput1.index == this.state.selectedInput2.index) {
            this.state.mappings.push({left: selected1, right: selected2});
            this.state.addedInputs.push(selected1);
            this.state.addedInputs.push(selected2);
            this.setState(this.state.addedInputs);
            this.setState(this.state.mappings);
            this.handleAddMapping();
          }
          else {
            console.log('Index Count Mismatched');
          }
          this.state.selectedInput1.value = '';
          this.state.selectedInput2.value = '';
          this.setState(this.state.selectedInput1);
          this.setState(this.state.selectedInput2);
        }
      }
      else {
        alert('Please select both the field in each row');
      }
  };

  render() {
    const { leftFields, rightFields, mappings } = this.state;

    return (
      <div class="container">
        <h2 class="header">Field Mapper</h2>
        <div class="row">
          <div class="col-5">
            <h3>Salesforce</h3>
            {mappings.map((mapping, index) => (
              <div key={index}>
                <select class="custom-select"
                  value={mapping.left || ''}
                  onChange={(e) => this.handleMappingChange(index, 'left', e.target.value)}>
                  <option value="">Select Field</option>
                  {leftFields.map((field) => (
                    this.state.addedInputs.includes(field) ? <option disabled key={field} value={field}>{field}</option> : <option key={field} value={field}>{field}</option>
                  ))}
                </select>
                </div>
              ))}
          </div>
          <div class="col-5">
          <h3>CallHub</h3>
          {mappings.map((mapping, index) => (
          <div key={index}>
            <select class="custom-select dropdown2"
              value={mapping.right || ''}
              onChange={(e) => this.handleMappingChange(index, 'right', e.target.value)}>
              <option value="">Select Field</option>
              {rightFields.map((field) => (
                this.state.addedInputs.includes(field) ? <option disabled key={field} value={field}>{field}</option> : <option key={field} value={field}>{field}</option>
              ))}
            </select>
            <div class="col-5 dlt-btn">
              <i class="bi bi-trash" style={{fontSize: 1.5 + 'em'}} onClick={() => this.handleMappingDelete(index)}></i>
            </div>
          </div>           
          ))}
          
        </div>
          <button class="btn btn-success mb-4 w-3" onClick={this.handleAddMapping}>Add Mapping</button>
          <button class="btn btn-success" onClick={this.handleSubmit}>Submit</button>
          <MappedFieldsTable mappings={mappings}></MappedFieldsTable>
        </div>
      </div>
    )
  }
};
export default FieldMapper;