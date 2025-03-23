import { Component, inject, Input, LOCALE_ID, DEFAULT_CURRENCY_CODE, Output, EventEmitter, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FormsModule } from '@angular/forms';
import { Model, ModalContent } from '../../../models/models.component';

registerLocaleData(localePt, 'pt');

@Component({
  selector: 'app-modal-confirm',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './modal-confirm.component.html',
  styleUrl: './modal-confirm.component.css'
})
export class ModalConfirmComponent {

  @Input() modalContent!: ModalContent;
	@Input() selectedModel!: Model;
  @Output() onModelConfirmed = new EventEmitter<boolean>();

  modalRef?: BsModalRef;
  message?: string;

  constructor(private modalService: BsModalService) {}

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef?.hide();
    this.onModelConfirmed.emit(true);
  }

  decline(): void {
    this.modalRef?.hide();
    this.onModelConfirmed.emit(false);
  }
}
