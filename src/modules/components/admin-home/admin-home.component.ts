import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  username;
  constructor() { }

  ngOnInit() {
    this.username= localStorage.getItem('uname');
  }

}
