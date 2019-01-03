import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  constructor() { }
  username="";
  ngOnInit() {
    this.username= localStorage.getItem('uname');
  }

}
