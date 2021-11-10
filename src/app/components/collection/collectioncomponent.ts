import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
    videoslist$;

  constructor(private http: HttpClient, private router: Router) {
    this.videoslist$ = this.http.get('http://localhost:3000/uploadedvideos')
  }

  gotovideo(video: string) {
    this.router.navigate(["video", video])
  }

  ngOnInit(): void {
   }

}
