import { Component, inject, Input, LOCALE_ID, DEFAULT_CURRENCY_CODE, Output, EventEmitter } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import localePt from '@angular/common/locales/pt';
import { FormsModule } from '@angular/forms';
import { Model } from '../../models/models.component';

registerLocaleData(localePt, 'pt');

@Component({
  selector: 'app-modal',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  activeModal = inject(NgbActiveModal);

	@Input() selectedModel!: Model;
  @Output() onModelConfirmed = new EventEmitter<Model>();

  incluirModel(modal: NgbActiveModal): void {
    console.log('Item adicionado!');
    modal.close('Ok click');
    this.onModelConfirmed.emit(this.selectedModel);
  }
}
