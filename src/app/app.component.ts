import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Form, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ComparefilesService } from './comparefiles.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public fileName = '';
  public fileTypesAccepted = '.txt,.json';
  public selecetdFile!: File;
  public formFile1 = this.getUploadFileObj();
  public formFile2 = this.getUploadFileObj();
  public acceptedFileTypesArray = this.fileTypesAccepted.split(',');
  public uploadErrMsgArr: Array<any> = [];
  public fcForm: FormGroup = new FormGroup({
    formFile1: new FormControl('', Validators.required),
    formFile2: new FormControl('', Validators.required)
  })
  @ViewChild('fileUpload1') fileUpload1Inp!: ElementRef;
  @ViewChild('fileUpload2') fileUpload2Inp!: ElementRef;
  constructor(
    private _http: HttpClient,
    private _compFilesService: ComparefilesService,
    private _sanitizer: DomSanitizer
  ){}

  getUploadFileObj() { return JSON.parse(JSON.stringify({ base64textString: '', fileSize: null })); }
  ngOnInit(): void {
  }
  Binarystring(extensionType: any, reqObj: any, callBackFunc: any) {
    const reader = new FileReader();
    reader.onload = () => {
      this.handleReaderLoaded(reader, extensionType, reqObj, callBackFunc);
    };
    reader.readAsBinaryString(this.selecetdFile);
  }
  getSanitisedText(provText: string) {
    return this._sanitizer.sanitize(SecurityContext.HTML, provText);
  }
  handleReaderLoaded(e: any, extensionType: any, reqObj: any, callBackFunc: any) {
    if (extensionType === '.txt' || extensionType === '.json') {
      reqObj.base64textString = this.getSanitisedText(e.result);
    }
    callBackFunc();
  }
  onFileSelected(event: any) {
    this.selecetdFile = event.target.files[0];
    const formFile1 = event.target.getAttribute('attr-inp') === 'formFile1';
    let reqObj:any;
    let inpContrl:string;
    if(formFile1){
      reqObj = this.formFile1;
      inpContrl = 'formFile1';
    } else {
      reqObj = this.formFile2;
      inpContrl = 'formFile2';
    }
    if (!this.selecetdFile) {
      return;
    }
    const extensionType = '.' + this.selecetdFile.name.substring(this.selecetdFile.name.lastIndexOf('.') + 1).toLowerCase();
    const hasValidFiles = this.acceptedFileTypesArray.includes(extensionType) || false;
    if (!hasValidFiles) {
      this.fcForm.controls[inpContrl].setValue('');
      this.uploadErrMsgArr = ['Invalid file format', 'Accepted file formats ' + this.fileTypesAccepted];
      alert(this.uploadErrMsgArr);
      return;
    }
    reqObj.fileSize = this.selecetdFile.size;
    if (this.selecetdFile.size <= 1 * 1024 * 1024) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selecetdFile);
      this.Binarystring(extensionType, reqObj, () => {
        if (reqObj.base64textString.trim() === '') {
          this.uploadErrMsgArr = ['Invalid File size'];
          alert(this.uploadErrMsgArr);
          this.fcForm.controls[inpContrl].setValue('');
          return;
        }
      });
    } else {
      this.uploadErrMsgArr = ['File size should not be greater than 1MB'];
      alert(this.uploadErrMsgArr);
      this.fcForm.controls[inpContrl].setValue('');
    }
  }
  
  compareFiles(){
    console.log('compareFiles func');
    const payloadObject = {
      file1: this.formFile1,
      file2: this.formFile2
    }
    this._compFilesService.compareFiles(payloadObject).subscribe((res) => {
      if (res) {
        alert('Successfully compared');
      }
    }, (err) => {
      alert(err);
    });
  }
  resetFiles(){
    this.fcForm.reset();
  }
}
