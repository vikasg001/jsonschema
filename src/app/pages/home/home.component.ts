import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAccordion } from "@angular/material";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  configData: any;
  newJsonData: any;
  tabList: any;
  labelList: any;
  displayedColumns: any;
  selected = new FormControl(0);
  form: FormGroup;
  formData: any = {};
  selectedConnector:number = 0;

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.getJsonValidationData()
  }

  getJsonValidationData() {
    this.homeService.getValidationJSON('validation.json').subscribe(response_validation => {
      this.homeService.validationData = response_validation;
      this.getJsonData();
    }, (err) => {
      this.getJsonData();
    });
  }
  getJsonData() {
    this.homeService.getJSON('appConfig.json').subscribe(data => {
      this.configData = data
      this.tabList = Object.keys(this.configData);
      this.tabList = this.tabList.filter((data) => {
        if (this.homeService.validationData[data].__visible !== false) {
          return data;
        }
      });
      this.form = new FormGroup({});
      this.formData = data;
    });
  }

  createForm(selectedConnector: any) {
    console.log(selectedConnector);
    this.selectedConnector = this.tabList.indexOf(selectedConnector);
    this.convertObjectToArray(this.configData[selectedConnector], selectedConnector);
  }

  convertObjectToArray(obj, key) {
    var arr = [];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        var innerObj = {};
        innerObj['key'] = prop;
        innerObj['value'] = obj[prop];
        innerObj['type'] = this.homeService.checkTypeof(obj[prop]);
        innerObj['id'] = "formData['" + key + "']['" + prop + "']";
        innerObj['validation'] = this.homeService.checkTypeByValidation(innerObj['id'], innerObj['type']);
        arr.push(innerObj)
      }
    }
    this.newJsonData = arr;
  }

  onSubmit() {
    console.log(this.formData, 'Server Data');
  }

  onRefresh() {
    this.ngOnInit();
    this.createForm(this.tabList[this.selected.value]);
  }

  openAllPanels() {
    this.accordion.openAll();
  }
  closeAllPanels() {
    this.accordion.closeAll();
  }
}
