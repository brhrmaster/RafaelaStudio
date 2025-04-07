import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { ModalContent } from '../../../models/models.component';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  templateUrl: './modal-generic.component.html',
  styleUrl: './modal-generic.component.css'
})
export class ModalComponent {

  @Input() modalContent!: ModalContent;
  @Output() onModalAction = new EventEmitter<string>();

  protected buttonPressed(action: string) {
    this.onModalAction.emit(action)
  }
}
