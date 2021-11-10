import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {

  searchTerm

  constructor(public dataService: DataService) {}

  ngOnInit(): void {}

  onSearch(){
    this.dataService.filteredItems(this.searchTerm)
  }

}

