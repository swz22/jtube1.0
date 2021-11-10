import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss'],
})
export class UploadPageComponent implements OnInit {
  title = 'upload-page';

  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  fileInputLabel: string;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      uploadedMedia: [''],
    });
  }

  onFileSelect(event) {
    const file = event.target.files[0];
    this.fileInputLabel = file.name;
    this.fileUploadForm.get('uploadedMedia').setValue(file);
  }

  onFormSubmit() {
    if (!this.fileUploadForm.get('uploadedMedia').value) {
      alert('Please fill valid details!');
      return false;
    }

    const formData = new FormData();
    formData.append(
      'uploadedMedia',
      this.fileUploadForm.get('uploadedMedia').value
    );
    formData.append('agentId', '007');

    this.http.post<any>('http://localhost:3000/uploadfile', formData).subscribe(
      (response) => {
        console.log(response);
        if (response.statusCode === 200) {
          // Reset the file input
          this.uploadFileInput.nativeElement.value = '';
          this.fileInputLabel = undefined;
        }
      },
      (er) => {
        console.log(er);
        alert(er.error.error);
      }
    );
  }
}
