import React, { Component } from "react";
import "./FieldMapper.css";
import MappedFieldsTable from "./MappedFieldsTable";

class FieldMapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      leftFields: [
        "First Name",
        "Last Name",
        "Contact ID",
        "Master Record ID ",
        "Account ID",
        "Salutation",
        "Street",
        "City",
        "State/Provinces",
        "Zip/Postal Code",
        "End_date",
        "Frequency_of_giving",
        "Ward",
      ], // Replace with your Salesforce fields
      rightFields: [
        "First Name",
        "Last Name",
        "Contact ID",
        "Master Record ID ",
        "Account ID",
        "Salutation",
        "Street",
        "City",
        "State/Provinces",
        "Zip/Postal Code",
        "End_date",
        "Frequency_of_giving",
        "Ward",
      ], // Initialize with an empty array for CallHub fields
      mappings: [{}], // Initialize with an empty mapping array
      addedInputs1: [], // This array is being used for disabling the used fields
      addedInputs2: [],
      selectedInput1: {}, // this array is being used for storing left data points
      selectedInput2: {}, // this array is being used for storing right data points
    };
  }

  handleMappingChange = (index, side, value) => {
    // Insert data in a new object based on index and right and left
    if (side === "left") {
      if (this.state.selectedInput1[index] == undefined) {
        this.state.selectedInput1[index] = value;
      } else {
        this.state.selectedInput1[index] = value;
      }
      let leftMappings = this.state.leftFields;
      let indexOfLeft = leftMappings.indexOf(value);
      leftMappings.splice(indexOfLeft, 1);
    }
    if (side === "right") {
      if (this.state.selectedInput2[index] === undefined) {
        this.state.selectedInput2[index] = value;
      } else {
        this.state.selectedInput2[index] = value;
      }
      let rightMappings = this.state.rightFields;
      let indexOfRight = rightMappings.indexOf(value);
      rightMappings.splice(indexOfRight, 1);
    }
    this.setState(this.state.selectedInput1);
    this.setState(this.state.selectedInput2);
  };

  handleMappingDelete = (index) => {
    // Clone the current mappings array
    const mappings = [...this.state.mappings];

    const leftAddedInput = this.state.addedInputs1;
    const rightAddedInput = this.state.addedInputs2;
    let leftMappings = this.state.leftFields;
    let rightMappings = this.state.rightFields;

    let leftItemIndex = leftAddedInput.indexOf(mappings[index].left);
    leftMappings.push(mappings[index].left);
    leftAddedInput.splice(leftItemIndex, 1);

    let rightItemIndex = rightAddedInput.indexOf(mappings[index].right);
    rightAddedInput.splice(rightItemIndex, 1);
    rightMappings.push(mappings[index].right);

    this.setState(leftMappings);
    this.setState(rightMappings);
    this.setState(leftAddedInput);
    this.setState(rightAddedInput);

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
    if (obj1len === obj2len) {
      this.state.mappings = [];
      for (let iterator = 0; iterator < obj1len; iterator++) {
        let selected1 = this.state.selectedInput1[iterator];
        let selected2 = this.state.selectedInput2[iterator];
        if (
          selected1 !== "" &&
          selected2 !== "" &&
          this.state.selectedInput1.index === this.state.selectedInput2.index
        ) {
          this.state.mappings.push({ left: selected1, right: selected2 });
          if (!this.state.addedInputs1.includes(selected1)) {
            this.state.addedInputs1.push(selected1);
          }
          if (!this.state.addedInputs2.includes(selected2)) {
            this.state.addedInputs2.push(selected2);
          }
          this.setState(this.state.addedInputs1);
          this.setState(this.state.addedInputs2);
          this.setState(this.state.mappings);
        } else {
          console.log("Index Count Mismatched");
        }
        this.state.selectedInput1.value = "";
        this.state.selectedInput2.value = "";
        this.setState(this.state.selectedInput1);
        this.setState(this.state.selectedInput2);
      }
    } else {
      alert("Please select both the field in each row");
    }
  };

  render() {
    const { leftFields, rightFields, mappings } = this.state;

    return (
      <div class="container">
        <h2 class="header">Field Mapper</h2>
        <div class="row">
          <div class="col-7">
            <h3>Salesforce Fields</h3>
            {mappings.map((mapping, index) => (
              <div key={index}>
                <p>{this.state.selectedInput1[index]}</p>
                <select
                  class="custom-select1"
                  value={mapping.left || ""}
                  onChange={(e) =>
                    this.handleMappingChange(index, "left", e.target.value)
                  }
                >
                  <option value="">Select Field</option>
                  {leftFields.map((field) =>
                    this.state.selectedInput1[index] === field ? (
                      <option disabled key={field} value={field} hidden>
                        {field}
                      </option>
                    ) : (
                      <option selected key={field} value={field}>
                        {field}
                      </option>
                    ),
                  )}
                </select>
              </div>
            ))}
          </div>
          <div class="col-5">
            <h3 class="col-7">CallHub Custom Fields</h3>
            {mappings.map((mapping, index) => (
              <div key={index}>
                <p class="col-6">{this.state.selectedInput2[index]}</p>
                <table>
                  <td>
                    <select
                      class="custom-select2"
                      value={mapping.right || ""}
                      onChange={(e) =>
                        this.handleMappingChange(index, "right", e.target.value)
                      }
                    >
                      <option value="">Select Field</option>
                      {rightFields.map((field) =>
                        this.state.selectedInput2[index] === field ? (
                          <option disabled key={field} value={field} hidden>
                            {field}
                          </option>
                        ) : (
                          <option selected key={field} value={field}>
                            {field}
                          </option>
                        ),
                      )}
                    </select>
                  </td>
                  <td>
                    <div class="dlt-btn">
                      <i
                        class="bi bi-trash"
                        style={{ fontSize: 1.5 + "em" }}
                        onClick={() => this.handleMappingDelete(index)}
                      ></i>
                    </div>
                  </td>
                </table>
              </div>
            ))}
          </div>
          <button
            class="btn ml-4 mb-4 custom-select1 map-btn"
            onClick={this.handleAddMapping}
          >
            Map Another Field
          </button>
          <button class="btn submit-btn" onClick={this.handleSubmit}>
            Submit
          </button>
          <MappedFieldsTable mappings={mappings}></MappedFieldsTable>
        </div>
      </div>
    );
  }
}
export default FieldMapper;
