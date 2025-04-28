import { inject } from "@angular/core";
import { ModalContent } from "../models/models.component";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "./modal/modal-generic/modal-generic.component";

export abstract class BaseTela {
  protected currentModal!: NgbModalRef;
  protected modalService = inject(NgbModal);

  protected abstract modalAction(action: string): Promise<void>;

  protected openModal(modalContent: ModalContent): void {
    this.currentModal = this.modalService.open(ModalComponent);
    this.currentModal.componentInstance.modalContent = modalContent;
    this.currentModal.componentInstance.onModalAction.subscribe(async (action:string) => await this.modalAction(action));
  }
}
