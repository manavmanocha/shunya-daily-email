import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-msg-modal',
  templateUrl: './msg-modal.component.html',
  styleUrls: ['./msg-modal.component.css']
})
export class MsgModalComponent implements OnInit {
  
  @Input() title = `Information`;
  @Input() msgText='Retry';
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
