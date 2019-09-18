import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  formfieldType = {
    input: ['string', 'number', 'text'],
    radio: ['boolean'],
    complex: ['object', 'array'],
    option: ['option']
  };
  formData: any = {};
  validationData: any = {};
  constructor(private http: HttpClient) { }

  public getJSON(jsonFileName): Observable<any> {
    const url = `assets/${jsonFileName}`;
    return this.http.get(url);
  }

  public getValidationJSON(jsonFileName): Observable<any> {
    const url = `assets/${jsonFileName}`;
    return this.http.get(url);
  }

  toFormGroup(questions: any, key?: any) {
    let group: any = {};
    if (this.checkTypeof(questions) !== 'array') {
      group[key] = new FormControl(questions);
    } else {
      questions.forEach(question => {
        if (this.formfieldType.radio.indexOf(question.type) > -1) {
          group[question.key] = new FormControl(question.value);
        }
        if (this.formfieldType.input.indexOf(question.type) > -1) {
          group[question.key] = new FormControl(question.value);
        }
      });

    }
    return new FormGroup(group);
  }

  checkTypeof(label: any) {
    if (Array.isArray(label)) {
      return 'array';
    } else {
      return typeof label;
    }
  }

  checkTypeByValidation(id: any, preType: any) {
    var ret = id.replace('formData', ' ').replace('[0]', '').replace('[1]', '').replace('[2]', '').replace('[3]', '');
    try {
      if (eval('this.validationData' + ret) !== undefined) {
        return eval('this.validationData' + ret);
      } else {
        return {
          "Type": (preType == 'string' ? 'text' : preType)
        }
      }
      
    } catch (err) {
      return {
        "Type": (preType == 'string' ? 'text' : preType)
      }
    }

  }

  getObjects(obj, key, val, newVal) {
    const newValue = newVal;
    let objects = [];
    for (const i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] == 'object') {
        objects = objects.concat(this.getObjects(obj[i], key, val, newValue));
      } else if (i == key && obj[key] == val) {
        obj[key] = newVal;
        console.log(obj);
      }
    }
    this.formData = obj;
    console.log(this.formData, 'updated');
  }

  setObjectKeyValue(_obj: any) {
    var new_obj = {};
    var tempTypeText = {
      string: '',
      number: 0,
      boolean: false
    }
    for (var i in _obj) {
      if (typeof _obj[i] !== 'object') {
        const type = typeof _obj[i];
        new_obj[i] = tempTypeText[type];
      }
      if (Array.isArray(_obj[i])) {
        new_obj[i] = [];
        new_obj[i].push(this.setObjectKeyValue(_obj[i][0]));
      } else if (typeof _obj[i] === 'object') {
        new_obj[i] = {};
        new_obj[i] = this.setObjectKeyValue(_obj[i]);
      }
    }
    
    return new_obj;
  }

  filterObjectIsVisible() {

  }

}
