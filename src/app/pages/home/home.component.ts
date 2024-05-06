import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  MinLengthValidator,
  Validators,
} from '@angular/forms';
import { sucursal } from 'src/models/sucursal';
import { RequestService } from 'src/service/request_service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [RequestService, DatePipe],
})
export class HomeComponent implements OnInit {
  public formData = new FormGroup({
    codigo: new FormControl('', [Validators.required]),
    identificacion: new FormControl('', [
      Validators.required,
      Validators.maxLength(250),
    ]),
    direccion: new FormControl('', [
      Validators.required,
      Validators.maxLength(250),
    ]),
    descripcion: new FormControl('', [
      Validators.required,
      Validators.maxLength(250),
    ]),
    moneda: new FormControl('', [Validators.required]),
    fechaCreacion: new FormControl('', [Validators.required]),
  });

  public isNew = true;
  public currency: any;
  public branchOfficeTemp: any;
  public branchOffice: any;
  public minDate: string;
  public branch_office_edit = new sucursal();

  constructor(
    private request_service: RequestService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.minDate = this.datepipe.transform(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
      'yyyy-MM-dd'
    );
    this.GetCurrency();
    this.GetBranchOffice();
  }

  GetCurrency() {
    this.request_service.GetRequest('api/currency').then((result) => {
      var response: any = result;
      if ((response.resultCode = 1)) this.currency = response.data;
      else this.showAlert('No se encontro tipos de moneda', 'error');
    });
  }

  GetBranchOffice() {
    this.request_service.GetRequest('api/branch_offices/all').then((result) => {
      var response: any = result;
      if ((response.resultCode = 1)) {
        this.branchOffice = response.data;
        this.branchOfficeTemp = response.data;
      }
    });
  }

  CreateBranchOffice() {
    this.request_service
      .PostRequest('api/branch_offices/add', this.formData.value)
      .then((result: any) => {
        var response: any = result;
        if (response.result == 1) {
          Swal.fire({
            text: 'Sucursal creada de manera correcta',
            icon: 'success',
          }).then(() => {
            window.location.reload();
          });
        } else {
          this.showAlert(response.message, 'error');
        }
      });
  }

  DeleteBranchOffice(id) {
    this.request_service
      .GetRequest('api/branch_offices/delete?id=' + id)
      .then((result: any) => {
        var response: any = result;
        if (response.result == 1) {
          Swal.fire({
            text: 'Sucursal eliminada de manera correcta',
            icon: 'success',
          }).then(() => {
            window.location.reload();
          });
        } else {
          this.showAlert('Ocurrio un error al eliminar la sucursal', 'error');
        }
      });
  }

  UpdateBranchOffice() {
    console.log(this.branch_office_edit);
    this.request_service
      .PostRequest('api/branch_offices/update', this.branch_office_edit)
      .then((result: any) => {
        var response: any = result;
        if (response.result == 1) {
          Swal.fire({
            text: 'Sucursal actualizada de manera correcta',
            icon: 'success',
          }).then(() => {
            window.location.reload();
          });
        } else {
          this.showAlert(response.message, 'error');
        }
      });
  }

  reload() {
    window.location.reload();
  }

  showFieldEdit(id) {
    this.branch_office_edit = this.branchOffice.find(
      (objeto) => objeto.id === id
    );
    this.branch_office_edit.fechaCreacion = this.datepipe.transform(
      this.branch_office_edit.fechaCreacion,
      'yyyy-MM-dd'
    );
    this.isNew = false;
  }

  showAlert(message: any, type: any) {
    Swal.fire({
      text: message,
      icon: type,
    });
  }

  isNumber(evt: any) {
    evt = evt ? evt : window.event;
    var charCode = evt.witch ? evt.witch : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    else return true;
  }

  filter(event) {
    console.log(event);
    const val = event.target.value.toLowerCase();
    // filter data
    const temp = this.branchOfficeTemp.filter(function (d) {
      return d.codigo.toLowerCase().indexOf(val) !== -1 || !val;
    });
    //update rows
    this.branchOffice = temp;
  }

  get codigo() {
    return this.formData.get('codigo') as FormControl;
  }

  get identificacion() {
    return this.formData.get('identificacion') as FormControl;
  }

  get moneda() {
    return this.formData.get('moneda') as FormControl;
  }

  get direccion() {
    return this.formData.get('direccion') as FormControl;
  }

  get descripcion() {
    return this.formData.get('descripcion') as FormControl;
  }

  get fechaCreacion() {
    return this.formData.get('fechaCreacion') as FormControl;
  }
}
