import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HomeService } from '../../services/home.service';
@Component({
  selector: 'app-json-schema-form',
  templateUrl: './json-schema-form.component.html',
  styleUrls: ['./json-schema-form.component.scss']
})
export class JsonSchemaFormComponent implements OnInit {

  @Input('id') id: any;
  @Input('type') type: any;
  @Input('key') key: any;
  @Input('data') data: any;
  @Input('validation') mainValidation: any;
  @Input('parentIndex') parentIndex: number;
  @Input() form: FormGroup;
  @Input('formData') formData: any;

  infieldData: any;

  formfieldType = {
    input: ['string', 'number', 'text'],
    radio: ['boolean'],
    complex: ['object', 'array'],
    option: ['option']
  };

  constructor(public homeService: HomeService) {
   
  }

  ngOnInit() {
    if (this.type === 'object') {
      this.data = this.convertObjectToArray(this.data, this.id);
    }
    this.form = this.homeService.toFormGroup(this.data, this.key);
  }

  convertObjectToArray(obj, id) {
    var arr = [];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        var innerObj = {};
        innerObj['key'] = prop;
        innerObj['value'] = obj[prop];
        innerObj['type'] = this.homeService.checkTypeof(obj[prop]);
        innerObj['validation'] = this.homeService.checkTypeByValidation(id + "['" + prop + "']", innerObj['type']);
        if (this.parentIndex !== undefined) {
          innerObj['id'] = id + "[" + this.parentIndex + "]['" + prop + "']";
        } else {
          innerObj['id'] = id + "['" + prop + "']";
        }
        arr.push(innerObj)
      }
    }
    return arr;
  }

  addSection(data: any) {
    const _newObj = this.homeService.setObjectKeyValue(data[0]);
    console.log(_newObj);
    data.push(_newObj);
  }

  removeSection(data: any, index: number) {
    if (index > -1) {
      data.splice(index, 1);
    }
  }

  onUpdateChange(_obj: any) {
    if (_obj.fieldtype === 'number') {
      _obj.fieldvalue = Number(_obj.fieldvalue);
    }
    var value = 'this.' + _obj.Id;
    eval(value + ' = _obj.fieldvalue');
    console.log(eval(value));
  }

}



