import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, copyArrayItem, transferArrayItem} from '@angular/cdk/drag-drop';

import { DynamicFormModel, DynamicFormService,DynamicInputModel, DynamicTextAreaModel, DynamicFormControlComponent,DynamicFormControlModel, DynamicCheckboxModel } from "@ng-dynamic-forms/core";
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  previewFormModel: DynamicFormModel = [];
  previewFormGroup: FormGroup;
  formModel: DynamicFormModel = [];
  formGroup: FormGroup;
  fieldData: DynamicFormControlModel;
  fieldDataJSON = '';
  formData = null;
  fieldDataType ='';

  trackByFn(index: any, item: any) {
    return index;
  }

  editField(id) {
    var formField = this.formModel.find(x => x.id == id);
    
    if(formField != null)
    {
      this.fieldData = formField;
      this.fieldDataType = formField.type;
      //this.fieldDataJSON = JSON.stringify(this.fieldData);
    }
  }

  updateField(fieldattribute,field)
  {
    var formField;
    switch(field.type) {
      case "INPUT": {
        formField = this.formModel.find(x => x.id == field.id) as DynamicInputModel;
        break;
      }
      case "TEXTAREA": {
        formField = this.formModel.find(x => x.id == field.id) as DynamicTextAreaModel;
        break;
      }
      case "CHECKBOX": {
        formField = this.formModel.find(x => x.id == field.id) as DynamicCheckboxModel;
        break;
      }
    }
    if (fieldattribute.key == "_value") {
      formField.valueUpdates.next(fieldattribute.value);
    } else {
      this.fieldData[fieldattribute.key] = fieldattribute.value;
    }
    // alternatively, if your not bothered about updating the value, then comment the above out,
    // and uncomment below:
    //this.fieldData[fieldattribute.key] = fieldattribute.value;
  }

  addTextBox() {
    var dynamicInputModel = new DynamicInputModel({
      id:(this.formModel.length+1).toString(),
      label:"Textbox",
      maxLength:20,
      placeholder:"Placeholder Text",
      value:""
    });
    this.formModel.push(dynamicInputModel);
    this.formGroup = this.formService.createFormGroup(this.formModel);
    this.formData = this.formModel;
  }

  addTextArea() {
    var dynamicTextAreaModel = new DynamicTextAreaModel({
      id:(this.formModel.length+1).toString(),
      label:"Textarea",
      placeholder: "Placeholder Text",
      value:""
    })
    this.formModel.push(dynamicTextAreaModel);
    this.formGroup = this.formService.createFormGroup(this.formModel);
    this.formData = this.formModel;
  }

  addCheckbox() {
    var dynamicCheckboxModel = new DynamicCheckboxModel({
      id:(this.formModel.length+1).toString(),
      label:"Checkbox"
    })
    this.formModel.push(dynamicCheckboxModel);
    this.formGroup = this.formService.createFormGroup(this.formModel);
    this.formData = this.formModel;
  }

  previewForm() {
    this.previewFormModel = this.formModel;
    this.previewFormGroup = this.formService.createFormGroup(this.previewFormModel);
  }

  constructor(private formService: DynamicFormService) {}

    ngOnInit() {
        this.formGroup = this.formService.createFormGroup(this.formModel);
        this.previewFormGroup = this.formService.createFormGroup(this.formModel);
    }

    drop(event: CdkDragDrop<string[]>) {
      if (event.previousContainer === event.container) {
        // sort
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        // drag and drop
        copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);                
      }
    }
}
