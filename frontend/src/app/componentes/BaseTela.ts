import { inject } from "@angular/core";
import { LoginResponseData, ModalContent } from "../models/models.component";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "./modal/modal-generic/modal-generic.component";

export abstract class BaseTela {
  protected user!: LoginResponseData;
  protected currentModal!: NgbModalRef;
  protected modalService = inject(NgbModal);

  constructor() {
    const currentUser = localStorage.getItem('currentUser');
    if(currentUser) {
      this.user = JSON.parse(currentUser);
    }
  }

  protected userIsAdmin(): boolean {
    return this.user && (this.user.tipo === 1)
  }

  protected userCanRead(): boolean {
    return this.user && (this.user.tipo === 1 || this.user.tipo === 2 || this.user.tipo === 3)
  }

  protected userCanAdd(): boolean {
    return this.user && (this.user.tipo === 1 || this.user.tipo === 2)
  }

  protected userCanEdit(): boolean {
    return this.user && (this.user.tipo === 1 || this.user.tipo === 2)
  }

  protected userCanDelete(): boolean {
    return this.user && (this.user.tipo === 1)
  }

  protected abstract modalAction(action: string): Promise<void>;

  protected openModal(modalContent: ModalContent): void {
    this.currentModal = this.modalService.open(ModalComponent);
    this.currentModal.componentInstance.modalContent = modalContent;
    this.currentModal.componentInstance.onModalAction.subscribe(async (action:string) => await this.modalAction(action));
  }
}
